from fastapi import APIRouter
from pydantic import BaseModel
from services.ai_service import generate_data_dictionary

router = APIRouter()

class SchemaRequest(BaseModel):
    schema: dict

@router.post("/generate")
def generate_dictionary(req: SchemaRequest):
    return generate_data_dictionary(req.schema)