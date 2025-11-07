-- Add position field to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS position VARCHAR(255);

-- Update existing users with default position
UPDATE users SET position = 'Сотрудник' WHERE position IS NULL;

-- Add comment
COMMENT ON COLUMN users.position IS 'User job position/title';
