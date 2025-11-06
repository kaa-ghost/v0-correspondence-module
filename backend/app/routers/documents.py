from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.schemas import Document, DocumentCreate, DocumentUpdate
from app.models import Document as DocumentModel, User, DocumentType, DocumentStatus
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
    
    for key, value in document.model_dump(exclude_unset=True).items():
        setattr(db_document, key, value)
    
    db.commit()
    db.refresh(db_document)
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
