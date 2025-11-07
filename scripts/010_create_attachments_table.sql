-- Create attachments table for storing file information
CREATE TABLE IF NOT EXISTS attachments (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(500) NOT NULL,  -- Original filename
    filepath VARCHAR(1000) NOT NULL,  -- Path where file is stored
    file_size INTEGER,  -- File size in bytes
    mime_type VARCHAR(255),  -- MIME type of the file
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign keys (one of these will be set depending on what the file is attached to)
    document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
    assignment_id INTEGER REFERENCES assignments(id) ON DELETE CASCADE,
    innovation_id INTEGER REFERENCES innovations(id) ON DELETE CASCADE
);

-- Create indexes for faster queries
CREATE INDEX idx_attachments_document ON attachments(document_id);
CREATE INDEX idx_attachments_assignment ON attachments(assignment_id);
CREATE INDEX idx_attachments_innovation ON attachments(innovation_id);

COMMENT ON TABLE attachments IS 'Таблица вложений для документов, поручений и инноваций';
COMMENT ON COLUMN attachments.filename IS 'Оригинальное имя файла';
COMMENT ON COLUMN attachments.filepath IS 'Путь к файлу на сервере';
COMMENT ON COLUMN attachments.file_size IS 'Размер файла в байтах';
COMMENT ON COLUMN attachments.mime_type IS 'MIME тип файла';
