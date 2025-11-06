from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from sqlalchemy import and_
import secrets

from app.database import get_db
from app.schemas import (
    Token, UserCreate, User, LoginRequest, 
    PasswordResetRequest, PasswordResetConfirm
)
from app.auth import get_password_hash, verify_password
from app.models import User as UserModel, Session as SessionModel, PasswordResetToken
from app.config import settings

router = APIRouter()

def create_session_token() -> str:
    """Generate a secure random session token"""
    return secrets.token_urlsafe(32)

def get_client_info(request: Request):
    """Extract client IP and user agent from request"""
    ip_address = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent", "")
    return ip_address, user_agent

@router.post("/register", response_model=User)
def register(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    db_user = db.query(UserModel).filter(UserModel.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = UserModel(
        email=user.email,
        full_name=user.full_name,
        password_hash=hashed_password,
        is_active=True
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login", response_model=Token)
def login(
    login_data: LoginRequest, 
    request: Request,
    db: Session = Depends(get_db)
):
    # Authenticate user
    user = db.query(UserModel).filter(UserModel.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive"
        )
    
    db.query(SessionModel).filter(SessionModel.user_id == user.id).delete()
    
    # Create new session
    ip_address, user_agent = get_client_info(request)
    session_token = create_session_token()
    expires_at = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    new_session = SessionModel(
        user_id=user.id,
        token=session_token,
        expires_at=expires_at,
        ip_address=ip_address,
        user_agent=user_agent
    )
    db.add(new_session)
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.commit()
    db.refresh(new_session)
    
    return {
        "access_token": session_token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/logout")
def logout(token: str, db: Session = Depends(get_db)):
    session = db.query(SessionModel).filter(SessionModel.token == token).first()
    if session:
        db.delete(session)
        db.commit()
    return {"message": "Logged out successfully"}

@router.get("/validate", response_model=User)
def validate_session(token: str, db: Session = Depends(get_db)):
    session = db.query(SessionModel).filter(
        and_(
            SessionModel.token == token,
            SessionModel.expires_at > datetime.utcnow()
        )
    ).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session"
        )
    
    user = db.query(UserModel).filter(UserModel.id == session.user_id).first()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )
    
    return user

@router.post("/password-reset/request")
def request_password_reset(
    reset_request: PasswordResetRequest,
    db: Session = Depends(get_db)
):
    user = db.query(UserModel).filter(UserModel.email == reset_request.email).first()
    
    # Always return success to prevent email enumeration
    if not user:
        return {"message": "If the email exists, a reset link has been sent"}
    
    # Generate reset token
    reset_token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(hours=1)
    
    # Invalidate old tokens
    db.query(PasswordResetToken).filter(
        and_(
            PasswordResetToken.user_id == user.id,
            PasswordResetToken.used == False
        )
    ).update({"used": True})
    
    # Create new reset token
    new_token = PasswordResetToken(
        user_id=user.id,
        token=reset_token,
        expires_at=expires_at
    )
    db.add(new_token)
    db.commit()
    
    # TODO: Send email with reset link
    # For now, just return the token (in production, send via email)
    return {
        "message": "If the email exists, a reset link has been sent",
        "token": reset_token  # Remove this in production
    }

@router.post("/password-reset/confirm")
def confirm_password_reset(
    reset_data: PasswordResetConfirm,
    db: Session = Depends(get_db)
):
    # Find valid token
    reset_token = db.query(PasswordResetToken).filter(
        and_(
            PasswordResetToken.token == reset_data.token,
            PasswordResetToken.used == False,
            PasswordResetToken.expires_at > datetime.utcnow()
        )
    ).first()
    
    if not reset_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
    
    # Update password
    user = db.query(UserModel).filter(UserModel.id == reset_token.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user.password_hash = get_password_hash(reset_data.new_password)
    reset_token.used = True
    
    # Terminate all sessions
    db.query(SessionModel).filter(SessionModel.user_id == user.id).delete()
    
    db.commit()
    
    return {"message": "Password reset successfully"}
