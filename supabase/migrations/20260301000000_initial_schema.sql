-- Migration initiale — Schéma BRIEF (aligné avec database.types.ts)
-- Exécuter dans Supabase SQL Editor si le schéma n'existe pas encore

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'manager', 'superviseur', 'employe');
CREATE TYPE user_privilege AS ENUM ('create_user', 'send_back', 'view_responses');
CREATE TYPE form_type AS ENUM ('daily', 'urgent');
CREATE TYPE submission_status AS ENUM ('submitted', 'sent_back', 'corrected');
CREATE TYPE notification_type AS ENUM ('urgent', 'sent_back', 'info');

-- Zones
CREATE TABLE zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Localités (localities = localites BRIEF)
CREATE TABLE localities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  zone_id UUID NOT NULL REFERENCES zones(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(name, zone_id)
);

-- Utilisateurs (après auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  email TEXT,
  zone_id UUID REFERENCES zones(id),
  locality_id UUID REFERENCES localities(id),
  role user_role NOT NULL,
  supervisor_id UUID REFERENCES users(id),
  must_change_password BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Privilèges
CREATE TABLE user_privileges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  privilege user_privilege NOT NULL,
  granted_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, privilege)
);

-- Formulaires
CREATE TABLE forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type form_type NOT NULL,
  fields JSONB NOT NULL DEFAULT '[]',
  assigned_to JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Soumissions
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  submitted_by UUID NOT NULL REFERENCES users(id),
  submitted_at TIMESTAMPTZ DEFAULT now(),
  status submission_status DEFAULT 'submitted',
  version INT DEFAULT 1,
  sent_back_by UUID REFERENCES users(id),
  sent_back_at TIMESTAMPTZ,
  sent_back_note TEXT
);

-- Lignes de réponses (géoloc V2 nullable)
CREATE TABLE submission_rows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  row_data JSONB NOT NULL DEFAULT '{}',
  row_index INT NOT NULL,
  photo_urls JSONB DEFAULT '[]',
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  accuracy DECIMAL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Historique corrections
CREATE TABLE submission_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  version INT NOT NULL,
  rows_snapshot JSONB NOT NULL,
  changed_at TIMESTAMPTZ DEFAULT now(),
  changed_by UUID NOT NULL REFERENCES users(id)
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  submission_id UUID REFERENCES submissions(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE localities ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_privileges ENABLE ROW LEVEL SECURITY;
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_rows ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies basiques (à affiner selon hiérarchie BRIEF)
CREATE POLICY "zones_select" ON zones FOR SELECT TO authenticated USING (true);
CREATE POLICY "localities_select" ON localities FOR SELECT TO authenticated USING (true);

-- Fonctions RLS helpers (référence database.types)
CREATE OR REPLACE FUNCTION get_my_role() RETURNS user_role AS $$
  SELECT role FROM users WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION has_privilege(p user_privilege) RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_privileges
    WHERE user_id = auth.uid() AND privilege = p
  ) OR get_my_role() IN ('super_admin', 'admin')
  OR (p = 'view_responses' AND get_my_role() = 'manager')
$$ LANGUAGE sql SECURITY DEFINER;
