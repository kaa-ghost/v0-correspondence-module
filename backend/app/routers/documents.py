from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.schemas import Document, DocumentCreate, DocumentUpdate, StatusHistory, StatusHistoryWithUser
from app.models import Document as DocumentModel, User, DocumentType, DocumentStatus, StatusHistory as StatusHistoryModel
from app.auth import get_current_active_user

router = APIRouter()

def generate_document_number(db: Session, doc_type: DocumentType) -> str:
    """Generate unique document number"""
    prefix_map = {
        DocumentType.INCOMING: "ВХ",
        DocumentType.OUTGOING: "ИСХ",
        DocumentType.INTERNAL: "ВН",
        DocumentType.CONTRACT: "ДОГ"
    }
    prefix = prefix_map.get(doc_type, "ДОК")
    year = datetime.now().year
    
    # Get last number for this type and year
    last_doc = db.query(DocumentModel).filter(
        DocumentModel.type == doc_type,
        DocumentModel.number.like(f"{prefix}-{year}-%")
    ).order_by(DocumentModel.id.desc()).first()
    
    if last_doc:
        last_num = int(last_doc.number.split("-")[-1])
        new_num = last_num + 1
    else:
        new_num = 1
    
    return f"{prefix}-{year}-{new_num:05d}"

def record_status_change(
    db: Session,
    entity_type: str,
    entity_id: int,
    old_status: Optional[str],
    new_status: str,
    user_id: int,
    comment: Optional[str] = None
):
    """Record a status change in history"""
    # Get current version count
    version = db.query(StatusHistoryModel).filter(
        StatusHistoryModel.entity_type == entity_type,
        StatusHistoryModel.entity_id == entity_id
    ).count() + 1
    
    history = StatusHistoryModel(
        entity_type=entity_type,
        entity_id=entity_id,
        old_status=old_status,
        new_status=new_status,
        changed_by_user_id=user_id,
        comment=comment,
        entity_version=version
    )
    db.add(history)
    db.commit()

@router.post("/", response_model=Document)
def create_document(
    document: DocumentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    number = generate_document_number(db, document.type)
    db_document = DocumentModel(
        **document.model_dump(),
        number=number,
        creator_id=current_user.id,
        status=DocumentStatus.REGISTERED
    )
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    
    record_status_change(
        db=db,
        entity_type="document",
        entity_id=db_document.id,
        old_status=None,
        new_status=db_document.status.value,
        user_id=current_user.id,
        comment="Документ создан"
    )
    
    return db_document

@router.get("/", response_model=List[Document])
def read_documents(
    skip: int = 0,
    limit: int = 100,
    type: Optional[DocumentType] = None,
    status: Optional[DocumentStatus] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    query = db.query(DocumentModel)
    if type:
        query = query.filter(DocumentModel.type == type)
    if status:
        query = query.filter(DocumentModel.status == status)
    documents = query.offset(skip).limit(limit).all()
    return documents

@router.get("/{document_id}", response_model=Document)
def read_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    document = db.query(DocumentModel).filter(DocumentModel.id == document_id).first()
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    return document

@router.put("/{document_id}", response_model=Document)
def update_document(
    document_id: int,
    document: DocumentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_document = db.query(DocumentModel).filter(DocumentModel.id == document_id).first()
    if db_document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    
    old_status = db_document.status.value if db_document.status else None
    status_changed = False
    
    for key, value in document.model_dump(exclude_unset=True).items():
        if key == "status" and value != old_status:
            status_changed = True
        setattr(db_document, key, value)
    
    db.commit()
    db.refresh(db_document)
    
    if status_changed:
        record_status_change(
            db=db,
            entity_type="document",
            entity_id=db_document.id,
            old_status=old_status,
            new_status=db_document.status.value,
            user_id=current_user.id,
            comment="Статус изменен"
        )
    
    return db_document

@router.delete("/{document_id}")
def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_document = db.query(DocumentModel).filter(DocumentModel.id == document_id).first()
    if db_document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    
    db.delete(db_document)
    db.commit()
    return {"message": "Document deleted successfully"}

@router.get("/{document_id}/history", response_model=List[StatusHistoryWithUser])
def get_document_history(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get status change history for a document"""
    history = db.query(
        StatusHistoryModel,
        User.full_name,
        User.email
    ).join(
        User, StatusHistoryModel.changed_by_user_id == User.id
    ).filter(
        StatusHistoryModel.entity_type == "document",
        StatusHistoryModel.entity_id == document_id
    ).order_by(
        StatusHistoryModel.changed_at.desc()
    ).all()
    
    return [
        {
            **h[0].__dict__,
            "changed_by_name": h[1],
            "changed_by_email": h[2]
        }
        for h in history
    ]
