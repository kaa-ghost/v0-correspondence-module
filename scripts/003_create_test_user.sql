-- Create test user with password 'admin123'
-- Password hash is bcrypt hash of 'admin123'
INSERT INTO users (email, full_name, password_hash, is_active)
VALUES (
    'admin@test.com',
    'Test Administrator',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eo3h9N.1bYYe',
    true
)
ON CONFLICT (email) DO NOTHING;

-- Create additional test users
INSERT INTO users (email, full_name, password_hash, is_active)
VALUES (
    'user@test.com',
    'Test User',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eo3h9N.1bYYe',
    true
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (email, full_name, password_hash, is_active)
VALUES (
    'manager@test.com',
    'Test Manager',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5eo3h9N.1bYYe',
    true
)
ON CONFLICT (email) DO NOTHING;
