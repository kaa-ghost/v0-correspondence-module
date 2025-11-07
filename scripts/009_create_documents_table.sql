-- Create documents table with required fields for incoming correspondence
CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    source VARCHAR(255) NOT NULL,  -- Источник
    doc_date DATE NOT NULL,  -- Дата
    doc_time TIME NOT NULL,  -- Время
    number VARCHAR(100) NOT NULL UNIQUE,  -- Номер
    sender_name VARCHAR(255) NOT NULL,  -- ФИО отправителя
    received_by_user_id INTEGER NOT NULL REFERENCES users(id),  -- Кто принял
    status VARCHAR(50) NOT NULL DEFAULT 'new',  -- Статус: new, in-progress, processed
    title VARCHAR(500),  -- Тема/заголовок
    description TEXT,  -- Описание
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by_user_id INTEGER REFERENCES users(id)
);

-- Create index on status for faster filtering
CREATE INDEX idx_documents_status ON documents(status);

-- Create index on doc_date for faster date-based queries
CREATE INDEX idx_documents_date ON documents(doc_date);

-- Create index on received_by_user_id for user-specific queries
CREATE INDEX idx_documents_received_by ON documents(received_by_user_id);

-- Insert sample data
INSERT INTO documents (source, doc_date, doc_time, number, sender_name, received_by_user_id, status, title, description, created_by_user_id)
VALUES 
    ('Почта России', '2025-01-15', '10:30:00', 'ВХ-2025-001', 'Иванов Иван Иванович', 1, 'new', 'Запрос на предоставление информации', 'Запрос о предоставлении технической документации', 1),
    ('Email', '2025-01-14', '14:20:00', 'ВХ-2025-002', 'Петров Петр Петрович', 1, 'in-progress', 'Договор на поставку', 'Договор на поставку оборудования №123', 1),
    ('Курьер', '2025-01-13', '09:15:00', 'ВХ-2025-003', 'Сидоров Сидор Сидорович', 1, 'processed', 'Заявка на участие в тендере', 'Заявка на участие в тендере №456', 1);

COMMENT ON TABLE documents IS 'Таблица входящей корреспонденции';
COMMENT ON COLUMN documents.source IS 'Источник получения документа';
COMMENT ON COLUMN documents.doc_date IS 'Дата документа';
COMMENT ON COLUMN documents.doc_time IS 'Время получения документа';
COMMENT ON COLUMN documents.number IS 'Регистрационный номер документа';
COMMENT ON COLUMN documents.sender_name IS 'ФИО отправителя';
COMMENT ON COLUMN documents.received_by_user_id IS 'ID пользователя, который принял документ';
COMMENT ON COLUMN documents.status IS 'Статус документа: new (Новое), in-progress (В работе), processed (Обработано)';
