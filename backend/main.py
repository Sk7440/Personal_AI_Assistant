import os
from dotenv import load_dotenv
from fastapi import FastAPI
from groq import Groq

load_dotenv()

my_api_key = os.getenv("GROQ_API_KEY")
if not my_api_key:
    raise ValueError("Check your credentials: GROQ_API_KEY is missing")

app = FastAPI()
client = Groq(api_key=my_api_key)
model = "openai/gpt-oss-120b"


@app.get("/")
def home():
    return {"message": "home is running"}