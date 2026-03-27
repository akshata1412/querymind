from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from services.ai_service import chat_about_database
import anthropic
import json
import os

router = APIRouter()
client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

class ChatRequest(BaseModel):
    question: str
    schema: dict
    history: list = []

@router.post("/message")
def send_message(req: ChatRequest):
    response = chat_about_database(req.question, req.schema, req.history)
    return {"response": response}

@router.post("/stream")
async def stream_message(req: ChatRequest):
    schema_text = json.dumps(req.schema, indent=2)
    async def generate():
        with client.messages.stream(
            model="claude-sonnet-4-5",
            max_tokens=1024,
            system=f"You are QueryMind AI. Database schema:\n{schema_text}",
            messages=req.history + [{"role": "user", "content": req.question}]
        ) as stream:
            for text in stream.text_stream:
                yield f"data: {text}\n\n"
    return StreamingResponse(generate(), media_type="text/event-stream")