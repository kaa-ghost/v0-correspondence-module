from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, List
from app.models import UserRole, DocumentType, DocumentStatus, AssignmentPriority, AssignmentStatus, InnovationStatus

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    position: Optional[str] = None  # Added position field for job title

class UserCreate(UserBase):
    password: str
    role: Optional[UserRole] = UserRole.USER

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    position: Optional[str] = None  # Added position field for updates
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None

class User(UserBase):
    id: int
    role: UserRole
    is_active: bool
    created_at: datetime
    last_login: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Session schemas
class SessionCreate(BaseModel):
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None

class SessionResponse(BaseModel):
    id: int
    token: str
    expires_at: datetime
    created_at: datetime
    
    class Config:
        from_attributes = True

# Auth schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class TokenData(BaseModel):
    user_id: Optional[int] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# Password reset schemas
class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str

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
