from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models
import schemas, crud
from database import get_db
from fastapi.middleware.cors import CORSMiddleware

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
@app.get("/accounts/{email}", response_model=schemas.AccountResponse)
async def read_account(email: str, db: Session = Depends(get_db)):
    account = crud.get_account_by_email(db, email=email)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return account

@app.get("/accounts/", response_model=List[schemas.AccountResponse])
async def read_accounts(db: Session = Depends(get_db)):
    return crud.get_accounts(db)

@app.post("/accounts/", response_model=schemas.AccountResponse)
async def create_account(account: schemas.AccountCreate, db: Session = Depends(get_db)):
    existing_email = crud.get_account_by_email(db, email=account.email)

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

@app.get("/resumes/", response_model=List[schemas.ResumeResponse])
async def read_resumes(db: Session = Depends(get_db)):
    return crud.get_resumes(db)

@app.get("/accounts/{account_id}/resumes", response_model=List[schemas.ResumeResponse])
async def read_resumes_for_account(account_id: int, db: Session = Depends(get_db)):
    account = db.query(models.Accounts).filter(models.Accounts.user_id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return crud.get_resumes_for_account(db, account_id=account_id)

@app.post("/accounts/{account_id}/resumes/", response_model=schemas.ResumeResponse)
async def create_resume(account_id: int, resume: schemas.ResumeCreate, db: Session = Depends(get_db)):
    account = db.query(models.Accounts).filter(models.Accounts.user_id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    
    resume.account_id = account_id
    return crud.create_resume(db=db, resume=resume)

@app.delete("/resumes/{account_id}/resumes/{resume_id}")
async def remove_resume_for_user(account_id: int, resume_id: int, db: Session = Depends(get_db)):
    account = db.query(models.Accounts).filter(models.Accounts.user_id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    success = crud.delete_resume(db, resume_id=resume_id)
    if not success:
        raise HTTPException(status_code=404, detail="Resume not found")
    return {"detail": "Resume deleted successfully"}


### Rating Endpoints ###

@app.get("/resume/{resume_id}/rating/{rating_id}", response_model=schemas.RatingResponse)
async def read_rating_for_a_resume(resume_id: int, rating_id: int, db: Session = Depends(get_db)):
    rating = crud.get_rating_for_resume(db, resume_id=resume_id, rating_id=rating_id)
    if not rating:
        raise HTTPException(status_code=404, detail="Rating not found")
    return rating

@app.get("/resumes/{resume_id}/ratings", response_model=List[schemas.RatingResponse])
async def read_ratings_for_resume(resume_id: int, db: Session = Depends(get_db)):
    ratings = crud.get_ratings_for_resume(db, resume_id=resume_id)

    if not ratings:
        raise HTTPException(status_code=404, detail="Ratings not found")
    return ratings

@app.get("/ratings/", response_model=List[schemas.RatingResponse])
async def read_ratings(db: Session = Depends(get_db)):
    return crud.get_ratings(db)

@app.post("/resumes/{resume_id}/ratings/", response_model=schemas.RatingResponse)
async def create_rating(resume_id: int, rating: schemas.RatingCreate, db: Session = Depends(get_db)):
    rating.resume_id = resume_id
    return crud.create_rating(db=db, rating=rating)

@app.delete("/resumes/{resume_id}/ratings/{rating_id}")
async def remove_rating(resume_id: int, rating_id: int, db: Session = Depends(get_db)):
    success = crud.delete_rating(db, rating_id=rating_id, resume_id=resume_id)
    if not success:
        raise HTTPException(status_code=404, detail="Rating not found")
    return {"detail": "Rating deleted successfully"}