"""
main.py
Flask entry point for the SnapPass AI Python service.
Runs on http://localhost:8000
"""

import logging
import os
import pathlib
import re
from flask import Flask, after_this_request, request, jsonify, send_file
from flask_cors import CORS
import config
from app.routes.process_routes import process_bp
from app.services.errors import ai_error_handler

logger = logging.getLogger(__name__)


def _safe_photo_path(raw: str) -> str:
    """
    Resolve raw to an absolute path and confirm it sits inside UPLOAD_DIR.

    Raises ValueError if the resolved path escapes the allowed directory,
    preventing path-traversal attacks via caller-supplied photo_path values
    such as '../../etc/passwd'.

    Args:
        raw: The photo_path value received from the request body.

    Returns:
        The resolved absolute path string if it is within UPLOAD_DIR.

    Raises:
        ValueError: If the resolved path is outside UPLOAD_DIR.
    """
    allowed_dir = pathlib.Path(config.UPLOAD_DIR).resolve()
    # Use only the final filename component — strip any directory traversal.
    resolved = (allowed_dir / pathlib.Path(raw).name).resolve()
    if not str(resolved).startswith(str(allowed_dir) + os.sep) and resolved != allowed_dir:
        raise ValueError("Invalid photo_path: file is outside the allowed upload directory.")
    return str(resolved)

app = Flask(__name__)
CORS(app)

os.makedirs(config.UPLOAD_DIR, exist_ok=True)

# Blueprints 
app.register_blueprint(process_bp)

# Health Check
@app.get("/health")
def health():
    return {"status": "ok", "service": "python-ai-service"}
# Face Quality Gate
@app.route("/face-quality-check", methods=["POST"])
def face_quality_check():
    from app.services.face_quality_gate import assess_face_quality
    
    data = request.get_json()
    file_path = data.get("file_path")
    
    if not file_path:
        return jsonify({"error": "file_path is required"}), 400
    
    try:
        report = assess_face_quality(file_path)
        return jsonify({
            "passed": report.passed,
            "face_count": report.face_count,
            "blur_score": report.blur_score,
            "rejection_code": report.rejection_code,
            "rejection_reason": report.rejection_reason,
            "user_hint": report.user_hint,
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# Sheet Generator
@app.route("/generate-sheet", methods=["POST"])
@ai_error_handler
def generate_sheet():
    from app.services.sheet_generator import generate_a4_sheet
    
    data= request.get_json()
    raw_photo_path = data.get("photo_path")
    # Sanitize preset_id to alphanumeric + dash/underscore only so it cannot
    # inject path separators into the output filename (e.g. '../evil').
    preset_id = re.sub(r"[^a-zA-Z0-9_\-]", "", data.get("preset_id", "35x45")) or "35x45"
    quantity= int(data.get("quantity", 8))
    bg_color= tuple(data.get("bg_color", [255, 255, 255]))
    draw_guides= bool(data.get("draw_guides", True))

    if not raw_photo_path:
        return jsonify({"error": "photo_path is required"}), 400

    try:
        photo_path = _safe_photo_path(raw_photo_path)
    except ValueError:
        return jsonify({"error": "Invalid photo_path."}), 400

    output_dir= os.environ.get("OUTPUT_DIR", "outputs")
    os.makedirs(output_dir, exist_ok=True)
    output_path= os.path.join(output_dir, f"sheet_{preset_id}.jpg")

    from app.services.sheet_generator import generate_a4_sheet
    saved = generate_a4_sheet(
        photo_path= photo_path,
        preset_id= preset_id,
        quantity= quantity,
        bg_color= bg_color,
        draw_guides= draw_guides,
        output_path= output_path,
    )
    return send_file(saved, mimetype="image/jpeg")

# Run 
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=config.PORT, debug=config.DEBUG)