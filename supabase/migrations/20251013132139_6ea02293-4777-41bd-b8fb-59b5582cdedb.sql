-- Créer la table profiles pour les informations utilisateurs
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS sur profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Politique: Les utilisateurs peuvent voir tous les profils
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Politique: Les utilisateurs peuvent modifier leur propre profil
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Politique: Les utilisateurs peuvent insérer leur propre profil
CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Trigger pour créer un profil automatiquement lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Créer la table problems pour les signalements
CREATE TABLE public.problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  danger_level TEXT NOT NULL CHECK (danger_level IN ('low', 'medium', 'high')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'resolved', 'cancelled')),
  image_url TEXT,
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_org_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS sur problems
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;

-- Politique: Tout le monde peut voir les problèmes
CREATE POLICY "Problems are viewable by everyone" 
ON public.problems 
FOR SELECT 
USING (true);

-- Politique: Utilisateurs authentifiés peuvent créer des problèmes
CREATE POLICY "Authenticated users can create problems" 
ON public.problems 
FOR INSERT 
WITH CHECK (auth.uid() = reporter_id);

-- Politique: Les utilisateurs peuvent modifier leurs propres problèmes
CREATE POLICY "Users can update their own problems" 
ON public.problems 
FOR UPDATE 
USING (auth.uid() = reporter_id);

-- Trigger pour updated_at sur problems
CREATE TRIGGER update_problems_updated_at
  BEFORE UPDATE ON public.problems
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Créer la table organizations pour les organisations RSE
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('entreprise', 'association', 'ong', 'gouvernemental')),
  category TEXT NOT NULL CHECK (category IN ('environnement', 'social', 'economique', 'gouvernance')),
  description TEXT,
  city TEXT NOT NULL,
  region TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  logo_url TEXT,
  rating DECIMAL(2, 1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  rse_score INTEGER DEFAULT 0 CHECK (rse_score >= 0 AND rse_score <= 100),
  certifications TEXT[],
  specialties TEXT[],
  availability_status TEXT DEFAULT 'disponible' CHECK (availability_status IN ('disponible', 'occupé', 'en_pause')),
  next_available_date DATE,
  years_active INTEGER DEFAULT 0,
  team_size INTEGER DEFAULT 0,
  projects_completed INTEGER DEFAULT 0,
  clients_satisfied INTEGER DEFAULT 0,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS sur organizations
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Politique: Tout le monde peut voir les organisations vérifiées
CREATE POLICY "Verified organizations are viewable by everyone" 
ON public.organizations 
FOR SELECT 
USING (verified = true OR auth.uid() = user_id);

-- Politique: Utilisateurs authentifiés peuvent créer des organisations
CREATE POLICY "Authenticated users can create organizations" 
ON public.organizations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Politique: Les utilisateurs peuvent modifier leurs propres organisations
CREATE POLICY "Users can update their own organizations" 
ON public.organizations 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Trigger pour updated_at sur organizations
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Créer la table services pour les services des organisations
CREATE TABLE public.organization_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price TEXT NOT NULL,
  duration TEXT,
  category TEXT NOT NULL,
  impact_level TEXT CHECK (impact_level IN ('faible', 'moyen', 'fort')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS sur organization_services
ALTER TABLE public.organization_services ENABLE ROW LEVEL SECURITY;

-- Politique: Les services sont visibles si l'organisation est visible
CREATE POLICY "Services are viewable based on organization visibility" 
ON public.organization_services 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.organizations 
    WHERE id = organization_id 
    AND (verified = true OR user_id = auth.uid())
  )
);

-- Politique: Les utilisateurs peuvent créer des services pour leurs organisations
CREATE POLICY "Users can create services for their organizations" 
ON public.organization_services 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.organizations 
    WHERE id = organization_id 
    AND user_id = auth.uid()
  )
);

-- Politique: Les utilisateurs peuvent modifier les services de leurs organisations
CREATE POLICY "Users can update services for their organizations" 
ON public.organization_services 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.organizations 
    WHERE id = organization_id 
    AND user_id = auth.uid()
  )
);

-- Politique: Les utilisateurs peuvent supprimer les services de leurs organisations
CREATE POLICY "Users can delete services for their organizations" 
ON public.organization_services 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.organizations 
    WHERE id = organization_id 
    AND user_id = auth.uid()
  )
);

-- Trigger pour updated_at sur organization_services
CREATE TRIGGER update_organization_services_updated_at
  BEFORE UPDATE ON public.organization_services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Créer des index pour améliorer les performances
CREATE INDEX idx_problems_reporter_id ON public.problems(reporter_id);
CREATE INDEX idx_problems_status ON public.problems(status);
CREATE INDEX idx_problems_created_at ON public.problems(created_at DESC);
CREATE INDEX idx_organizations_user_id ON public.organizations(user_id);
CREATE INDEX idx_organizations_verified ON public.organizations(verified);
CREATE INDEX idx_organizations_category ON public.organizations(category);
CREATE INDEX idx_organization_services_org_id ON public.organization_services(organization_id);