import os
import requests
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class ChatMessagePayload(BaseModel):
    role: str
    content: str
    
class AgentContextPayload(BaseModel):
    name: str
    capability: str
    description: Optional[str] = ""
    speed: str
    priority: str

class ChatRequest(BaseModel):
    agent: AgentContextPayload
    message: str
    history: List[ChatMessagePayload] = []

@router.post("/message")
async def chat_message(request: ChatRequest):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not configured on the server.")
    
    # Use gemini-1.5-flash via REST API for maximum compatibility
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    
    # Construct the persona/system instruction
    system_instruction = f"""You are an advanced AI Agent named "{request.agent.name}".
Your primary capability and specialization is: {request.agent.capability}.
{f"Additional context about your role: {request.agent.description}" if request.agent.description else ""}

Your current performance settings are:
- Speed/Mode: {request.agent.speed}
- Priority level: {request.agent.priority}

Always respond in character as this specific AI agent. Be helpful, professional, and focus your answers through the lens of your specialized capability. Keep responses reasonably concise unless specifically asked for a detailed analysis."""

    # Build the contents array for Gemini
    # We include the system instruction as a high-priority preamble if using older models,
    # or use the system_instruction field in the JSON if supported.
    # For now, we'll use the 'system_instruction' field in the REST structural payload if allowed, 
    # but placing it in history/preamble is safer across all keys.
    
    contents = []
    
    # Start with system context
    contents.append({
        "role": "user",
        "parts": [{"text": f"SYSTEM INSTRUCTION: {system_instruction}\n\nPlease acknowledge and wait for the user."}]
    })
    contents.append({
        "role": "model",
        "parts": [{"text": f"Understood. I am {request.agent.name}, ready to assist with {request.agent.capability}."}]
    })

    # Add history
    for msg in request.history:
        role = "user" if msg.role == "user" else "model"
        contents.append({
            "role": role,
            "parts": [{"text": msg.content}]
        })
    
    # Add new message
    contents.append({
        "role": "user",
        "parts": [{"text": request.message}]
    })

    # Configure generation
    temperature = 0.7
    if request.agent.speed == "fast":
        temperature = 0.9
    elif request.agent.speed == "thorough":
        temperature = 0.3

    payload = {
        "contents": contents,
        "generationConfig": {
            "temperature": temperature,
            "maxOutputTokens": 2048,
        }
    }

    try:
        response = requests.post(url, json=payload, timeout=30)
        
        if response.status_code != 200:
            error_data = response.json()
            error_msg = error_data.get("error", {}).get("message", "Unknown Gemini API error")
            print(f"Gemini REST Error: {error_msg}")
            raise HTTPException(status_code=response.status_code, detail=f"Gemini API Error: {error_msg}")
            
        data = response.json()
        ai_content = data["candidates"][0]["content"]["parts"][0]["text"]
        
        return {"content": ai_content}
        
    except requests.exceptions.RequestException as e:
        print(f"Connection Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to connect to Gemini API service.")
    except (KeyError, IndexResponse) as e:
        print(f"Payload Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Received an unexpected response format from Gemini.")
