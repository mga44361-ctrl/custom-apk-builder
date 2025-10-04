-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create table for APK build requests
CREATE TABLE public.apk_builds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  app_name TEXT NOT NULL,
  package_name TEXT NOT NULL,
  version TEXT NOT NULL,
  domain TEXT NOT NULL,
  port TEXT NOT NULL,
  ui_type TEXT NOT NULL,
  web_url TEXT,
  welcome_text TEXT,
  apk_size TEXT NOT NULL,
  theme TEXT NOT NULL,
  splash_duration TEXT NOT NULL,
  permissions TEXT[] NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  download_url TEXT,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.apk_builds ENABLE ROW LEVEL SECURITY;

-- Users can view their own builds
CREATE POLICY "Users can view own builds"
ON public.apk_builds
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can create their own builds
CREATE POLICY "Users can create builds"
ON public.apk_builds
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own builds
CREATE POLICY "Users can update own builds"
ON public.apk_builds
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_apk_builds_user_id ON public.apk_builds(user_id);
CREATE INDEX idx_apk_builds_status ON public.apk_builds(status);

-- Trigger for updated_at
CREATE TRIGGER update_apk_builds_updated_at
BEFORE UPDATE ON public.apk_builds
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();