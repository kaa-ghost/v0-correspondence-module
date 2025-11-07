-- Set admin@test.com user to administrator role
UPDATE users 
SET role = 'admin' 
WHERE email = 'admin@test.com';

-- Verify the update
SELECT email, full_name, role, is_active 
FROM users 
WHERE email = 'admin@test.com';
