-- Seed zones et localités maliennes (BRIEF)

INSERT INTO zones (name) VALUES
  ('Bamako'), ('Ségou'), ('Sikasso'), ('Mopti'), ('Kayes'),
  ('Koulikoro'), ('Gao'), ('Tombouctou'), ('Kidal')
ON CONFLICT (name) DO NOTHING;

-- Localités Bamako
DO $$
DECLARE
  bamako_id UUID;
BEGIN
  SELECT id INTO bamako_id FROM zones WHERE name = 'Bamako' LIMIT 1;
  IF bamako_id IS NOT NULL THEN
    INSERT INTO localities (name, zone_id) VALUES
      ('Lafiabougou', bamako_id), ('Hamdalaye', bamako_id), ('Badalabougou', bamako_id),
      ('Magnambougou', bamako_id), ('Quinzambougou', bamako_id), ('Sotuba', bamako_id),
      ('Banconi', bamako_id), ('Niaréla', bamako_id), ('Médina-Coura', bamako_id),
      ('Hippodrome', bamako_id), ('ACI 2000', bamako_id), ('Hamdallaye ACI', bamako_id)
    ON CONFLICT (name, zone_id) DO NOTHING;
  END IF;
END $$;
