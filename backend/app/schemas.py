from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, List
from app.models import UserRole, DocumentType, DocumentStatus, AssignmentPriority, AssignmentStatus, InnovationStatus

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    role: Optional[UserRole] = None

class User(UserBase):
    id: int
    role: UserRole
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Auth schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Document schemas
class DocumentBase(BaseModel):
    title: str
    type: DocumentType
    content: Optional[str] = None
    sender: Optional[str] = None
    recipient: Optional[str] = None

class DocumentCreate(DocumentBase):
    pass

class DocumentUpdate(BaseModel):
    title: Optional[str] = None
    status: Optional[DocumentStatus] = None
    content: Optional[str] = None
    sender: Optional[str] = None
    recipient: Optional[str] = None

class Document(DocumentBase):
    id: int
    number: str
    status: DocumentStatus
    registration_date: datetime
    created_at: datetime
    creator_id: int
    
    class Config:
        from_attributes = True

# Assignment schemas
class AssignmentBase(BaseModel):
    title: str
    description: Optional[str] = None
    priority: AssignmentPriority = AssignmentPriority.MEDIUM
    deadline: datetime
    executor_id: int

class AssignmentCreate(AssignmentBase):
    parent_id: Optional[int] = None

class AssignmentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[AssignmentPriority] = None
    status: Optional[AssignmentStatus] = None
    deadline: Optional[datetime] = None
    executor_id: Optional[int] = None

class Assignment(AssignmentBase):
    id: int
    number: str
    status: AssignmentStatus
    created_at: datetime
    creator_id: int
    parent_id: Optional[int] = None
    
    class Config:
        from_attributes = True

# Innovation schemas
class InnovationBase(BaseModel):
    title: str
    description: str
    category: Optional[str] = None

class InnovationCreate(InnovationBase):
    pass

class InnovationUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    status: Optional[InnovationStatus] = None
    feedback: Optional[str] = None

class Innovation(InnovationBase):
    id: int
    number: str
    status: InnovationStatus
    created_at: datetime
    creator_id: int
    submitted_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Attachment schema
class AttachmentBase(BaseModel):
    filename: str
    file_size: int
    mime_type: str

class Attachment(AttachmentBase):
    id: int
    filepath: str
    created_at: datetime
    
    class Config:
        from_attributes = True
