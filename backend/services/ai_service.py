import json
import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def call_groq(system_prompt: str, user_prompt: str, max_tokens: int = 2048) -> str:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        max_tokens=max_tokens,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    )
    return response.choices[0].message.content

def generate_data_dictionary(schema: dict) -> dict:
    schema_text = json.dumps(schema, indent=2)
    system = """You are a database documentation expert. Given a database schema,
generate clear, concise human-readable descriptions for each table and column.
Respond ONLY with valid JSON in this exact format with no extra text:
{
  "database_summary": "string",
  "tables": {
    "table_name": {
      "description": "string",
      "business_purpose": "string",
      "columns": {
        "column_name": "string description"
      }
    }
  }
}"""
    result = call_groq(system, f"Generate data dictionary for:\n{schema_text}")
    # Clean response
    result = result.strip()
    if result.startswith("```"):
        result = result.split("```")[1]
        if result.startswith("json"):
            result = result[4:]
    return json.loads(result.strip())

def natural_language_to_sql(question: str, schema: dict) -> dict:
    schema_text = json.dumps(schema, indent=2)
    system = """You are an expert SQL developer. Convert natural language to SQL.
Respond ONLY with valid JSON with no extra text:
{
  "sql": "SELECT ...",
  "explanation": "string",
  "tables_used": ["table1"],
  "confidence": 0.95
}"""
    result = call_groq(system, f"Schema:\n{schema_text}\n\nQuestion: {question}")
    result = result.strip()
    if result.startswith("```"):
        result = result.split("```")[1]
        if result.startswith("json"):
            result = result[4:]
    return json.loads(result.strip())

def chat_about_database(question: str, schema: dict, history: list) -> str:
    schema_text = json.dumps(schema, indent=2)
    system = f"""You are QueryMind, an expert AI database assistant.
You have access to this database schema:
{schema_text}
Answer questions clearly and helpfully. Reference specific tables and columns when relevant."""
    
    messages = [{"role": "system", "content": system}]
    for msg in history:
        messages.append({"role": msg["role"], "content": msg["content"]})
    messages.append({"role": "user", "content": question})
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        max_tokens=1024,
        messages=messages
    )
    return response.choices[0].message.content

def calculate_health_score(schema: dict) -> dict:
    schema_text = json.dumps(schema, indent=2)
    system = """You are a database architect. Analyze schema quality.
Respond ONLY with valid JSON with no extra text:
{
  "overall_score": 85,
  "grade": "B+",
  "categories": {
    "naming_conventions": {"score": 90, "issues": []},
    "normalization": {"score": 80, "issues": ["string"]},
    "indexing": {"score": 75, "issues": ["string"]},
    "relationships": {"score": 95, "issues": []},
    "documentation": {"score": 70, "issues": ["string"]}
  },
  "recommendations": ["string"],
  "critical_issues": ["string"]
}"""
    result = call_groq(system, f"Analyze schema health:\n{schema_text}")
    result = result.strip()
    if result.startswith("```"):
        result = result.split("```")[1]
        if result.startswith("json"):
            result = result[4:]
    return json.loads(result.strip())

def detect_pii(schema: dict) -> dict:
    schema_text = json.dumps(schema, indent=2)
    system = """You are a data privacy expert. Identify PII and sensitive data fields.
Respond ONLY with valid JSON with no extra text:
{
  "risk_level": "HIGH",
  "pii_fields": [
    {"table": "string", "column": "string", "pii_type": "string", "risk": "HIGH", "recommendation": "string"}
  ],
  "compliance_flags": ["GDPR", "CCPA"],
  "summary": "string"
}"""
    result = call_groq(system, f"Detect PII in schema:\n{schema_text}")
    result = result.strip()
    if result.startswith("```"):
        result = result.split("```")[1]
        if result.startswith("json"):
            result = result[4:]
    return json.loads(result.strip())