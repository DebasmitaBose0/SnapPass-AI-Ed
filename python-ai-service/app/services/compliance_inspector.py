import cv2
import numpy as np
from dataclasses import dataclass
from typing import Optional, Tuple, Dict, Any
from PIL import Image
import io

# --- Rules (approximate heuristics) ---

# Passport-style tilt guidance (roll angle). Hard fail if abs(roll) > 3 degrees.
TILT_HARD_FAIL_DEG = 3.0

# Blur / Laplacian variance
BLUR_THRESHOLD = 80.0  # keep consistent with face_quality_gate.py

# Face size vs DPI readiness (heuristic):
# We estimate target pixels-per-inch by assuming the input image will be printed
# at 300 DPI after the pipeline crop/resize.
# If the face bounding box in the ORIGINAL is too small, it usually indicates
# an insufficient starting resolution for quality results.
#
# These thresholds are conservative heuristics.
MIN_FACE_W_PX_AT_ORIGINAL = 300
MIN_FACE_H_PX_AT_ORIGINAL = 375

# Lighting balance: compare left/right intensity variance (lower is better).
# Hard fail if one side is significantly darker.
LIGHTING_MAX_MEAN_DIFF = 35.0


@dataclass
class ComplianceItem:
    id: str
    title: str
    status: str  # pass | warn | fail
    detail: str
    code: Optional[str] = None


def _detect_face(gray: np.ndarray) -> Optional[Tuple[int, int, int, int]]:
    cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )
    faces = cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(60, 60))
    if len(faces) == 0:
        return None
    largest = max(faces, key=lambda r: r[2] * r[3])
    x, y, w, h = largest
    return int(x), int(y), int(w), int(h)


def _compute_laplace_blur_score(gray: np.ndarray) -> float:
    return float(cv2.Laplacian(gray, cv2.CV_64F).var())


def _estimate_roll_degrees(gray: np.ndarray, face_rect: Tuple[int, int, int, int]) -> float:
    # Heuristic roll estimation using gradients and orientation of face region.
    # This is NOT a full ICAO pose estimator, but gives a practical approximation.
    x, y, w, h = face_rect
    roi = gray[max(0, y):y + h, max(0, x):x + w]
    if roi.size == 0:
        return 0.0

    # Use PCA on edge coordinates to estimate dominant axis.
    edges = cv2.Canny(roi, 50, 150)
    ys, xs = np.where(edges > 0)
    if len(xs) < 50:
        return 0.0
    coords = np.column_stack([xs, ys]).astype(np.float32)
    mean = coords.mean(axis=0)
    centered = coords - mean
    cov = np.cov(centered.T)
    eigvals, eigvecs = np.linalg.eig(cov)
    principal = eigvecs[:, np.argmax(eigvals)]
    dx, dy = float(principal[0]), float(principal[1])
    angle_rad = np.arctan2(dy, dx)
    angle_deg = np.degrees(angle_rad)
    # Convert to relative roll angle in degrees around horizontal.
    return float(angle_deg)


def _lighting_balance(gray: np.ndarray, face_rect: Tuple[int, int, int, int]) -> Dict[str, float]:
    x, y, w, h = face_rect
    # Split face region into left/right halves
    roi = gray[max(0, y):y + h, max(0, x):x + w]
    if roi.size == 0:
        return {"left_mean": 0.0, "right_mean": 0.0, "mean_diff": 9999.0}

    half = w // 2
    left = roi[:, :half]
    right = roi[:, half:]

    left_mean = float(np.mean(left)) if left.size else 0.0
    right_mean = float(np.mean(right)) if right.size else 0.0
    mean_diff = float(abs(left_mean - right_mean))
    return {"left_mean": left_mean, "right_mean": right_mean, "mean_diff": mean_diff}


def _accessories_soft_warning(image: np.ndarray) -> Optional[ComplianceItem]:
    # Very lightweight heuristic: detect a strong dark border/area in upper face region
    # that might correspond to hats/glasses. This is intentionally soft.
    # NOTE: This is approximate and should be treated as warn only.
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    face_rect = _detect_face(gray)
    if not face_rect:
        return None
    x, y, w, h = face_rect

    upper = gray[max(0, y):y + int(h * 0.35), max(0, x):x + w]
    if upper.size == 0:
        return None

    # Count dark pixels in upper band
    thresh = np.percentile(upper, 20)
    dark_ratio = float(np.mean(upper < thresh))

    # If dark ratio is high, warn.
    if dark_ratio > 0.18:
        return ComplianceItem(
            id="accessories",
            title="Accessories / Glasses",
            status="warn",
            detail="Possible accessories (glasses/hat) detected. Many countries restrict these.",
            code="ACCESSORIES_POSSIBLE",
        )
    return None


