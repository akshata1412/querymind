from fastapi import APIRouter
from pydantic import BaseModel
from services.ai_service import chat_about_database

router = APIRouter()

class ChatRequest(BaseModel):
    question: str
    schema: dict
    history: list = []

@router.post("/message")
def send_message(req: ChatRequest):
    response = chat_about_database(req.question, req.schema, req.history)
    return {"response": response}