-- Add role column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user' NOT NULL;

-- Update existing users to have USER role
UPDATE users SET role = 'user' WHERE role IS NULL;

-- Create an admin user for testing
INSERT INTO users (email, full_name, password_hash, role, is_active, created_at)
VALUES (
    'admin@system.local',
    'System Administrator',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYfq1K3oYOi', -- password: admin123
    'admin',
    true,
    NOW()
) ON CONFLICT (email) DO UPDATE SET role = 'admin';
