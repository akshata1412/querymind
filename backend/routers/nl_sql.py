from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.ai_service import convert_nl_to_sql

router = APIRouter()

class NLRequest(BaseModel):
    question: str
    schema: dict

@router.post("/convert")
def convert(req: NLRequest):
    try:
        return convert_nl_to_sql(req.question, req.schema)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    