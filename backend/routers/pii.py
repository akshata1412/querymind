from fastapi import APIRouter
from pydantic import BaseModel
from services.ai_service import detect_pii

router = APIRouter()

class SchemaRequest(BaseModel):
    schema: dict

@router.post("/detect")
def detect_pii_fields(req: SchemaRequest):
    return detect_pii(req.schema)