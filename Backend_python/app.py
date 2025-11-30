from fastapi import FastAPI, HTTPException
# from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from main import response
import string

import uvicorn


app = FastAPI()


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)


@app.get("/")
def home():
    # return HTMLResponse(content="<h1>Hello World</h1>")
    return "Hello World"


class QueryRequest(BaseModel):
    query: str


@app.post("/python/airesponse")
def airesponse(request: QueryRequest):
    try:
        return response(request.query)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))




if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)