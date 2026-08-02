"""
Composite Passport Compliance Scoring Module
Calculates an aggregate compliance index (0-100%) based on face resolution,
blur score, head ratio, and background uniformity.
"""

from typing import Dict, Any

def calculate_composite_score(metrics: Dict[str, Any]) -> Dict[str, Any]:
    """
    Given a set of image quality metrics, compute individual aspect scores
    and a final weighted composite compliance score with letter grading.
    """
    blur_score = metrics.get("blur_score", 100.0)
    face_width = metrics.get("face_width", 350)
    face_height = metrics.get("face_height", 450)
    background_uniformity = metrics.get("background_uniformity", 90.0)
    head_ratio = metrics.get("head_ratio", 0.75)
    
    # 1. Blur Score Component (max score at blur_score >= 120)
    blur_component = min(100.0, (blur_score / 120.0) * 100.0)

    # 2. Resolution Component (max score at face_width >= 300 & height >= 375)
    res_component = min(100.0, (face_width / 300.0) * 50.0 + (face_height / 375.0) * 50.0)

    # 3. Background Uniformity Component
    bg_component = min(100.0, max(0.0, background_uniformity))

    # 4. Head Ratio Component (ideal: 0.65-0.80)
    if 0.65 <= head_ratio <= 0.80:
        ratio_component = 100.0
    else:
        ratio_component = max(0.0, 100.0 - abs(head_ratio - 0.72) * 200.0)

    # Weighted aggregate score
    overall_score = round(
        0.35 * blur_component + 0.35 * res_component + 0.15 * bg_component + 0.15 * ratio_component, 
        1
    )
    
    if overall_score >= 90.0:
        grade = "A+"
        status = "EXCELLENT"
    elif overall_score >= 80.0:
        grade = "A"
        status = "PASS"
    elif overall_score >= 65.0:
        grade = "B"
        status = "ACCEPTABLE"
    else:
        grade = "F"
        status = "FAIL"

    return {
        "overall_score": overall_score,
        "grade": grade,
        "status": status,
        "breakdown": {
            "blur_rating": round(blur_component, 1),
            "resolution_rating": round(res_component, 1),
            "background_rating": round(bg_component, 1),
            "head_ratio_rating": round(ratio_component, 1),
        }
    }