def inspect_compliance(image_path: str) -> Dict[str, Any]:
    image = cv2.imread(image_path)
    if image is None:
        # Return a structured failure checklist
        return {
            "passed": False,
            "hard_fail": True,
            "items": [
                {
                    "id": "image_read",
                    "title": "Image validity",
                    "status": "fail",
                    "detail": "Could not decode image.",
                    "code": "UNREADABLE_IMAGE",
                }
            ],
        }

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    items = []

    # 1) Face detection
    face_rect = _detect_face(gray)
    if not face_rect:
        items.append({
            "id": "face",
            "title": "Face detection",
            "status": "fail",
            "detail": "No face detected. Photo must be a clear front-facing portrait.",
            "code": "NO_FACE_DETECTED",
        })
        return {
            "passed": False,
            "hard_fail": True,
            "items": items,
        }

    x, y, w, h = face_rect

    # 2) DPI & quality readiness (heuristic)
    dpi_status = "pass"
    dpi_detail = "Image resolution appears sufficient for 300 DPI printing."
    if w < MIN_FACE_W_PX_AT_ORIGINAL or h < MIN_FACE_H_PX_AT_ORIGINAL:
        dpi_status = "fail"
        dpi_detail = (
            f"Image resolution looks too low for 300 DPI quality (face: {w}×{h}px). "
            "Move closer and re-take the photo."
        )

    items.append({
        "id": "dpi_quality",
        "title": "DPI & Print Quality",
        "status": dpi_status,
        "detail": dpi_detail,
        "code": "LOW_RESOLUTION" if dpi_status == "fail" else None,
    })

    # 3) Blur
    blur_score = _compute_laplace_blur_score(gray)
    blur_status = "pass" if blur_score >= BLUR_THRESHOLD else "fail"
    blur_detail = (
        f"Image sharpness score: {blur_score:.1f} (min {BLUR_THRESHOLD})."
    )
    if blur_status == "fail":
        blur_detail = "Image is blurry. Take the photo in good lighting and hold the camera steady."

    items.append({
        "id": "blur",
        "title": "Sharpness",
        "status": blur_status,
        "detail": blur_detail,
        "code": "FACE_TOO_BLURRY" if blur_status == "fail" else None,
        "meta": {"blur_score": blur_score},
    })

    # 4) Tilt / roll
    roll_deg = _estimate_roll_degrees(gray, face_rect)
    tilt_status = "pass" if abs(roll_deg) <= TILT_HARD_FAIL_DEG else "fail"
    tilt_detail = (
        f"Estimated head tilt (roll): {roll_deg:.1f}° (limit ±{TILT_HARD_FAIL_DEG}°)."
    )
    if tilt_status == "fail":
        tilt_detail = f"Head tilt is outside the allowed range. Please align your head within ±{TILT_HARD_FAIL_DEG}°."

    items.append({
        "id": "tilt",
        "title": "Face Angle / Tilt",
        "status": tilt_status,
        "detail": tilt_detail,
        "code": "TILT_OUT_OF_RANGE" if tilt_status == "fail" else None,
        "meta": {"roll_deg": roll_deg},
    })

    # 5) Lighting balance / shadows
    lighting = _lighting_balance(gray, face_rect)
    mean_diff = lighting["mean_diff"]
    lighting_status = "pass" if mean_diff <= LIGHTING_MAX_MEAN_DIFF else "warn"
    lighting_detail = (
        f"Lighting balance diff: {mean_diff:.1f}. "
        "Aim for even illumination on both sides of your face."
    )
    if mean_diff > LIGHTING_MAX_MEAN_DIFF:
        lighting_detail = "One side of the face is darker (possible shadows). Try a well-lit, front-facing light source."

    items.append({
        "id": "lighting",
        "title": "Lighting & Shadows",
        "status": lighting_status,
        "detail": lighting_detail,
        "code": "SHADOWS_DETECTED" if lighting_status == "warn" else None,
        "meta": lighting,
    })

    # 6) Eyes open / gaze (very rough heuristic placeholder)
    # Without face landmarks, we keep this as warn only using contrast in eye band.
    eye_band = gray[max(0, y + int(h * 0.25)):y + int(h * 0.45), max(0, x):x + w]
    eye_contrast = float(np.std(eye_band)) if eye_band.size else 0.0
    eyes_status = "warn" if eye_contrast < 10.0 else "pass"
    eye_detail = (
        "Eyes appear open based on image contrast." if eyes_status == "pass" else
        "Possible closed eyes or poor eye visibility. Ensure your eyes are open and look at the camera."
    )
    items.append({
        "id": "eyes",
        "title": "Eyes & Expression",
        "status": eyes_status,
        "detail": eye_detail,
        "code": "EYES_MAY_BE_CLOSED" if eyes_status == "warn" else None,
        "meta": {"eye_contrast": eye_contrast},
    })

    # 7) Accessories/glasses (soft warning)
    acc_item = _accessories_soft_warning(image)
    if acc_item:
        items.append(acc_item.__dict__)

    hard_fail = any(i.get("status") == "fail" and i.get("id") in {"face", "dpi_quality", "blur", "tilt"} for i in items)
    passed = not hard_fail

    return {
        "passed": passed,
        "hard_fail": hard_fail,
        "items": items,
        "meta": {
            "face_rect": {"x": x, "y": y, "w": w, "h": h},
            "roll_deg": roll_deg,
            "blur_score": blur_score,
        },
    }

