
-- Table des profils utilisateurs (liée à auth.users de Supabase)
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  governorate TEXT NOT NULL,
  municipality TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('citoyen', 'association', 'societe')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des informations spécifiques aux organisations (associations et sociétés)
CREATE TABLE public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_name TEXT NOT NULL,
  description TEXT,
  social_media_links JSONB,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des services (uniquement pour les sociétés)
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  description TEXT,
  price_tnd DECIMAL(10, 2) NOT NULL CHECK (price_tnd >= 1000),
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des problèmes écologiques signalés
CREATE TABLE public.problems (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  danger_level TEXT NOT NULL CHECK (danger_level IN ('low', 'medium', 'high')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'resolved', 'cancelled')),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des interventions (quand une organisation prend en charge un problème)
CREATE TABLE public.interventions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  problem_id UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id),
  estimated_cost_tnd DECIMAL(10, 2) NOT NULL CHECK (estimated_cost_tnd >= 1000),
  ecolink_fee_tnd DECIMAL(10, 2) NOT NULL,
  total_cost_tnd DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed', 'accepted', 'in-progress', 'completed', 'cancelled')),
  proposed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- Table des paiements
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  intervention_id UUID NOT NULL REFERENCES public.interventions(id) ON DELETE CASCADE,
  payer_id UUID NOT NULL REFERENCES public.profiles(id),
  amount_tnd DECIMAL(10, 2) NOT NULL,
  ecolink_fee_tnd DECIMAL(10, 2) NOT NULL,
  payment_method TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des notifications
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('problem', 'intervention', 'payment', 'system')),
  read BOOLEAN NOT NULL DEFAULT false,
  related_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Fonction pour calculer automatiquement les frais EcoLink (10%)
CREATE OR REPLACE FUNCTION calculate_ecolink_fee(base_amount DECIMAL)
RETURNS DECIMAL AS $$
BEGIN
  RETURN ROUND(base_amount * 0.10, 2);
END;
$$ LANGUAGE plpgsql;

-- Trigger pour calculer automatiquement le coût total avec frais EcoLink
CREATE OR REPLACE FUNCTION update_intervention_totals()
RETURNS TRIGGER AS $$
BEGIN
  NEW.ecolink_fee_tnd := calculate_ecolink_fee(NEW.estimated_cost_tnd);
  NEW.total_cost_tnd := NEW.estimated_cost_tnd + NEW.ecolink_fee_tnd;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER intervention_totals_trigger
  BEFORE INSERT OR UPDATE ON public.interventions
  FOR EACH ROW
  EXECUTE FUNCTION update_intervention_totals();

-- Fonction pour créer automatiquement un profil utilisateur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email, phone, governorate, municipality, user_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'phone', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'governorate', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'municipality', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'user_type', 'citoyen')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer automatiquement un profil quand un utilisateur s'inscrit
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Activation de la sécurité au niveau des lignes (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour la table profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Politiques RLS pour la table organizations
CREATE POLICY "Users can view all organizations" ON public.organizations
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own organization" ON public.organizations
  FOR ALL USING (auth.uid() = user_id);

-- Politiques RLS pour la table services
CREATE POLICY "Users can view all services" ON public.services
  FOR SELECT USING (true);

CREATE POLICY "Organization owners can manage their services" ON public.services
  FOR ALL USING (
    organization_id IN (
      SELECT id FROM public.organizations WHERE user_id = auth.uid()
    )
  );

-- Politiques RLS pour la table problems
CREATE POLICY "Users can view all problems" ON public.problems
  FOR SELECT USING (true);

CREATE POLICY "Users can create problems" ON public.problems
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Problem reporters can update their problems" ON public.problems
  FOR UPDATE USING (auth.uid() = reporter_id);

-- Politiques RLS pour la table interventions
CREATE POLICY "Users can view interventions related to their content" ON public.interventions
  FOR SELECT USING (
    auth.uid() IN (
      SELECT reporter_id FROM public.problems WHERE id = problem_id
      UNION
      SELECT user_id FROM public.organizations WHERE id = organization_id
    )
  );

CREATE POLICY "Organizations can create interventions" ON public.interventions
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT id FROM public.organizations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Organizations can update their interventions" ON public.interventions
  FOR UPDATE USING (
    organization_id IN (
      SELECT id FROM public.organizations WHERE user_id = auth.uid()
    )
  );

-- Politiques RLS pour la table payments
CREATE POLICY "Users can view their own payments" ON public.payments
  FOR SELECT USING (auth.uid() = payer_id);

CREATE POLICY "Users can create payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = payer_id);

-- Politiques RLS pour la table notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Index pour améliorer les performances
CREATE INDEX idx_problems_location ON public.problems USING GIST (ST_Point(location_lng, location_lat));
CREATE INDEX idx_problems_status ON public.problems (status);
CREATE INDEX idx_problems_danger_level ON public.problems (danger_level);
CREATE INDEX idx_interventions_status ON public.interventions (status);
CREATE INDEX idx_notifications_user_read ON public.notifications (user_id, read);
