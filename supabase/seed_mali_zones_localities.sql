-- Seed complet zones + localités du Mali
-- À coller dans le SQL Editor de Supabase
-- Remplace toutes les données existantes (Tombouctou au lieu de Timbuktu)

-- 1. Annuler les références des utilisateurs vers zones/localités
UPDATE users SET zone_id = NULL, locality_id = NULL WHERE zone_id IS NOT NULL OR locality_id IS NOT NULL;

-- 2. Supprimer les localités puis les zones
DELETE FROM localities;
DELETE FROM zones;

-- 3. Insérer les 9 zones (8 régions + district Bamako)
INSERT INTO zones (name) VALUES
  ('Bamako'),
  ('Kayes'),
  ('Koulikoro'),
  ('Sikasso'),
  ('Ségou'),
  ('Mopti'),
  ('Tombouctou'),
  ('Gao'),
  ('Kidal')
ON CONFLICT (name) DO NOTHING;

-- 4. Localités par zone (cercles/communes principales)
DO $$
DECLARE
  bamako_id UUID;
  kayes_id UUID;
  koulikoro_id UUID;
  sikasso_id UUID;
  segou_id UUID;
  mopti_id UUID;
  tombouctou_id UUID;
  gao_id UUID;
  kidal_id UUID;
BEGIN
  SELECT id INTO bamako_id FROM zones WHERE name = 'Bamako' LIMIT 1;
  SELECT id INTO kayes_id FROM zones WHERE name = 'Kayes' LIMIT 1;
  SELECT id INTO koulikoro_id FROM zones WHERE name = 'Koulikoro' LIMIT 1;
  SELECT id INTO sikasso_id FROM zones WHERE name = 'Sikasso' LIMIT 1;
  SELECT id INTO segou_id FROM zones WHERE name = 'Ségou' LIMIT 1;
  SELECT id INTO mopti_id FROM zones WHERE name = 'Mopti' LIMIT 1;
  SELECT id INTO tombouctou_id FROM zones WHERE name = 'Tombouctou' LIMIT 1;
  SELECT id INTO gao_id FROM zones WHERE name = 'Gao' LIMIT 1;
  SELECT id INTO kidal_id FROM zones WHERE name = 'Kidal' LIMIT 1;

  -- Bamako (communes + quartiers)
  IF bamako_id IS NOT NULL THEN
    INSERT INTO localities (name, zone_id) VALUES
      ('Commune I', bamako_id), ('Commune II', bamako_id), ('Commune III', bamako_id),
      ('Commune IV', bamako_id), ('Commune V', bamako_id), ('Commune VI', bamako_id),
      ('Lafiabougou', bamako_id), ('Hamdalaye', bamako_id), ('Badalabougou', bamako_id),
      ('Magnambougou', bamako_id), ('Quinzambougou', bamako_id), ('Sotuba', bamako_id),
      ('Banconi', bamako_id), ('Niaréla', bamako_id), ('Médina-Coura', bamako_id),
      ('Hippodrome', bamako_id), ('ACI 2000', bamako_id), ('Hamdallaye ACI', bamako_id),
      ('Bagadadji', bamako_id), ('Bolibana', bamako_id), ('Djelibougou', bamako_id),
      ('Dravela', bamako_id), ('Kalaban Coura', bamako_id), ('Korofina', bamako_id),
      ('Missira', bamako_id), ('Sikoroni', bamako_id)
    ON CONFLICT (name, zone_id) DO NOTHING;
  END IF;

  -- Kayes
  IF kayes_id IS NOT NULL THEN
    INSERT INTO localities (name, zone_id) VALUES
      ('Kayes', kayes_id), ('Bafoulabé', kayes_id), ('Kita', kayes_id),
      ('Kéniéba', kayes_id), ('Nioro du Sahel', kayes_id), ('Bamako-Kayes', kayes_id),
      ('Diéma', kayes_id), ('Nara', kayes_id), ('Yélimané', kayes_id)
    ON CONFLICT (name, zone_id) DO NOTHING;
  END IF;

  -- Koulikoro
  IF koulikoro_id IS NOT NULL THEN
    INSERT INTO localities (name, zone_id) VALUES
      ('Koulikoro', koulikoro_id), ('Banamba', koulikoro_id), ('Dioïla', koulikoro_id),
      ('Kolokani', koulikoro_id), ('Kangaba', koulikoro_id), ('Nara', koulikoro_id),
      ('Kolondiéba', koulikoro_id), ('Koulikoro Centre', koulikoro_id)
    ON CONFLICT (name, zone_id) DO NOTHING;
  END IF;

  -- Sikasso
  IF sikasso_id IS NOT NULL THEN
    INSERT INTO localities (name, zone_id) VALUES
      ('Sikasso', sikasso_id), ('Bougouni', sikasso_id), ('Koutiala', sikasso_id),
      ('Kadiolo', sikasso_id), ('Kolondiéba', sikasso_id), ('Yanfolila', sikasso_id),
      ('Koko', sikasso_id), ('Lobougoula', sikasso_id), ('Sikasso Centre', sikasso_id),
      ('Wayerma', sikasso_id)
    ON CONFLICT (name, zone_id) DO NOTHING;
  END IF;

  -- Ségou
  IF segou_id IS NOT NULL THEN
    INSERT INTO localities (name, zone_id) VALUES
      ('Ségou', segou_id), ('Markala', segou_id), ('Pélengana', segou_id),
      ('Ségou Centre', segou_id), ('Sogoniko', segou_id), ('Bla', segou_id),
      ('Barouéli', segou_id), ('Macina', segou_id), ('Niono', segou_id),
      ('San', segou_id), ('Tominian', segou_id)
    ON CONFLICT (name, zone_id) DO NOTHING;
  END IF;

  -- Mopti
  IF mopti_id IS NOT NULL THEN
    INSERT INTO localities (name, zone_id) VALUES
      ('Mopti', mopti_id), ('Bandiagara', mopti_id), ('Bankass', mopti_id),
      ('Djenne', mopti_id), ('Douentza', mopti_id), ('Koro', mopti_id),
      ('Mopti Centre', mopti_id), ('Tenenkou', mopti_id), ('Youwarou', mopti_id)
    ON CONFLICT (name, zone_id) DO NOTHING;
  END IF;

  -- Tombouctou
  IF tombouctou_id IS NOT NULL THEN
    INSERT INTO localities (name, zone_id) VALUES
      ('Tombouctou', tombouctou_id), ('Goundam', tombouctou_id), ('Gourma-Rharous', tombouctou_id),
      ('Niafunké', tombouctou_id), ('Diré', tombouctou_id), ('Tombouctou Centre', tombouctou_id)
    ON CONFLICT (name, zone_id) DO NOTHING;
  END IF;

  -- Gao
  IF gao_id IS NOT NULL THEN
    INSERT INTO localities (name, zone_id) VALUES
      ('Gao', gao_id), ('Ansongo', gao_id), ('Bourem', gao_id),
      ('Gao Centre', gao_id), ('Ménaka', gao_id), ('Tessalit', gao_id)
    ON CONFLICT (name, zone_id) DO NOTHING;
  END IF;

  -- Kidal
  IF kidal_id IS NOT NULL THEN
    INSERT INTO localities (name, zone_id) VALUES
      ('Kidal', kidal_id), ('Abeïbara', kidal_id), ('Tessalit', kidal_id),
      ('Tin-Essako', kidal_id), ('Kidal Centre', kidal_id)
    ON CONFLICT (name, zone_id) DO NOTHING;
  END IF;
END $$;
