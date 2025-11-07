from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.schemas import Assignment, AssignmentCreate, AssignmentUpdate, StatusHistory, StatusHistoryWithUser
from app.models import Assignment as AssignmentModel, User, AssignmentStatus, StatusHistory as StatusHistoryModel
from app.auth import get_current_active_user

router = APIRouter()

def generate_assignment_number(db: Session) -> str:
    """Generate unique assignment number"""
    year = datetime.now().year
    last_assignment = db.query(AssignmentModel).filter(
        AssignmentModel.number.like(f"ПР-{year}-%")
    ).order_by(AssignmentModel.id.desc()).first()
    
    if last_assignment:
        last_num = int(last_assignment.number.split("-")[-1])
        new_num = last_num + 1
    else:
        new_num = 1
    
    return f"ПР-{year}-{new_num:05d}"

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

@router.post("/", response_model=Assignment)
def create_assignment(
    assignment: AssignmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    number = generate_assignment_number(db)
    db_assignment = AssignmentModel(
        **assignment.model_dump(),
        number=number,
        creator_id=current_user.id,
        status=AssignmentStatus.ACTIVE
    )
    db.add(db_assignment)
    db.commit()
    db.refresh(db_assignment)
    
    record_status_change(
        db=db,
        entity_type="assignment",
        entity_id=db_assignment.id,
        old_status=None,
        new_status=db_assignment.status.value,
        user_id=current_user.id,
        comment="Поручение создано"
    )
    
    return db_assignment

@router.get("/", response_model=List[Assignment])
def read_assignments(
    skip: int = 0,
    limit: int = 100,
    status: Optional[AssignmentStatus] = None,
    executor_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    query = db.query(AssignmentModel)
    if status:
        query = query.filter(AssignmentModel.status == status)
    if executor_id:
        query = query.filter(AssignmentModel.executor_id == executor_id)
    assignments = query.offset(skip).limit(limit).all()
    return assignments

@router.get("/my", response_model=List[Assignment])
def read_my_assignments(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    assignments = db.query(AssignmentModel).filter(
        AssignmentModel.executor_id == current_user.id
    ).offset(skip).limit(limit).all()
    return assignments

@router.get("/{assignment_id}", response_model=Assignment)
def read_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    assignment = db.query(AssignmentModel).filter(AssignmentModel.id == assignment_id).first()
    if assignment is None:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return assignment

@router.get("/{assignment_id}/children", response_model=List[Assignment])
def read_child_assignments(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    children = db.query(AssignmentModel).filter(
        AssignmentModel.parent_id == assignment_id
    ).all()
    return children

@router.put("/{assignment_id}", response_model=Assignment)
def update_assignment(
    assignment_id: int,
    assignment: AssignmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_assignment = db.query(AssignmentModel).filter(AssignmentModel.id == assignment_id).first()
    if db_assignment is None:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    old_status = db_assignment.status.value if db_assignment.status else None
    status_changed = False
    
    for key, value in assignment.model_dump(exclude_unset=True).items():
        if key == "status" and value != old_status:
            status_changed = True
        setattr(db_assignment, key, value)
    
    db.commit()
    db.refresh(db_assignment)
    
    if status_changed:
        record_status_change(
            db=db,
            entity_type="assignment",
            entity_id=db_assignment.id,
            old_status=old_status,
            new_status=db_assignment.status.value,
            user_id=current_user.id,
            comment="Статус изменен"
        )
    
    return db_assignment

@router.delete("/{assignment_id}")
def delete_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_assignment = db.query(AssignmentModel).filter(AssignmentModel.id == assignment_id).first()
    if db_assignment is None:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    db.delete(db_assignment)
    db.commit()
    return {"message": "Assignment deleted successfully"}

@router.get("/{assignment_id}/history", response_model=List[StatusHistoryWithUser])
def get_assignment_history(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get status change history for an assignment"""
    history = db.query(
        StatusHistoryModel,
        User.full_name,
        User.email
    ).join(
        User, StatusHistoryModel.changed_by_user_id == User.id
    ).filter(
        StatusHistoryModel.entity_type == "assignment",
        StatusHistoryModel.entity_id == assignment_id
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
