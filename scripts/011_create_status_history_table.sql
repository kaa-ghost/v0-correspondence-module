-- Create status history table for tracking changes in documents and assignments
CREATE TABLE IF NOT EXISTS status_history (
    id SERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,  -- 'document' or 'assignment'
    entity_id INTEGER NOT NULL,  -- ID of document or assignment
    old_status VARCHAR(50),  -- Previous status (null for first entry)
    new_status VARCHAR(50) NOT NULL,  -- New status
    changed_by_user_id INTEGER NOT NULL REFERENCES users(id),
    changed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    comment TEXT,  -- Optional comment about the change
    entity_version INTEGER NOT NULL DEFAULT 1,  -- Version of the entity
    
    CONSTRAINT fk_changed_by FOREIGN KEY (changed_by_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_status_history_entity ON status_history(entity_type, entity_id);
CREATE INDEX idx_status_history_changed_at ON status_history(changed_at DESC);
CREATE INDEX idx_status_history_user ON status_history(changed_by_user_id);

-- Insert initial comment
COMMENT ON TABLE status_history IS 'История изменения статусов документов и поручений';
COMMENT ON COLUMN status_history.entity_type IS 'Тип сущности: document или assignment';
COMMENT ON COLUMN status_history.entity_version IS 'Версия объекта на момент изменения';
