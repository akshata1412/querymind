import anthropic
import json
import os

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def safe_json_parse(text: str) -> dict:
    text = text.strip()
    if text.startswith("```"):
        parts = text.split("```")
        text = parts[1]
        if text.startswith("json"):
            text = text[4:]
    return json.loads(text.strip())

def call_claude(system_prompt: str, user_prompt: str, max_tokens: int = 2048) -> str:
    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=max_tokens,
        system=system_prompt,
        messages=[{"role": "user", "content": user_prompt}]
    )
    return message.content[0].text

def generate_data_dictionary(schema: dict) -> dict:
    schema_text = json.dumps(schema, indent=2)
    system = """You are a database documentation expert. Given a database schema,
generate clear, concise human-readable descriptions for each table and column.
Respond ONLY with valid JSON in this exact format:
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
    result = call_claude(system, f"Generate data dictionary for:\n{schema_text}")
    return safe_json_parse(result)

def natural_language_to_sql(question: str, schema: dict) -> dict:
    schema_text = json.dumps(schema, indent=2)
    system = """You are an expert SQL developer. Convert natural language to SQL.
Respond ONLY with valid JSON:
{
  "sql": "SELECT ...",
  "explanation": "string",
  "tables_used": ["table1"],
  "confidence": 0.95
}"""
    result = call_claude(
        system,
        f"Schema:\n{schema_text}\n\nQuestion: {question}"
    )
    return safe_json_parse(result)

def chat_about_database(question: str, schema: dict, history: list) -> str:
    schema_text = json.dumps(schema, indent=2)
    system = f"""You are QueryMind, an expert AI database assistant.
You have access to this database schema:
{schema_text}
Answer questions clearly and helpfully. Reference specific tables and columns when relevant."""
    messages = history + [{"role": "user", "content": question}]
    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        system=system,
        messages=messages
    )
    return message.content[0].text

def calculate_health_score(schema: dict) -> dict:
    schema_text = json.dumps(schema, indent=2)
    system = """You are a database architect. Analyze schema quality.
Respond ONLY with valid JSON:
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
    result = call_claude(system, f"Analyze schema health:\n{schema_text}")
    return safe_json_parse(result)

def detect_pii(schema: dict) -> dict:
    schema_text = json.dumps(schema, indent=2)
    system = """You are a data privacy expert. Identify PII and sensitive data fields.
Respond ONLY with valid JSON:
{
  "risk_level": "HIGH",
  "pii_fields": [
    {
      "table": "string",
      "column": "string",
      "pii_type": "string",
      "risk": "HIGH",
      "recommendation": "string"
    }
  ],
  "compliance_flags": ["GDPR", "CCPA"],
  "summary": "string"
}"""
    result = call_claude(system, f"Detect PII in schema:\n{schema_text}")
    return safe_json_parse(result)