"""
Database initialization script
Run this to create all tables and seed test data
"""
import sys
import os
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent))

from app.database import engine, Base
from app.models import User, Session, Document, Assignment, Innovation, Attachment
from sqlalchemy.orm import Session as DBSession
from passlib.context import CryptContext
from datetime import datetime, timedelta

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def init_database():
    """Initialize database with tables and test data"""
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Tables created successfully")
    
    # Create session
    db = DBSession(bind=engine)
    
    try:
        # Check if users already exist
        existing_users = db.query(User).count()
        if existing_users > 0:
            print(f"✓ Database already contains {existing_users} users")
            print("  Skipping test data creation")
            return
        
        print("\nCreating test users...")
        # Create test users
        test_password = pwd_context.hash("admin123")
        
        admin = User(
            email="admin@test.com",
            full_name="Test Administrator",
            password_hash=test_password,
            is_active=True
        )
        user = User(
            email="user@test.com",
            full_name="Test User",
            password_hash=test_password,
            is_active=True
        )
        manager = User(
            email="manager@test.com",
            full_name="Test Manager",
            password_hash=test_password,
            is_active=True
        )
        
        db.add_all([admin, user, manager])
        db.commit()
        print("✓ Test users created")
        
        print("\nCreating test documents...")
        # Create test documents
        from app.models import DocumentType, DocumentStatus
        
        doc1 = Document(
            number="DOC-2024-001",
            title="Входящее письмо о сотрудничестве",
            type=DocumentType.INCOMING,
            status=DocumentStatus.REGISTERED,
            sender="ООО 'Партнер'",
            recipient="Отдел закупок",
            creator_id=admin.id
        )
        doc2 = Document(
            number="DOC-2024-002",
            title="Исходящий договор поставки",
            type=DocumentType.OUTGOING,
            status=DocumentStatus.IN_PROGRESS,
            sender="Юридический отдел",
            recipient="ООО 'Поставщик'",
            creator_id=admin.id
        )
        doc3 = Document(
            number="DOC-2024-003",
            title="Внутренний приказ №123",
            type=DocumentType.INTERNAL,
            status=DocumentStatus.COMPLETED,
            sender="Генеральный директор",
            recipient="Все сотрудники",
            creator_id=admin.id
        )
        
        db.add_all([doc1, doc2, doc3])
        db.commit()
        print("✓ Test documents created")
        
        print("\nCreating test assignments...")
        # Create test assignments
        from app.models import AssignmentPriority, AssignmentStatus
        
        task1 = Assignment(
            number="TASK-2024-001",
            title="Подготовить отчет по проекту",
            description="Необходимо подготовить квартальный отчет по выполнению проектных работ",
            priority=AssignmentPriority.HIGH,
            status=AssignmentStatus.IN_PROGRESS,
            deadline=datetime.utcnow() + timedelta(days=7),
            creator_id=admin.id,
            executor_id=user.id
        )
        task2 = Assignment(
            number="TASK-2024-002",
            title="Провести аудит документации",
            description="Проверить соответствие документации стандартам ISO",
            priority=AssignmentPriority.MEDIUM,
            status=AssignmentStatus.ACTIVE,
            deadline=datetime.utcnow() + timedelta(days=14),
            creator_id=admin.id,
            executor_id=manager.id
        )
        task3 = Assignment(
            number="TASK-2024-003",
            title="Обновить базу данных клиентов",
            description="Актуализировать контактную информацию в CRM системе",
            priority=AssignmentPriority.URGENT,
            status=AssignmentStatus.OVERDUE,
            deadline=datetime.utcnow() - timedelta(days=2),
            creator_id=manager.id,
            executor_id=user.id
        )
        
        db.add_all([task1, task2, task3])
        db.commit()
        print("✓ Test assignments created")
        
        print("\nCreating test innovations...")
        # Create test innovations
        from app.models import InnovationStatus
        
        innov1 = Innovation(
            number="INNOV-2024-001",
            title="Автоматизация документооборота",
            description="Внедрение системы электронного документооборота для ускорения процессов согласования",
            category="Цифровизация",
            status=InnovationStatus.UNDER_REVIEW,
            creator_id=admin.id
        )
        innov2 = Innovation(
            number="INNOV-2024-002",
            title="Система мониторинга оборудования",
            description="IoT решение для отслеживания состояния производственного оборудования",
            category="Промышленный интернет вещей",
            status=InnovationStatus.SUBMITTED,
            submitted_at=datetime.utcnow() - timedelta(days=5),
            creator_id=user.id
        )
        innov3 = Innovation(
            number="INNOV-2024-003",
            title="Энергосберегающая технология",
            description="Новый метод оптимизации энергопотребления на производстве",
            category="Энергоэффективность",
            status=InnovationStatus.APPROVED,
            submitted_at=datetime.utcnow() - timedelta(days=30),
            reviewed_at=datetime.utcnow() - timedelta(days=15),
            creator_id=manager.id
        )
        
        db.add_all([innov1, innov2, innov3])
        db.commit()
        print("✓ Test innovations created")
        
        print("\n" + "="*50)
        print("Database initialization completed successfully!")
        print("="*50)
        print("\nTest users created:")
        print("  Email: admin@test.com | Password: admin123")
        print("  Email: user@test.com | Password: admin123")
        print("  Email: manager@test.com | Password: admin123")
        print("\nTest data:")
        print(f"  Documents: {db.query(Document).count()}")
        print(f"  Assignments: {db.query(Assignment).count()}")
        print(f"  Innovations: {db.query(Innovation).count()}")
        
    except Exception as e:
        print(f"✗ Error: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("="*50)
    print("Database Initialization Script")
    print("="*50)
    init_database()
