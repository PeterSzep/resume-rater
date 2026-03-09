from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List
from pathlib import Path
import models
import schemas, crud
from database import get_db
from fastapi.middleware.cors import CORSMiddleware
import uuid
import io
import json
import PyPDF2
import anthropic
import os
from dotenv import load_dotenv
load_dotenv()

UPLOADS_DIR = Path(__file__).parent.parent / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # Allows specific origins
    allow_credentials=True,
    allow_methods=["*"],              # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],              # Allows all headers
)

### Account Endpoints ###
@app.post("/accounts/login", response_model=schemas.AccountResponse)
async def read_account(credentials: schemas.LoginRequest, db: Session = Depends(get_db)):
    account = crud.get_account_by_email_password(db, email=credentials.email, password=credentials.password)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found or incorrect password")
    return account

@app.get("/accounts/", response_model=List[schemas.AccountResponse])
async def read_accounts(db: Session = Depends(get_db)):
    return crud.get_accounts(db)

@app.post("/accounts/", response_model=schemas.AccountResponse)
async def create_account(account: schemas.AccountCreate, db: Session = Depends(get_db)):
    existing_email = crud.get_account_by_email_password(db, email=account.email, password=account.password)

    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    return crud.create_account(db=db, account=account)

@app.delete("/accounts/{user_id}")
async def remove_account(user_id: int, db: Session = Depends(get_db)):
    success = crud.delete_account(db, user_id=user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Account not found")
    return {"detail": "Account deleted successfully"}


### Resume Endpoints ###
@app.get("/resume/{resume_id}", response_model=schemas.ResumeResponse)
async def read_resume(resume_id: int, db: Session = Depends(get_db)):
    resume = crud.get_resume_by_id(db, resume_id=resume_id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume

@app.get("/accounts/{account_id}/resumes/", response_model=List[schemas.ResumeResponse])
async def read_resumes(account_id: int, db: Session = Depends(get_db)):
    account = db.query(models.Accounts).filter(models.Accounts.user_id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return crud.get_resumes_for_account(db, account_id=account_id)

@app.get("/accounts/{account_id}/resumes/newest", response_model=List[schemas.ResumeResponse])
async def read_newest_resumes_for_account(account_id: int, db: Session = Depends(get_db)):
    account = db.query(models.Accounts).filter(models.Accounts.user_id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return crud.get_newest_resumes_for_account(db, account_id=account_id)

@app.get("/accounts/{account_id}/resumes", response_model=List[schemas.ResumeResponse])
async def read_resumes_for_account(account_id: int, db: Session = Depends(get_db)):
    account = db.query(models.Accounts).filter(models.Accounts.user_id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return crud.get_resumes_for_account(db, account_id=account_id)

@app.get("/resumes/{resume_id}/file")
async def serve_resume_file(resume_id: int, db: Session = Depends(get_db)):
    resume = crud.get_resume_by_id(db, resume_id=resume_id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    file_path = Path(resume.file_path)
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found on disk")
    return FileResponse(
        path=str(file_path),
        media_type="application/pdf",
        headers={"Content-Disposition": f'inline; filename="{resume.original_filename}"'},
    )

@app.post("/accounts/{account_id}/resumes/", response_model=schemas.ResumeResponse)
async def create_resume(account_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    account = db.query(models.Accounts).filter(models.Accounts.user_id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    contents = await file.read()
    file_size = len(contents)

    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = UPLOADS_DIR / unique_filename
    with open(file_path, "wb") as f:
        f.write(contents)

    extracted_text = ""
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(contents))
        for page in pdf_reader.pages:
            extracted_text += page.extract_text() or ""
    except Exception:
        extracted_text = ""

    resume = schemas.ResumeCreate(
        account_id=account_id,
        original_filename=file.filename,
        file_path=str(file_path),
        extracted_text=extracted_text,
        file_size=file_size,
    )
    return crud.create_resume(db=db, resume=resume)

@app.delete("/accounts/{account_id}/resumes/{resume_id}")
async def remove_resume_for_user(account_id: int, resume_id: int, db: Session = Depends(get_db)):
    account = db.query(models.Accounts).filter(models.Accounts.user_id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    resume = crud.get_resume_by_id(db, resume_id=resume_id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    file_path = Path(resume.file_path)
    if file_path.exists():
        file_path.unlink()

    crud.delete_resume(db, resume_id=resume_id)
    return {"detail": "Resume deleted successfully"}


### Rating Endpoints ###

@app.get("/resume/{resume_id}/rating/{rating_id}", response_model=schemas.RatingResponse)
async def read_rating_for_a_resume(resume_id: int, rating_id: int, db: Session = Depends(get_db)):
    rating = crud.get_rating_for_resume(db, resume_id=resume_id, rating_id=rating_id)
    if not rating:
        raise HTTPException(status_code=404, detail="Rating not found")
    return rating

@app.get("/accounts/{account_id}/resumes/{resume_id}/ratings", response_model=List[schemas.RatingResponse])
async def read_ratings_for_resume(account_id: int, resume_id: int, db: Session = Depends(get_db)):
    ratings = crud.get_ratings_for_resume(db, resume_id=resume_id)

    if not ratings:
        raise HTTPException(status_code=404, detail="Ratings not found")
    return ratings



RATING_PROMPT = """You are a resume reviewer. Try to be reasonable not too harsh. Analyze the resume below and return ONLY a JSON object with no extra text.

The JSON must follow this exact structure:
{
  "overall_score": <float 0-100>,
  "criteria_scores": {
    "formatting": <float 0-100>,
    "experience": <float 0-100>,
    "skills": <float 0-100>,
    "education": <float 0-100>,
    "impact": <float 0-100>
  },
  "feedback": "<2-3 sentence overall summary of the resume>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"]
}

Scoring guide:
- formatting: layout clarity, length, readability
- experience: relevance and depth of work history
- skills: technical and soft skills alignment
- education: academic background
- impact: use of metrics and quantifiable achievements

Resume:
"""

@app.post("/resumes/{resume_id}/ratings/", response_model=schemas.RatingResponse)
async def create_rating(resume_id: int, db: Session = Depends(get_db)):
    resume = crud.get_resume_by_id(db, resume_id=resume_id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    message = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=1024,
        messages=[{"role": "user", "content": RATING_PROMPT + resume.extracted_text}],
    )

    try:
        raw = message.content[0].text.strip()
        if raw.startswith("```"):
            raw = raw.split("```", 2)[1]
            if raw.startswith("json"):
                raw = raw[4:]
            raw = raw.rsplit("```", 1)[0].strip()
        data = json.loads(raw)
    except (json.JSONDecodeError, IndexError, KeyError):
        raise HTTPException(status_code=502, detail="Failed to parse AI response")

    rating = schemas.RatingCreate(
        resume_id=resume_id,
        overall_score=data["overall_score"],
        criteria_scores=data["criteria_scores"],
        feedback=data["feedback"],
        strengths=data["strengths"],
        improvements=data["improvements"],
    )
    return crud.create_rating(db=db, rating=rating)

@app.delete("/resumes/{resume_id}/ratings/{rating_id}")
async def remove_rating(resume_id: int, rating_id: int, db: Session = Depends(get_db)):
    success = crud.delete_rating(db, rating_id=rating_id, resume_id=resume_id)
    if not success:
        raise HTTPException(status_code=404, detail="Rating not found")
    return {"detail": "Rating deleted successfully"}