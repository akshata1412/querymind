from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.ai_service import generate_dictionary

router = APIRouter()

class SchemaRequest(BaseModel):
    schema: dict

@router.post("/generate")
def generate_dict(req: SchemaRequest):
    try:
        return generate_dictionary(req.schema)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))