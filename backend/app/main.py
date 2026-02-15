from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import schemas, crud
from database import get_db

app = FastAPI()

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
    existing = crud.get_account_by_email(db, email=account.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    return crud.create_account(db=db, account=account)

@app.delete("/accounts/{user_id}")
async def remove_account(user_id: int, db: Session = Depends(get_db)):
    success = crud.delete_account(db, user_id=user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Account not found")
    return {"detail": "Account deleted successfully"}


### Resume Endpoints ###

@app.get("/resumes/{resume_id}", response_model=schemas.ResumeResponse)
async def read_resume(resume_id: int, db: Session = Depends(get_db)):
    resume = crud.get_resume(db, resume_id=resume_id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume

@app.get("/resumes/", response_model=List[schemas.ResumeResponse])
async def read_resumes(db: Session = Depends(get_db)):
    return crud.get_resumes(db)

@app.post("/resumes/", response_model=schemas.ResumeResponse)
async def create_resume(resume: schemas.ResumeCreate, db: Session = Depends(get_db)):
    return crud.create_resume(db=db, resume=resume)

@app.delete("/resumes/{resume_id}")
async def remove_resume(resume_id: int, db: Session = Depends(get_db)):
    success = crud.delete_resume(db, resume_id=resume_id)
    if not success:
        raise HTTPException(status_code=404, detail="Resume not found")
    return {"detail": "Resume deleted successfully"}


### Rating Endpoints ###

@app.get("/ratings/{rating_id}", response_model=schemas.RatingResponse)
async def read_rating(rating_id: int, db: Session = Depends(get_db)):
    rating = crud.get_rating(db, rating_id=rating_id)
    if not rating:
        raise HTTPException(status_code=404, detail="Rating not found")
    return rating

@app.get("/ratings/", response_model=List[schemas.RatingResponse])
async def read_ratings(db: Session = Depends(get_db)):
    return crud.get_ratings(db)

@app.post("/ratings/", response_model=schemas.RatingResponse)
async def create_rating(rating: schemas.RatingCreate, db: Session = Depends(get_db)):
    return crud.create_rating(db=db, rating=rating)

@app.delete("/ratings/{rating_id}")
async def remove_rating(rating_id: int, db: Session = Depends(get_db)):
    success = crud.delete_rating(db, rating_id=rating_id)
    if not success:
        raise HTTPException(status_code=404, detail="Rating not found")
    return {"detail": "Rating deleted successfully"}