-- RLS policies pour forms (questionnaires)
-- SELECT : admin/super_admin voient tout ; les autres uniquement si assignés (rôle ou user_ids)
-- INSERT / UPDATE / DELETE : super_admin et admin uniquement

DROP POLICY IF EXISTS "forms_select" ON forms;
DROP POLICY IF EXISTS "forms_insert" ON forms;
DROP POLICY IF EXISTS "forms_update" ON forms;
DROP POLICY IF EXISTS "forms_delete" ON forms;

-- SELECT: admins see all; others only if assigned (role or user_ids)
CREATE POLICY "forms_select"
ON forms FOR SELECT
TO authenticated
USING (
  get_my_role() IN ('super_admin', 'admin')
  OR (
    assigned_to IS NOT NULL
    AND (
      (assigned_to ? 'roles' AND (assigned_to->'roles') @> to_jsonb(get_my_role()::text))
      OR (assigned_to ? 'user_ids' AND (assigned_to->'user_ids') @> to_jsonb(auth.uid()::text))
    )
  )
);

-- INSERT: super_admin and admin only
CREATE POLICY "forms_insert"
ON forms FOR INSERT
TO authenticated
WITH CHECK (get_my_role() IN ('super_admin', 'admin'));

-- UPDATE: super_admin and admin only
CREATE POLICY "forms_update"
ON forms FOR UPDATE
TO authenticated
USING (get_my_role() IN ('super_admin', 'admin'))
WITH CHECK (get_my_role() IN ('super_admin', 'admin'));

-- DELETE: super_admin and admin only
CREATE POLICY "forms_delete"
ON forms FOR DELETE
TO authenticated
USING (get_my_role() IN ('super_admin', 'admin'));
