from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.ai_service import detect_pii

router = APIRouter()

class SchemaRequest(BaseModel):
    schema: dict

@router.post("/detect")
def pii_detect(req: SchemaRequest):
    try:
        return detect_pii(req.schema)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))