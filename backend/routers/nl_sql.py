from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.ai_service import convert_nl_to_sql

router = APIRouter()

class NLRequest(BaseModel):
    question: str
    schema: dict

@router.post("/convert")
def convert(req: NLRequest):
    if not req.schema:
        raise HTTPException(status_code=400, detail="Schema is required")

    try:
        return convert_nl_to_sql(req.question, req.schema)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))