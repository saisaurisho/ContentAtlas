import os
import sys
from dotenv import load_dotenv
from groq import Groq

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

load_dotenv()

client = Groq(
    api_key=os.environ["GROQ_API_KEY"]
)

model = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")

try:
    response = client.chat.completions.create(
        model=model,
        messages=[
            {
                "role": "user",
                "content": "Explain what an AI content strategy agent does in 3 sentences."
            }
        ],
    )
    print("Groq Response:")
    print(response.choices[0].message.content)
except Exception as e:
    print(f"Error calling model '{model}': {e}")
    print("Retrying with llama-3.3-70b-versatile...")
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": "Explain what an AI content strategy agent does in 3 sentences."
            }
        ],
    )
    print(response.choices[0].message.content)
