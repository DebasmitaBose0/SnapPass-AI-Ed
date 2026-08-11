"""
exception_handlers.py — Global Exception Interceptor
Built for ELUSoC 2026 / GSSOC 2026.
"""
from flask import jsonify

def handle_exception(e):
    response = {
        "success": False,
        "error": "INTERNAL_AI_EXCEPTION",
        "message": str(e)
    }
    return jsonify(response), 500
