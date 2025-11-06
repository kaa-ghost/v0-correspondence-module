from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.schemas import Innovation, InnovationCreate, InnovationUpdate
from app.models import Innovation as InnovationModel, User, InnovationStatus
from app.auth import get_current_active_user

router = APIRouter()

def generate_innovation_number(db: Session) -> str:
    """Generate unique innovation number"""
    year = datetime.now().year
    last_innovation = db.query(InnovationModel).filter(
        InnovationModel.number.like(f"ИНН-{year}-%")
    ).order_by(InnovationModel.id.desc()).first()
    
    if last_innovation:
        last_num = int(last_innovation.number.split("-")[-1])
        new_num = last_num + 1
    else:
        new_num = 1
    
    return f"ИНН-{year}-{new_num:05d}"

@router.post("/", response_model=Innovation)
def create_innovation(
    innovation: InnovationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    number = generate_innovation_number(db)
    db_innovation = InnovationModel(
        **innovation.model_dump(),
        number=number,
        creator_id=current_user.id,
        status=InnovationStatus.DRAFT
    )
    db.add(db_innovation)
    db.commit()
    db.refresh(db_innovation)
    return db_innovation

@router.post("/{innovation_id}/submit", response_model=Innovation)
def submit_innovation(
    innovation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_innovation = db.query(InnovationModel).filter(InnovationModel.id == innovation_id).first()
    if db_innovation is None:
        raise HTTPException(status_code=404, detail="Innovation not found")
    
    if db_innovation.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to submit this innovation")
    
    db_innovation.status = InnovationStatus.SUBMITTED
    db_innovation.submitted_at = datetime.utcnow()
    db.commit()
    db.refresh(db_innovation)
    return db_innovation

@router.get("/", response_model=List[Innovation])
def read_innovations(
    skip: int = 0,
    limit: int = 100,
    status: Optional[InnovationStatus] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    query = db.query(InnovationModel)
    if status:
        query = query.filter(InnovationModel.status == status)
    innovations = query.offset(skip).limit(limit).all()
    return innovations

@router.get("/my", response_model=List[Innovation])
def read_my_innovations(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    innovations = db.query(InnovationModel).filter(
        InnovationModel.creator_id == current_user.id
    ).offset(skip).limit(limit).all()
    return innovations

@router.get("/{innovation_id}", response_model=Innovation)
def read_innovation(
    innovation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    innovation = db.query(InnovationModel).filter(InnovationModel.id == innovation_id).first()
    if innovation is None:
        raise HTTPException(status_code=404, detail="Innovation not found")
    return innovation

@router.put("/{innovation_id}", response_model=Innovation)
def update_innovation(
    innovation_id: int,
    innovation: InnovationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_innovation = db.query(InnovationModel).filter(InnovationModel.id == innovation_id).first()
    if db_innovation is None:
        raise HTTPException(status_code=404, detail="Innovation not found")
    
    for key, value in innovation.model_dump(exclude_unset=True).items():
        setattr(db_innovation, key, value)
    
    db.commit()
    db.refresh(db_innovation)
    return db_innovation

@router.delete("/{innovation_id}")
def delete_innovation(
    innovation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_innovation = db.query(InnovationModel).filter(InnovationModel.id == innovation_id).first()
    if db_innovation is None:
        raise HTTPException(status_code=404, detail="Innovation not found")
    
    db.delete(db_innovation)
    db.commit()
    return {"message": "Innovation deleted successfully"}
