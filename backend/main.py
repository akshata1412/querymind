from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import schema, dictionary, er_diagram, chat, nl_sql, health, pii

app = FastAPI(title="QueryMind API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(schema.router,      prefix="/api/schema",     tags=["Schema"])
app.include_router(dictionary.router,  prefix="/api/dictionary", tags=["Dictionary"])
app.include_router(er_diagram.router,  prefix="/api/er",         tags=["ER Diagram"])
app.include_router(chat.router,        prefix="/api/chat",       tags=["Chat"])
app.include_router(nl_sql.router,      prefix="/api/nlsql",      tags=["NL→SQL"])
app.include_router(health.router,      prefix="/api/health",     tags=["Health"])
app.include_router(pii.router,         prefix="/api/pii",        tags=["PII"])

@app.get("/")
def root():
    return {"status": "QueryMind is running 🚀"}