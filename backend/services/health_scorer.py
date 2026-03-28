from .ai_service import score_health

def get_health_score(schema: dict) -> dict:
    return score_health(schema)