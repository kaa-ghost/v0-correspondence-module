-- Insert test documents
INSERT INTO documents (number, title, type, status, sender, recipient, creator_id)
SELECT 
    'DOC-2024-001',
    'Входящее письмо о сотрудничестве',
    'incoming',
    'registered',
    'ООО "Партнер"',
    'Отдел закупок',
    u.id
FROM users u WHERE u.email = 'admin@test.com'
ON CONFLICT (number) DO NOTHING;

INSERT INTO documents (number, title, type, status, sender, recipient, creator_id)
SELECT 
    'DOC-2024-002',
    'Исходящий договор поставки',
    'outgoing',
    'in_progress',
    'Юридический отдел',
    'ООО "Поставщик"',
    u.id
FROM users u WHERE u.email = 'admin@test.com'
ON CONFLICT (number) DO NOTHING;

INSERT INTO documents (number, title, type, status, sender, recipient, creator_id)
SELECT 
    'DOC-2024-003',
    'Внутренний приказ №123',
    'internal',
    'completed',
    'Генеральный директор',
    'Все сотрудники',
    u.id
FROM users u WHERE u.email = 'admin@test.com'
ON CONFLICT (number) DO NOTHING;

-- Insert test assignments
INSERT INTO assignments (number, title, description, priority, status, deadline, creator_id, executor_id)
SELECT 
    'TASK-2024-001',
    'Подготовить отчет по проекту',
    'Необходимо подготовить квартальный отчет по выполнению проектных работ',
    'high',
    'in_progress',
    CURRENT_TIMESTAMP + INTERVAL '7 days',
    c.id,
    e.id
FROM users c 
CROSS JOIN users e
WHERE c.email = 'admin@test.com' AND e.email = 'user@test.com'
ON CONFLICT (number) DO NOTHING;

INSERT INTO assignments (number, title, description, priority, status, deadline, creator_id, executor_id)
SELECT 
    'TASK-2024-002',
    'Провести аудит документации',
    'Проверить соответствие документации стандартам ISO',
    'medium',
    'active',
    CURRENT_TIMESTAMP + INTERVAL '14 days',
    c.id,
    e.id
FROM users c 
CROSS JOIN users e
WHERE c.email = 'admin@test.com' AND e.email = 'manager@test.com'
ON CONFLICT (number) DO NOTHING;

INSERT INTO assignments (number, title, description, priority, status, deadline, creator_id, executor_id)
SELECT 
    'TASK-2024-003',
    'Обновить базу данных клиентов',
    'Актуализировать контактную информацию в CRM системе',
    'urgent',
    'overdue',
    CURRENT_TIMESTAMP - INTERVAL '2 days',
    c.id,
    e.id
FROM users c 
CROSS JOIN users e
WHERE c.email = 'manager@test.com' AND e.email = 'user@test.com'
ON CONFLICT (number) DO NOTHING;

-- Insert test innovations
INSERT INTO innovations (number, title, description, category, status, creator_id)
SELECT 
    'INNOV-2024-001',
    'Автоматизация документооборота',
    'Внедрение системы электронного документооборота для ускорения процессов согласования',
    'Цифровизация',
    'under_review',
    u.id
FROM users u WHERE u.email = 'admin@test.com'
ON CONFLICT (number) DO NOTHING;

INSERT INTO innovations (number, title, description, category, status, submitted_at, creator_id)
SELECT 
    'INNOV-2024-002',
    'Система мониторинга оборудования',
    'IoT решение для отслеживания состояния производственного оборудования',
    'Промышленный интернет вещей',
    'submitted',
    CURRENT_TIMESTAMP - INTERVAL '5 days',
    u.id
FROM users u WHERE u.email = 'user@test.com'
ON CONFLICT (number) DO NOTHING;

INSERT INTO innovations (number, title, description, category, status, submitted_at, reviewed_at, creator_id)
SELECT 
    'INNOV-2024-003',
    'Энергосберегающая технология',
    'Новый метод оптимизации энергопотребления на производстве',
    'Энергоэффективность',
    'approved',
    CURRENT_TIMESTAMP - INTERVAL '30 days',
    CURRENT_TIMESTAMP - INTERVAL '15 days',
    u.id
FROM users u WHERE u.email = 'manager@test.com'
ON CONFLICT (number) DO NOTHING;
