-- RLS zones et localities : INSERT/UPDATE/DELETE réservés à admin et super_admin
-- SELECT reste ouvert à tous les authenticated (formulaires, assignations)

-- Zones : write pour admin et super_admin uniquement
DROP POLICY IF EXISTS "zones_select" ON zones;
CREATE POLICY "zones_select" ON zones FOR SELECT TO authenticated USING (true);

CREATE POLICY "zones_insert" ON zones FOR INSERT TO authenticated
  WITH CHECK (get_my_role() IN ('super_admin', 'admin'));

CREATE POLICY "zones_update" ON zones FOR UPDATE TO authenticated
  USING (get_my_role() IN ('super_admin', 'admin'))
  WITH CHECK (get_my_role() IN ('super_admin', 'admin'));

CREATE POLICY "zones_delete" ON zones FOR DELETE TO authenticated
  USING (get_my_role() IN ('super_admin', 'admin'));

-- Localities : write pour admin et super_admin uniquement
DROP POLICY IF EXISTS "localities_select" ON localities;
CREATE POLICY "localities_select" ON localities FOR SELECT TO authenticated USING (true);

CREATE POLICY "localities_insert" ON localities FOR INSERT TO authenticated
  WITH CHECK (get_my_role() IN ('super_admin', 'admin'));

CREATE POLICY "localities_update" ON localities FOR UPDATE TO authenticated
  USING (get_my_role() IN ('super_admin', 'admin'))
  WITH CHECK (get_my_role() IN ('super_admin', 'admin'));

CREATE POLICY "localities_delete" ON localities FOR DELETE TO authenticated
  USING (get_my_role() IN ('super_admin', 'admin'));
