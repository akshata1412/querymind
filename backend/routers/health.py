from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.ai_service import score_health

router = APIRouter()

class SchemaRequest(BaseModel):
    schema: dict

@router.post("/score")
def health_score(req: SchemaRequest):
    try:
        return score_health(req.schema)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))