from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("ANTHROPIC_API_KEY"))
response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[{"role": "user", "content": "say hello in one word"}],
    max_tokens=10
)
print("SUCCESS:", response.choices[0].message.content)