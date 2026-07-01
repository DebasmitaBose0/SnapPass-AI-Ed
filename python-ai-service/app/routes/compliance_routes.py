from flask import Blueprint, request, jsonify
from app.services.compliance_inspector import inspect_compliance

compliance_bp = Blueprint("compliance", __name__)

@compliance_bp.post("/check")
def compliance_check():
    data = request.get_json(silent=True) or {}
    file_path = data.get("file_path")
    if not file_path:
        return jsonify({"error": "file_path is required"}), 400

    try:
        report = inspect_compliance(file_path)
        return jsonify(report)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

