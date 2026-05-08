import google.generativeai as genai
import json
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def analyze_resume(resume_text: str, role: str):
    # Try multiple models including latest aliases for better compatibility
    models_to_try = [
        'gemini-1.5-flash', 
        'gemini-flash-latest',
        'gemini-pro-latest',
        'gemini-2.0-flash',
        'gemini-1.5-pro'
    ]
    last_error = None
    
    for model_name in models_to_try:
        try:
            print(f"Attempting analysis with model: {model_name}")
            model = genai.GenerativeModel(model_name)
            
            prompt = f"""
    You are an expert tech recruiter and resume critic. Your task is to analyze the following resume for a {role} role.
    Provide a professional yet funny "meme-style" roast, structured feedback, and ATS scores.
    
    Resume Text:
    {resume_text}
    
    Return a STRICT JSON response with the following structure:
    {{
      "ats_score": number (0-100),
      "resume_strength": "Weak | Average | Strong",
      "roast": "a clever, funny, and modern roast in Gen-Z style",
      "recruiter_reaction": "honest recruiter thought",
      "summary_feedback": "brief summary",
      "missing_skills": ["skill1", "skill2"],
      "weak_points": ["point1", "point2"],
      "strong_points": ["point1", "point2"],
      "improvements": ["improvement1", "improvement2"],
      "recommended_projects": ["project1", "project2"],
      "keyword_match_score": number (0-100),
      "format_score": number (0-100),
      "experience_score": number (0-100)
    }}
    
    Ensure the JSON is valid and the tone is constructive but humorous.
    """
    
            response = model.generate_content(prompt)
            
            # Extract JSON from the response text
            if not response or not response.text:
                print(f"Empty response from {model_name}")
                continue
                
            content = response.text
            print(f"SUCCESS with {model_name}. RAW RESPONSE: {content[:100]}...")
            
            # Sometimes Gemini wraps JSON in code blocks
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
                
            return json.loads(content)
        except Exception as e:
            print(f"Error with {model_name}: {e}")
            last_error = str(e)
            continue
            
    return {
        "error": "All models failed or quota exceeded",
        "details": last_error
    }
