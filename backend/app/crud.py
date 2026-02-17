from sqlalchemy.orm import Session
import models, schemas
from datetime import datetime, timezone 
import bcrypt
#Accounts
def get_accounts(db: Session):
    return db.query(models.Accounts).all()

def get_account_by_email(db: Session, email: str):
    return db.query(models.Accounts).filter(models.Accounts.email == email).first()

def get_account_by_username(db: Session, username: str):
    return db.query(models.Accounts).filter(models.Accounts.username == username).first()

def create_account(db: Session, account: schemas.AccountCreate):
    s = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(account.password.encode('utf-8'), s)
    db_account = models.Accounts(
        username=account.username,
        email=account.email,
        password=hashed_password,
        created_on=datetime.now(timezone.utc) 
    )
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account

def delete_account(db: Session, user_id: int):
    account = db.query(models.Accounts).filter(models.Accounts.user_id == user_id).first()
    if account:
        db.delete(account)
        db.commit()
    return account

#Resumes
def get_resumes_for_account(db: Session, account_id: int):
    return db.query(models.Resumes).filter(models.Resumes.account_id == account_id).all()

def get_resume_by_id(db: Session, resume_id: int):
    return db.query(models.Resumes).filter(models.Resumes.resume_id == resume_id).first()

def get_resumes(db: Session):
    return db.query(models.Resumes).all()

def create_resume(db: Session, resume: schemas.ResumeCreate):
    db_resume = models.Resumes(**resume.model_dump())
    
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)
    return db_resume

def delete_resume(db: Session, resume_id: int):
    resume = db.query(models.Resumes).filter(models.Resumes.resume_id == resume_id).first()
    if resume:
        db.delete(resume)
        db.commit()
    return resume

#Ratings


def get_rating_for_resume(db: Session, resume_id: int, rating_id: int):
    return db.query(models.Rating).filter(
        models.Rating.id == rating_id,
        models.Rating.resume_id == resume_id
    ).first()


def get_ratings_for_resume(db: Session, resume_id: int):
    return db.query(models.Rating).filter(models.Rating.resume_id == resume_id).all()

def get_ratings(db: Session):
    return db.query(models.Rating).all()

def create_rating(db: Session, rating: schemas.RatingCreate):
    db_rating = models.Rating(**rating.model_dump())
    
    db.add(db_rating)
    db.commit()
    db.refresh(db_rating)
    return db_rating

def delete_rating(db: Session, rating_id: int, resume_id: int):
    rating = db.query(models.Rating).filter(
        models.Rating.id == rating_id,
        models.Rating.resume_id == resume_id
    ).first()

    if rating:
        db.delete(rating)
        db.commit()
    return rating