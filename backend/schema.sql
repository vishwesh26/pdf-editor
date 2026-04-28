-- Supabase Database Schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PDF Files Table
CREATE TABLE pdf_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  page_count INTEGER,
  is_editable BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '24 hours')
);

-- Subscriptions Table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan TEXT DEFAULT 'free', -- 'free' | 'pro'
  edits_today INTEGER DEFAULT 0,
  last_reset_date DATE DEFAULT CURRENT_DATE
);

-- RLS Policies
ALTER TABLE pdf_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own files" ON pdf_files
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own files" ON pdf_files
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own files" ON pdf_files
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- RPC for Webhook to securely update user status by email
CREATE OR REPLACE FUNCTION upgrade_user_to_pro_by_email(user_email TEXT)
RETURNS void AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Find the user ID from the auth.users table
  SELECT id INTO target_user_id FROM auth.users WHERE email = user_email LIMIT 1;
  
  IF target_user_id IS NOT NULL THEN
    -- Upsert the subscription record
    INSERT INTO subscriptions (user_id, plan)
    VALUES (target_user_id, 'pro')
    ON CONFLICT (user_id) DO UPDATE SET plan = 'pro';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
