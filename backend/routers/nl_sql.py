from fastapi import APIRouter
from pydantic import BaseModel
from services.ai_service import natural_language_to_sql

router = APIRouter()

class NLRequest(BaseModel):
    question: str
    schema: dict

@router.post("/convert")
def convert_nl_to_sql(req: NLRequest):
    return natural_language_to_sql(req.question, req.schema)