from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.schema_extractor import extract_schema

router = APIRouter()

class ConnectRequest(BaseModel):
    db_url: str

@router.post("/connect")
def connect_and_extract(req: ConnectRequest):
    try:
        schema = extract_schema(req.db_url)
        return {"success": True, "schema": schema, "table_count": len(schema)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/execute")
def execute_query(req: dict):
    try:
        from sqlalchemy import create_engine, text
        engine = create_engine(req["db_url"])
        with engine.connect() as conn:
            result = conn.execute(text(req["sql"]))
            rows = [dict(r._mapping) for r in result.fetchmany(100)]
            return {"rows": rows, "count": len(rows)}
    except Exception as e:
        raise HTTPException(400, detail=str(e))