-- Table for system-wide configuration settings
CREATE TABLE IF NOT EXISTS system_config (
  id SERIAL PRIMARY KEY,
  config_type VARCHAR(50) NOT NULL,
  config_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_system_config_type ON system_config (config_type);

-- Table for allowed email domains
CREATE TABLE IF NOT EXISTS allowed_domains (
  id SERIAL PRIMARY KEY,
  domain VARCHAR(255) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Initial SMTP configuration
INSERT INTO system_config (config_type, config_value)
VALUES (
  'smtp', 
  '{"host":"smtp.gmail.com","port":587,"user":"","password":"","from":"noreply@limsathya.com","secure":false,"provider":"gmail"}'
)
ON CONFLICT DO NOTHING;

-- Initial domain configuration
INSERT INTO allowed_domains (domain, is_active, is_primary)
VALUES ('limsathya.com', TRUE, TRUE)
ON CONFLICT DO NOTHING;

