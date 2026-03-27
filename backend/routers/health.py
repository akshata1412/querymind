from fastapi import APIRouter
from pydantic import BaseModel
from services.ai_service import calculate_health_score

router = APIRouter()

class SchemaRequest(BaseModel):
    schema: dict

@router.post("/score")
def get_health_score(req: SchemaRequest):
    return calculate_health_score(req.schema)
