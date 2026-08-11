"""
test_exception_handlers.py — Python Exception Handler Unit Tests
Built for ELUSoC 2026 / GSSOC 2026.
"""
from app.services.exception_handlers import handle_exception

def test_handle_exception(app):
    with app.test_request_context():
        resp, code = handle_exception(ValueError("Test exception"))
        assert code == 500
