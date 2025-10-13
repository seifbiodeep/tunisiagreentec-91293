import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface OrganizationService {
  id: string;
  name: string;
  description?: string;
  price: string;
  duration?: string;
  category: string;
  impact_level?: 'faible' | 'moyen' | 'fort';
}

export interface Organization {
  id: string;
  name: string;
  type: 'entreprise' | 'association' | 'ong' | 'gouvernemental';
  category: 'environnement' | 'social' | 'economique' | 'gouvernance';
  description?: string;
  city: string;
  region: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo_url?: string;
  rating: number;
  rse_score: number;
  certifications?: string[];
  specialties?: string[];
  availability_status: 'disponible' | 'occupé' | 'en_pause';
  next_available_date?: string;
  years_active: number;
  team_size: number;
  projects_completed: number;
  clients_satisfied: number;
  verified: boolean;
  created_at: string;
  services?: OrganizationService[];
}

export const useOrganizations = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchOrganizations = async () => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('verified', true)
        .order('rating', { ascending: false });

      if (error) throw error;

      // Fetch services for each organization
      const orgsWithServices = await Promise.all(
        (data || []).map(async (org) => {
          const { data: services } = await supabase
            .from('organization_services')
            .select('*')
            .eq('organization_id', org.id);

          return {
            ...org,
            services: services || []
          } as Organization;
        })
      );

      setOrganizations(orgsWithServices);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const createOrganization = async (orgData: Omit<Organization, 'id' | 'created_at' | 'updated_at' | 'verified' | 'rating' | 'rse_score' | 'services'>) => {
    if (!user) throw new Error('User must be authenticated');

    const { data, error } = await supabase
      .from('organizations')
      .insert([{ 
        ...orgData, 
        user_id: user.id,
        verified: false,
        rating: 0,
        rse_score: 0
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const createService = async (orgId: string, serviceData: Omit<OrganizationService, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User must be authenticated');

    const { data, error } = await supabase
      .from('organization_services')
      .insert([{ 
        ...serviceData, 
        organization_id: orgId 
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  return {
    organizations,
    loading,
    createOrganization,
    createService,
    refetch: fetchOrganizations
  };
};
