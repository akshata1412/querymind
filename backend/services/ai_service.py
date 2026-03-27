import json
import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("ANTHROPIC_API_KEY"))

def call_groq(system_prompt: str, user_prompt: str) -> str:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        max_tokens=2000
    )
    return response.choices[0].message.content

def generate_dictionary(schema: dict) -> dict:
    schema_text = json.dumps(schema, indent=2)
    text = call_groq(
        "You are a database expert. Always respond with valid JSON only, no markdown, no extra text.",
        f"""Analyze this database schema and return ONLY this JSON structure:
{{
  "database_summary": "one sentence summary",
  "tables": {{
    "table_name": {{
      "description": "what this table stores",
      "business_purpose": "why this table exists",
      "columns": {{
        "column_name": "what this column stores"
      }}
    }}
  }}
}}

Schema:
{schema_text}"""
    )
    text = text.replace("```json", "").replace("```", "").strip()
    return json.loads(text)

def chat_with_db(question: str, schema: dict, history: list) -> str:
    schema_text = json.dumps(schema, indent=2)
    return call_groq(
        "You are an expert database assistant. Answer questions about the database schema clearly and helpfully.",
        f"Database schema:\n{schema_text}\n\nQuestion: {question}"
    )

def convert_nl_to_sql(question: str, schema: dict) -> dict:
    schema_text = json.dumps(schema, indent=2)
    text = call_groq(
        "You are a SQL expert. Always respond with valid JSON only, no markdown, no extra text.",
        f"""Convert this question to SQL. Return ONLY this JSON:
{{
  "sql": "the SQL query here",
  "explanation": "brief explanation",
  "tables_used": ["table1"],
  "confidence": 0.95
}}

Schema:
{schema_text}

Question: {question}"""
    )
    text = text.replace("```json", "").replace("```", "").strip()
    return json.loads(text)

def score_health(schema: dict) -> dict:
    schema_text = json.dumps(schema, indent=2)
    text = call_groq(
        "You are a database architect. Always respond with valid JSON only, no markdown, no extra text.",
        f"""Analyze this database schema health. Return ONLY this JSON:
{{
  "overall_score": 85,
  "grade": "A",
  "categories": {{
    "naming_conventions": {{"score": 80, "issues": []}},
    "normalization": {{"score": 85, "issues": []}},
    "indexing": {{"score": 70, "issues": ["missing index on foreign keys"]}},
    "relationships": {{"score": 90, "issues": []}},
    "documentation": {{"score": 60, "issues": []}}
  }},
  "recommendations": ["add indexes", "add timestamps"],
  "critical_issues": []
}}

Schema:
{schema_text}"""
    )
    text = text.replace("```json", "").replace("```", "").strip()
    return json.loads(text)

def detect_pii(schema: dict) -> dict:
    schema_text = json.dumps(schema, indent=2)
    text = call_groq(
        "You are a data privacy expert. Always respond with valid JSON only, no markdown, no extra text.",
        f"""Detect PII fields in this schema. Return ONLY this JSON:
{{
  "risk_level": "HIGH",
  "pii_fields": [
    {{
      "table": "customers",
      "column": "email",
      "pii_type": "Email Address",
      "risk": "HIGH",
      "recommendation": "Encrypt this field"
    }}
  ],
  "compliance_flags": ["GDPR", "CCPA"],
  "summary": "Found X PII fields across your database schema."
}}

Schema:
{schema_text}"""
    )
    text = text.replace("```json", "").replace("```", "").strip()
    return json.loads(text)