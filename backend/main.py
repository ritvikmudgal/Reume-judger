from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.parsers import parse_resume
from backend.ai import analyze_resume
import uvicorn
import traceback

app = FastAPI()

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "active", "message": "Resume Roast Backend is running"}

@app.post("/analyze")
async def analyze(file: UploadFile = File(...), role: str = Form(...)):
    try:
        print(f"Analyzing {file.filename} for role {role}")
        content = await file.read()
        resume_text = parse_resume(content, file.filename)
        
        if not resume_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from the file.")
            
        analysis = analyze_resume(resume_text, role)
        return analysis
    except Exception as e:
        print("ERROR DURING ANALYSIS:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
