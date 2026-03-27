from .ai_service import calculate_health_score

def get_health_score(schema: dict) -> dict:
    return calculate_health_score(schema)