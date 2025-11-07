# Entity-Relationship Diagram (ERD)

## Database Schema for Correspondence Management System

\`\`\`mermaid
erDiagram
    USERS ||--o{ SESSIONS : has
    USERS ||--o{ PASSWORD_RESET_TOKENS : has
    USERS ||--o{ DOCUMENTS : creates
    USERS ||--o{ DOCUMENTS : receives
    USERS ||--o{ ASSIGNMENTS : creates
    USERS ||--o{ ASSIGNMENTS : executes
    USERS ||--o{ STATUS_HISTORY : changes
    DOCUMENTS ||--o{ ATTACHMENTS : has
    ASSIGNMENTS ||--o{ ATTACHMENTS : has
    ASSIGNMENTS ||--o{ ASSIGNMENTS : "parent-child"
    DOCUMENTS ||--o{ STATUS_HISTORY : tracks
    ASSIGNMENTS ||--o{ STATUS_HISTORY : tracks

    USERS {
        int id PK
        string email UK
        string full_name
        string position
        string password_hash
        enum role "admin, user, viewer"
        boolean is_active
        datetime created_at
        datetime updated_at
        datetime last_login
    }

    SESSIONS {
        int id PK
        int user_id FK
        string token UK
        datetime expires_at
        datetime created_at
        string ip_address
        text user_agent
    }

    PASSWORD_RESET_TOKENS {
        int id PK
        int user_id FK
        string token UK
        datetime expires_at
        datetime created_at
        boolean used
    }

    DOCUMENTS {
        int id PK
        string source
        datetime doc_date
        datetime doc_time
        string number UK
        string sender_name
        int received_by_user_id FK
        enum status "new, in-progress, processed"
        string title
        text description
        text content
        string sender
        string recipient
        datetime registration_date
        int creator_id FK
        int created_by_user_id FK
        datetime created_at
        datetime updated_at
    }

    ASSIGNMENTS {
        int id PK
        string number UK
        string title
        text description
        enum priority "low, medium, high, urgent"
        enum status "draft, active, in_progress, completed, overdue, cancelled"
        datetime deadline
        datetime completed_at
        int creator_id FK
        int executor_id FK
        int parent_id FK
        datetime created_at
        datetime updated_at
    }

    ATTACHMENTS {
        int id PK
        string filename
        string filepath
        int file_size
        string mime_type
        int document_id FK "nullable"
        int assignment_id FK "nullable"
        datetime created_at
    }

    STATUS_HISTORY {
        int id PK
        string entity_type "document or assignment"
        int entity_id
        string old_status
        string new_status
        int changed_by_user_id FK
        datetime changed_at
        text comment
        int entity_version
    }
\`\`\`

## Relationships Description

### Users Table
- **Primary relationships:**
  - One user can have multiple sessions (one-to-many)
  - One user can have multiple password reset tokens (one-to-many)
  - One user can create multiple documents (one-to-many as creator)
  - One user can receive multiple documents (one-to-many as receiver)
  - One user can create multiple assignments (one-to-many as creator)
  - One user can execute multiple assignments (one-to-many as executor)
  - One user can make multiple status changes (one-to-many)

### Documents Table
- **Fields:**
  - `source`: Source of the incoming correspondence
  - `doc_date`: Document date
  - `doc_time`: Document time
  - `number`: Unique document number
  - `sender_name`: Full name of sender
  - `received_by_user_id`: User who received the document
  - `status`: Current status (new, in-progress, processed)
- **Relationships:**
  - Belongs to one creator user (many-to-one)
  - Belongs to one receiver user (many-to-one)
  - Can have multiple attachments (one-to-many)
  - Has multiple status history records (one-to-many)

### Assignments Table
- **Fields:**
  - `number`: Unique assignment number
  - `priority`: Priority level (low, medium, high, urgent)
  - `status`: Current status (draft, active, in_progress, completed, overdue, cancelled)
  - `parent_id`: Self-referencing for hierarchical assignments
- **Relationships:**
  - Belongs to one creator user (many-to-one)
  - Belongs to one executor user (many-to-one)
  - Can have a parent assignment (self-referencing)
  - Can have multiple child assignments (one-to-many)
  - Can have multiple attachments (one-to-many)
  - Has multiple status history records (one-to-many)

### Attachments Table
- **Polymorphic relationship:**
  - Can belong to either a document OR an assignment
  - Uses nullable foreign keys (document_id or assignment_id)

### Status History Table
- **Tracks all status changes:**
  - `entity_type`: Type of entity ('document' or 'assignment')
  - `entity_id`: ID of the tracked entity
  - `old_status`: Previous status value
  - `new_status`: New status value
  - `changed_by_user_id`: User who made the change
  - `entity_version`: Version number for tracking changes

## Enumerations

### UserRole
- `admin` - Administrator with full access
- `user` - Regular user
- `viewer` - Read-only access

### DocumentStatus
- `new` - New document
- `in-progress` - Being processed
- `processed` - Completed processing

### AssignmentPriority
- `low` - Low priority
- `medium` - Medium priority
- `high` - High priority
- `urgent` - Urgent priority

### AssignmentStatus
- `draft` - Draft state
- `active` - Active assignment
- `in_progress` - Work in progress
- `completed` - Completed
- `overdue` - Past deadline
- `cancelled` - Cancelled

## Database Features

1. **User Authentication & Authorization**
   - Session-based authentication with token management
   - Password reset functionality
   - Role-based access control (RBAC)

2. **Document Management**
   - Incoming correspondence tracking
   - Document metadata (source, date, time, number)
   - Status tracking with history
   - File attachments support

3. **Assignment Management**
   - Hierarchical task structure (parent-child)
   - Priority and status tracking
   - Deadline management
   - File attachments support

4. **Audit Trail**
   - Complete status change history
   - Version tracking for entities
   - User attribution for all changes
   - Timestamp tracking

5. **File Management**
   - Polymorphic attachments (documents and assignments)
   - File metadata storage (size, type, path)
