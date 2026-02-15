from sqlalchemy import JSON, TEXT, Column, DateTime, Float, ForeignKey, Integer,TIMESTAMP, VARCHAR, Text
from database import Base
import datetime
from sqlalchemy.orm import relationship

class Accounts(Base):
    __tablename__ = 'accounts' 

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(VARCHAR(50), unique=True, index=True, nullable=False)
    password = Column(VARCHAR(50), nullable=False)
    email = Column(VARCHAR(355), unique=True, index=True, nullable=False)
    created_on = Column(TIMESTAMP, nullable=False)
    last_login = Column(TIMESTAMP)

    resumes = relationship("Resumes", back_populates="owner")

class Resumes(Base):
    __tablename__ = 'resumes'

    resume_id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("accounts.user_id", ondelete="CASCADE"), nullable=False)

    original_filename = Column(VARCHAR(255), nullable=False)
    file_path = Column(VARCHAR(500), nullable=False)
    extracted_text = Column(TEXT, nullable=False)
    upload_time = Column(TIMESTAMP, nullable=False, default=lambda: datetime.datetime.now(datetime.timezone.utc))
    file_size = Column(Integer, nullable=False)

    owner = relationship("Accounts", back_populates="resumes")
    rating = relationship("Rating", back_populates="resume", uselist=False, cascade="all, delete-orphan")

class Rating(Base):
    __tablename__ = "ratings"
    
    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.resume_id", ondelete="CASCADE"), nullable=False, unique=True)
    
    overall_score = Column(Float, nullable=False)  
    criteria_scores = Column(JSON, nullable=False)
    feedback = Column(Text, nullable=False)
    strengths = Column(JSON, nullable=False)
    improvements = Column(JSON, nullable=False)
    
    created_at = Column(TIMESTAMP, nullable=False, default=lambda: datetime.datetime.now(datetime.timezone.utc))
    processing_time = Column(Float, nullable=True) 
    
    resume = relationship("Resumes", back_populates="rating")