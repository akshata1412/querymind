import json
import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# ✅ FIXED API KEY
client = Groq(api_key=os.getenv("GROQ_API_KEY"))


# ✅ SAFE GROQ CALL
def call_groq(system_prompt: str, user_prompt: str) -> str:
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=2000
        )

        content = response.choices[0].message.content

        if not content:
            raise ValueError("Empty response from Groq API")

        return content.strip()

    except Exception as e:
        raise Exception(f"Groq API Error: {str(e)}")


# ✅ HELPER: CLEAN + SAFE JSON PARSE
def safe_json_parse(text: str) -> dict:
    try:
        # Remove markdown if present
        text = text.replace("```json", "").replace("```", "").strip()
        return json.loads(text)
    except Exception as e:
        return {
            "error": "Invalid JSON from AI",
            "raw_response": text,
            "details": str(e)
        }


# ✅ NL → SQL
def convert_nl_to_sql(question: str, schema: dict) -> dict:
    if not schema:
        return {"error": "Schema is required"}

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

    print("🔍 RAW AI RESPONSE:\n", text)  # Debug (optional)

    return safe_json_parse(text)


# ✅ DATA DICTIONARY
def generate_dictionary(schema: dict) -> dict:
    schema_text = json.dumps(schema, indent=2)

    text = call_groq(
        "You are a database expert. Always respond with valid JSON only.",
        f"""Analyze this database schema and return ONLY this JSON:
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

    return safe_json_parse(text)


# ✅ CHAT
def chat_with_db(question: str, schema: dict, history: list) -> str:
    schema_text = json.dumps(schema, indent=2)

    return call_groq(
        """You are an expert database assistant. Follow these rules:
1. Use **bold**
2. Use bullet points
3. Use numbered lists
4. Use code blocks for SQL
5. Be clear and structured
6. Use actual schema names""",
        f"Schema:\n{schema_text}\n\nQuestion: {question}"
    )


# ✅ HEALTH SCORE
def score_health(schema: dict) -> dict:
    schema_text = json.dumps(schema, indent=2)

    text = call_groq(
        "You are a database architect. Always return JSON only.",
        f"""Analyze schema health. Return ONLY JSON:
{{
  "overall_score": 85,
  "grade": "A",
  "categories": {{
    "naming_conventions": {{"score": 80, "issues": []}},
    "normalization": {{"score": 85, "issues": []}},
    "indexing": {{"score": 70, "issues": []}},
    "relationships": {{"score": 90, "issues": []}},
    "documentation": {{"score": 60, "issues": []}}
  }},
  "recommendations": [],
  "critical_issues": []
}}
Schema:
{schema_text}"""
    )

    return safe_json_parse(text)


# ✅ PII DETECTION
def detect_pii(schema: dict) -> dict:
    schema_text = json.dumps(schema, indent=2)

    text = call_groq(
        "You are a data privacy expert. Always return JSON only.",
        f"""Detect PII. Return ONLY JSON:
{{
  "risk_level": "HIGH",
  "pii_fields": [],
  "compliance_flags": [],
  "summary": "..."
}}
Schema:
{schema_text}"""
    )

    return safe_json_parse(text)