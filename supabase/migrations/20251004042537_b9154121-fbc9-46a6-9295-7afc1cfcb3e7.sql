-- Create storage bucket for APK files
INSERT INTO storage.buckets (id, name, public)
VALUES ('apk-builds', 'apk-builds', true)
ON CONFLICT (id) DO NOTHING;