
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Problem {
  id: string;
  title: string;
  description: string;
  location: string;
  location_lat?: number;
  location_lng?: number;
  danger_level: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'resolved' | 'cancelled';
  image_url?: string;
  created_at: string;
  updated_at: string;
  reporter_id: string;
}

export const useProblems = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchProblems = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('problems')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProblems(data || []);
    } catch (error) {
      console.error('Error fetching problems:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProblem = async (problemData: Omit<Problem, 'id' | 'created_at' | 'updated_at' | 'reporter_id'>) => {
    if (!user) throw new Error('User must be authenticated');

    const { data, error } = await (supabase as any)
      .from('problems')
      .insert([{ ...problemData, reporter_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  return {
    problems,
    loading,
    createProblem,
    refetch: fetchProblems
  };
};
