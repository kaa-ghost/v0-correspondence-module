-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    number VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('incoming', 'outgoing', 'internal', 'contract')),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'registered', 'in_progress', 'completed', 'archived')),
    content TEXT,
    sender VARCHAR(255),
    recipient VARCHAR(255),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    creator_id INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- Create assignments table
CREATE TABLE IF NOT EXISTS assignments (
    id SERIAL PRIMARY KEY,
    number VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'in_progress', 'completed', 'overdue', 'cancelled')),
    deadline TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    creator_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    executor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    parent_id INTEGER REFERENCES assignments(id) ON DELETE CASCADE
);

-- Create innovations table
CREATE TABLE IF NOT EXISTS innovations (
    id SERIAL PRIMARY KEY,
    number VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'implemented')),
    submitted_at TIMESTAMP,
    reviewed_at TIMESTAMP,
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    creator_id INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- Create attachments table
CREATE TABLE IF NOT EXISTS attachments (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    filepath VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
    assignment_id INTEGER REFERENCES assignments(id) ON DELETE CASCADE,
    innovation_id INTEGER REFERENCES innovations(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_number ON documents(number);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(type);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_creator ON documents(creator_id);
CREATE INDEX IF NOT EXISTS idx_documents_registration_date ON documents(registration_date);

CREATE INDEX IF NOT EXISTS idx_assignments_number ON assignments(number);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON assignments(status);
CREATE INDEX IF NOT EXISTS idx_assignments_priority ON assignments(priority);
CREATE INDEX IF NOT EXISTS idx_assignments_creator ON assignments(creator_id);
CREATE INDEX IF NOT EXISTS idx_assignments_executor ON assignments(executor_id);
CREATE INDEX IF NOT EXISTS idx_assignments_parent ON assignments(parent_id);
CREATE INDEX IF NOT EXISTS idx_assignments_deadline ON assignments(deadline);

CREATE INDEX IF NOT EXISTS idx_innovations_number ON innovations(number);
CREATE INDEX IF NOT EXISTS idx_innovations_status ON innovations(status);
CREATE INDEX IF NOT EXISTS idx_innovations_creator ON innovations(creator_id);

CREATE INDEX IF NOT EXISTS idx_attachments_document ON attachments(document_id);
CREATE INDEX IF NOT EXISTS idx_attachments_assignment ON attachments(assignment_id);
CREATE INDEX IF NOT EXISTS idx_attachments_innovation ON attachments(innovation_id);
