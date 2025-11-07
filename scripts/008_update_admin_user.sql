-- Update admin@test.com with role and position
UPDATE users 
SET 
    role = 'admin',
    position = 'Системный администратор',
    full_name = 'Администратор'
WHERE email = 'admin@test.com';

-- Update other test users
UPDATE users 
SET 
    role = 'user',
    position = 'Пользователь',
    full_name = 'Тестовый пользователь'
WHERE email = 'user@test.com';

UPDATE users 
SET 
    role = 'user',
    position = 'Менеджер',
    full_name = 'Тестовый менеджер'
WHERE email = 'manager@test.com';

-- Verify all updates
SELECT email, full_name, role, position, is_active 
FROM users 
WHERE email IN ('admin@test.com', 'user@test.com', 'manager@test.com')
ORDER BY email;
