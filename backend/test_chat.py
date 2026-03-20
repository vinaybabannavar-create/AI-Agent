import os
import requests
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

# try different models  
models_to_try = [
    "gemini-pro",
    "gemini-1.0-pro",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
]

for model in models_to_try:
    for version in ["v1", "v1beta"]:
        url = f"https://generativelanguage.googleapis.com/{version}/models/{model}:generateContent?key={api_key}"
        payload = {"contents": [{"role": "user", "parts": [{"text": "Hello"}]}]}
        resp = requests.post(url, json=payload, timeout=10)
        if resp.status_code == 200:
            print(f"SUCCESS: {version}/{model}")
            text = resp.json()["candidates"][0]["content"]["parts"][0]["text"]
            print("Response:", text[:300])
            break
        else:
            err = resp.json().get("error", {}).get("message", "unknown")
            print(f"FAIL {resp.status_code}: {version}/{model} - {err[:80]}")
