from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from services.schema_extractor import extract_schema
import sqlite3
import pandas as pd
import io
import os
import glob

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

@router.post("/upload-csv")
async def upload_csv(files: list[UploadFile] = File(...)):
    try:
        db_path = "uploaded_data.db"
        conn = sqlite3.connect(db_path)
        loaded_tables = []

        for file in files:
            if not file.filename or not file.filename.endswith('.csv'):
                continue
            
            # Read CSV content
            content = await file.read()
            df = pd.read_csv(io.StringIO(content.decode('utf-8', errors='ignore')), on_bad_lines='skip')
            
            # Clean table name
            table_name = os.path.splitext(file.filename)[0]
            table_name = table_name.replace(' ', '_').replace('-', '_').lower()
            
            # Save to SQLite
            df.to_sql(table_name, conn, if_exists='replace', index=False)
            loaded_tables.append({
                "table": table_name,
                "rows": len(df),
                "columns": len(df.columns)
            })

        conn.commit()
        conn.close()

        # Extract schema from created database
        schema = extract_schema(f"sqlite:///./{db_path}")
        
        return {
            "success": True,
            "schema": schema,
            "table_count": len(schema),
            "loaded_tables": loaded_tables,
            "db_path": db_path
        }

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