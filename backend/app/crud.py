from sqlalchemy.orm import Session
import models, schemas

def get_accounts(db: Session):
    return db.query(models.Accounts).all()

def get_account_by_email(db: Session, email: str):
    return db.query(models.Accounts).filter(models.Accounts.email == email).first()

def create_account(db: Session, account: schemas.AccountCreate):
    db_account = models.Accounts(**account.model_dump())
    
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

def get_resumes(db: Session, account_id: int):
    return db.query(models.Resumes).filter(models.Resumes.account_id == account_id).all()

def get_resume(db: Session, resume_id: int):
    return db.query(models.Resumes).filter(models.Resumes.resume_id == resume_id).first()

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


def get_ratings(db: Session, resume_id: int):
    return db.query(models.Rating).filter(models.Rating.resume_id == resume_id).first()

def get_rating(db: Session, rating_id: int):
    return db.query(models.Rating).filter(models.Rating.id == rating_id).first()

def create_rating(db: Session, rating: schemas.RatingResponse):
    db_rating = models.Rating(**rating.model_dump())
    
    db.add(db_rating)
    db.commit()
    db.refresh(db_rating)
    return db_rating

def delete_rating(db: Session, rating_id: int):
    rating = db.query(models.Rating).filter(models.Rating.id == rating_id).first()
    if rating:
        db.delete(rating)
        db.commit()
    return rating