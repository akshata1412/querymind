from .ai_service import detect_pii

def detect_pii_fields(schema: dict) -> dict:
    return detect_pii(schema)