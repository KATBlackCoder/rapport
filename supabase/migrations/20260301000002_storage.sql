-- Bucket Storage "submissions"
-- Créer le bucket via Dashboard : Storage > New bucket > "submissions" (privé)
-- Puis exécuter les policies ci-dessous dans SQL Editor

-- Policy: upload pour utilisateurs authentifiés
DROP POLICY IF EXISTS "submissions_upload" ON storage.objects;
CREATE POLICY "submissions_upload"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'submissions');

-- Policy: lecture pour utilisateurs authentifiés
DROP POLICY IF EXISTS "submissions_select" ON storage.objects;
CREATE POLICY "submissions_select"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'submissions');
