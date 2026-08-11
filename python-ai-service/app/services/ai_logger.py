"""
ai_logger.py — Structured Python Microservice JSON Logger
Built for ELUSoC 2026 / GSSOC 2026.
"""
import logging
import json

def setup_json_logger(name="ai_service"):
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)
    handler = logging.StreamHandler()
    formatter = logging.Formatter('%(message)s')
    handler.setFormatter(formatter)
    if not logger.handlers:
        logger.addHandler(handler)
    return logger

ai_logger = setup_json_logger()
