-- Create storage policy to allow authenticated users to upload APK files
CREATE POLICY "Allow authenticated users to upload APK files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'apk-builds'
);

-- Create storage policy to allow public read access to APK files
CREATE POLICY "Allow public read access to APK files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'apk-builds');