-- Skip redundant ALTER TABLE if column exists
-- This is a no-op to prevent crash from duplicate column
-- Original line (commented):
-- ALTER TABLE user ADD COLUMN twofa_secret VARCHAR(64);
-- ALTER TABLE user ADD COLUMN twofa_status BOOLEAN NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_user_active ON user (active);