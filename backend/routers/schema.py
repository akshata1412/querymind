from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from services.schema_extractor import extract_schema
import sqlite3
import os
import io
import math

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

@router.post("/upload-csv")
async def upload_csv(files: list[UploadFile] = File(...)):
    try:
        import pandas as pd
        import math

        os.makedirs("./csv_uploads", exist_ok=True)
        db_path = "./csv_uploads/combined.db"
        conn = sqlite3.connect(db_path)

        all_schema = {}
        all_columns = {}
        preview_data = {}
        total_rows = 0

        for file in files:
            contents = await file.read()
            df = pd.read_csv(io.BytesIO(contents))
            df = df.where(pd.notnull(df), None)

            table_name = os.path.splitext(file.filename)[0].replace(" ", "_").replace("-", "_").lower()
            df.to_sql(table_name, conn, if_exists="replace", index=False)
            total_rows += len(df)

            all_schema[table_name] = {
                "columns": [{"name": col, "type": str(df[col].dtype), "nullable": True, "default": ""} for col in df.columns],
                "foreign_keys": [],
                "primary_keys": [],
                "indexes": [],
            }
            all_columns[table_name] = list(df.columns)

            preview = []
            for record in df.head(3).to_dict(orient="records"):
                clean = {k: (None if v is None or (isinstance(v, float) and math.isnan(v)) else v) for k, v in record.items()}
                preview.append(clean)
            preview_data[table_name] = preview

        conn.close()

        return {
            "success": True,
            "schema": all_schema,
            "table_count": len(all_schema),
            "db_url": f"sqlite:///{db_path}",
            "rows_loaded": total_rows,
            "columns": all_columns,
            "preview": preview_data
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/execute-csv")
def execute_csv_query(req: dict):
    try:
        db_path = req["db_url"].replace("sqlite:///", "")
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute(req["sql"])
        columns = [desc[0] for desc in cursor.description] if cursor.description else []
        rows = [dict(zip(columns, row)) for row in cursor.fetchmany(100)]
        conn.close()
        return {"rows": rows, "count": len(rows)}
    except Exception as e:
        raise HTTPException(400, detail=str(e))