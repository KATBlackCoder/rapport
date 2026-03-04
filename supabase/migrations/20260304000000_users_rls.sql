-- RLS users et user_privileges : lecture hiérarchie, création/édition selon privilèges

-- Helper : ordre des rôles (1 = plus haut)
CREATE OR REPLACE FUNCTION role_order(r user_role) RETURNS int AS $$
  SELECT CASE r
    WHEN 'super_admin' THEN 1
    WHEN 'admin' THEN 2
    WHEN 'manager' THEN 3
    WHEN 'superviseur' THEN 4
    WHEN 'employe' THEN 5
    ELSE 0
  END
$$ LANGUAGE sql IMMUTABLE;

-- Helper : peut-on voir cet utilisateur (rôle strictement inférieur) ?
CREATE OR REPLACE FUNCTION can_see_user(target_id UUID) RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = target_id
    AND role_order((SELECT role FROM users WHERE id = auth.uid())) < role_order(u.role)
  ) AND auth.uid() IS NOT NULL
$$ LANGUAGE sql SECURITY DEFINER;

-- Users : SELECT — soi-même ou hiérarchie inférieure
CREATE POLICY "users_select" ON users FOR SELECT TO authenticated
  USING (id = auth.uid() OR can_see_user(id));

-- Users : INSERT — via service role uniquement (création via API serveur)
-- Pas de policy INSERT pour authenticated : la création passe par l'API admin

-- Users : UPDATE — admin/super_admin ou create_user sur cible visible
CREATE POLICY "users_update" ON users FOR UPDATE TO authenticated
  USING (
    get_my_role() IN ('super_admin', 'admin')
    OR (has_privilege('create_user') AND can_see_user(id))
  )
  WITH CHECK (
    get_my_role() IN ('super_admin', 'admin')
    OR (has_privilege('create_user') AND can_see_user(id))
  );

-- Users : pas de DELETE (soft delete via is_active)

-- user_privileges : SELECT — privilèges des utilisateurs qu'on peut voir
CREATE POLICY "user_privileges_select" ON user_privileges FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = user_privileges.user_id
      AND (u.id = auth.uid() OR can_see_user(u.id))
    )
  );

-- user_privileges : INSERT — accorder un privilège qu'on possède à un user visible
CREATE POLICY "user_privileges_insert" ON user_privileges FOR INSERT TO authenticated
  WITH CHECK (
    granted_by = auth.uid()
    AND has_privilege(privilege)
    AND can_see_user(user_id)
  );

-- user_privileges : DELETE — révoquer (celui qui a accordé ou admin)
CREATE POLICY "user_privileges_delete" ON user_privileges FOR DELETE TO authenticated
  USING (
    granted_by = auth.uid()
    OR get_my_role() IN ('super_admin', 'admin')
  );
