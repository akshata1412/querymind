import os
import json
from groq import Groq

# Initialize Groq
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL = "llama-3.3-70b-versatile" # This model is powerful and free

def safe_json_parse(text: str) -> dict:
    text = text.strip()
    if "```" in text:
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    return json.loads(text.strip())

def call_groq(system_prompt: str, user_prompt: str, is_json: bool = False) -> str:
    params = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    }
    if is_json:
        params["response_format"] = {"type": "json_object"}
    
    completion = client.chat.completions.create(**params)
    return completion.choices[0].message.content

def generate_data_dictionary(schema: dict) -> dict:
    system = "You are a DB expert. Return a data dictionary in JSON format."
    result = call_groq(system, f"Schema: {json.dumps(schema)}", is_json=True)
    return safe_json_parse(result)

def natural_language_to_sql(question: str, schema: dict) -> dict:
    system = "Convert NL to SQL. Return ONLY JSON: {'sql': '', 'explanation': '', 'confidence': 0.9}"
    result = call_groq(system, f"Schema: {json.dumps(schema)}\nQ: {question}", is_json=True)
    return safe_json_parse(result)

def chat_about_database(question: str, schema: dict, history: list) -> str:
    system = f"You are QueryMind AI. Schema: {json.dumps(schema)}"
    messages = [{"role": "system", "content": system}]
    for msg in history:
        messages.append({"role": msg["role"], "content": msg["content"]})
    messages.append({"role": "user", "content": question})
    
    completion = client.chat.completions.create(model=MODEL, messages=messages)
    return completion.choices[0].message.content

def calculate_health_score(schema: dict) -> dict:
    system = "Analyze DB health for a radar chart. Return ONLY JSON."
    result = call_groq(system, f"Schema: {json.dumps(schema)}", is_json=True)
    return safe_json_parse(result)

def detect_pii(schema: dict) -> dict:
    system = "Identify PII and risk levels. Return ONLY JSON."
    result = call_groq(system, f"Schema: {json.dumps(schema)}", is_json=True)
    return safe_json_parse(result)