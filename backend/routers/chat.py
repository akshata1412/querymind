from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.ai_service import chat_with_db

router = APIRouter()

class ChatRequest(BaseModel):
    question: str
    schema: dict
    history: list = []

@router.post("/message")
def send_message(req: ChatRequest):
    try:
        response = chat_with_db(req.question, req.schema, req.history)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))