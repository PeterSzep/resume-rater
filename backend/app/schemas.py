from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional, Dict, Any

class AccountBase(BaseModel):
    username: str
    email: str

class AccountCreate(AccountBase):
    password: str

class AccountResponse(AccountBase):
    user_id: int
    created_on: datetime
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True

class ResumeBase(BaseModel):
    original_filename: str
    file_path: str
    extracted_text: str
    file_size: int

class ResumeCreate(ResumeBase):
    account_id: int

class ResumeResponse(ResumeBase):
    resume_id: int
    account_id: int
    uploaded_at: datetime

    class Config:
        from_attributes = True

class RatingResponse(BaseModel):
    id: int
    resume_id: int
    overall_score: float
    criteria_scores: Dict[str, Any]
    feedback: str
    strengths: List[str]
    improvements: List[str]
    created_at: datetime

    class Config:
        from_attributes = True

class RatingCreate(BaseModel):
    resume_id: int
    overall_score: float
    criteria_scores: Dict[str, Any]
    feedback: str
    strengths: List[str]
    improvements: List[str] 
