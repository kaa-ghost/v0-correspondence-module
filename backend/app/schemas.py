from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, List
from app.models import UserRole, DocumentType, DocumentStatus, AssignmentPriority, AssignmentStatus

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
    source: str = Field(..., description="Источник получения документа")
    doc_date: datetime = Field(..., description="Дата документа")
    doc_time: datetime = Field(..., description="Время получения документа")
    number: str = Field(..., description="Регистрационный номер")
    sender_name: str = Field(..., description="ФИО отправителя")
    received_by_user_id: int = Field(..., description="ID пользователя, который принял")
    title: Optional[str] = Field(None, description="Тема документа")
    description: Optional[str] = Field(None, description="Описание")

class DocumentCreate(DocumentBase):
    pass

class DocumentUpdate(BaseModel):
    source: Optional[str] = None
    doc_date: Optional[datetime] = None
    doc_time: Optional[datetime] = None
    sender_name: Optional[str] = None
    received_by_user_id: Optional[int] = None
    status: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None

class Document(DocumentBase):
    id: int
    status: str
    created_at: datetime
    created_by_user_id: Optional[int] = None
    
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

# StatusHistory schemas
class StatusHistoryBase(BaseModel):
    entity_type: str
    entity_id: int
    old_status: Optional[str] = None
    new_status: str
    comment: Optional[str] = None

class StatusHistoryCreate(StatusHistoryBase):
    pass

class StatusHistory(StatusHistoryBase):
    id: int
    changed_by_user_id: int
    changed_at: datetime
    entity_version: int
    
    class Config:
        from_attributes = True

class StatusHistoryWithUser(StatusHistory):
    changed_by_name: str
    changed_by_email: str
