from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database import Base

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    USER = "user"
    VIEWER = "viewer"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255))
    position = Column(String(255), nullable=True)  # Added position field for job title
    password_hash = Column(String(255), nullable=False)
    role = Column(SQLEnum(UserRole), default=UserRole.USER, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
    
    # Relationships
    sessions = relationship("Session", back_populates="user", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="creator")
    assignments = relationship("Assignment", foreign_keys="Assignment.creator_id", back_populates="creator")
    assigned_tasks = relationship("Assignment", foreign_keys="Assignment.executor_id", back_populates="executor")

class Session(Base):
    __tablename__ = "sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token = Column(String(500), unique=True, index=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    ip_address = Column(String(45))
    user_agent = Column(Text)
    
    # Relationships
    user = relationship("User", back_populates="sessions")

class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token = Column(String(500), unique=True, index=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    used = Column(Boolean, default=False)
    
    # Relationships
    user = relationship("User")

class DocumentType(str, enum.Enum):
    INCOMING = "incoming"
    OUTGOING = "outgoing"
    INTERNAL = "internal"
    CONTRACT = "contract"

class DocumentStatus(str, enum.Enum):
    NEW = "new"
    IN_PROGRESS = "in-progress"
    PROCESSED = "processed"

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    source = Column(String(255), nullable=False)  # Источник
    doc_date = Column(DateTime, nullable=False)  # Дата
    doc_time = Column(DateTime, nullable=False)  # Время
    number = Column(String(100), unique=True, index=True, nullable=False)  # Номер
    sender_name = Column(String(255), nullable=False)  # ФИО отправителя
    received_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # Кто принял
    status = Column(SQLEnum(DocumentStatus), default=DocumentStatus.NEW, nullable=False)
    title = Column(String(500))  # Тема
    description = Column(Text)  # Описание
    content = Column(Text)
    sender = Column(String)
    recipient = Column(String)
    registration_date = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by_user_id = Column(Integer, ForeignKey("users.id"))
    
    # Foreign keys
    creator_id = Column(Integer, ForeignKey("users.id"))
    
    # Relationships
    creator = relationship("User", back_populates="documents")
    attachments = relationship("Attachment", back_populates="document")
    received_by = relationship("User", foreign_keys=[received_by_user_id])
    created_by = relationship("User", foreign_keys=[created_by_user_id])

class AssignmentPriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class AssignmentStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    OVERDUE = "overdue"
    CANCELLED = "cancelled"

class Assignment(Base):
    __tablename__ = "assignments"
    
    id = Column(Integer, primary_key=True, index=True)
    number = Column(String, unique=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    priority = Column(SQLEnum(AssignmentPriority), default=AssignmentPriority.MEDIUM)
    status = Column(SQLEnum(AssignmentStatus), default=AssignmentStatus.DRAFT)
    deadline = Column(DateTime, nullable=False)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Foreign keys
    creator_id = Column(Integer, ForeignKey("users.id"))
    executor_id = Column(Integer, ForeignKey("users.id"))
    parent_id = Column(Integer, ForeignKey("assignments.id"), nullable=True)
    
    # Relationships
    creator = relationship("User", foreign_keys=[creator_id], back_populates="assignments")
    executor = relationship("User", foreign_keys=[executor_id], back_populates="assigned_tasks")
    parent = relationship("Assignment", remote_side=[id], backref="children")
    attachments = relationship("Attachment", back_populates="assignment")

class Attachment(Base):
    __tablename__ = "attachments"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    filepath = Column(String, nullable=False)
    file_size = Column(Integer)
    mime_type = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Foreign keys (one of these will be set)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=True)
    assignment_id = Column(Integer, ForeignKey("assignments.id"), nullable=True)
    
    # Relationships
    document = relationship("Document", back_populates="attachments")
    assignment = relationship("Assignment", back_populates="attachments")

class StatusHistory(Base):
    __tablename__ = "status_history"
    
    id = Column(Integer, primary_key=True, index=True)
    entity_type = Column(String(50), nullable=False)  # 'document' or 'assignment'
    entity_id = Column(Integer, nullable=False)
    old_status = Column(String(50), nullable=True)  # Previous status
    new_status = Column(String(50), nullable=False)  # New status
    changed_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    changed_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    comment = Column(Text, nullable=True)
    entity_version = Column(Integer, default=1, nullable=False)
    
    # Relationships
    changed_by = relationship("User")
