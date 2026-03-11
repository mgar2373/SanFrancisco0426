-- ═══════════════════════════════════════════════════════════
-- SUPABASE SETUP — Mobilitat SF 25-26
-- Executa aquest SQL a: Supabase → SQL Editor → New query
-- ═══════════════════════════════════════════════════════════

-- 1. Taula de perfils d'usuari (s'omple automàticament en registrar-se)
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT,
  name        TEXT,
  approved    BOOLEAN DEFAULT FALSE,
  rejected    BOOLEAN DEFAULT FALSE,
  role        TEXT DEFAULT 'user',   -- 'user' | 'admin'
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Habilitar Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Qualsevol usuari autenticat pot veure tots els perfils (per al panell d'admin)
CREATE POLICY "Llegir perfils" ON public.profiles
  FOR SELECT USING (auth.role() = 'authenticated');

-- Cada usuari pot actualitzar el seu propi perfil (nom, etc.)
CREATE POLICY "Actualitzar propi perfil" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- L'admin pot actualitzar qualsevol perfil (aprovar/rebutjar)
-- Nota: per simplicitat, la inserció/update des del panell d'admin
-- utilitza el service_role_key que bypassa RLS.

-- 3. Funció que crea el perfil automàticament quan un usuari es registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Trigger que executa la funció anterior
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Fes-te admin a tu mateix (substitueix amb el teu email)
-- Executa això DESPRÉS de registrar-te a l'app:
--
-- UPDATE public.profiles
-- SET approved = TRUE, role = 'admin'
-- WHERE email = 'mgar2373@xtec.cat';
