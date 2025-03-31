
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useApprovedPsychologists = () => {
  const [approvedPsychologists, setApprovedPsychologists] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApprovedPsychologists = async () => {
    try {
      setLoading(true);
      
      // First, get all approved psychologists
      const { data: psychologistsData, error: psychError } = await supabase
        .from('psychologists')
        .select('*')
        .eq('status', 'approved');
        
      if (psychError) throw psychError;
      
      // Then, for each psychologist, get their profile information
      const enhancedData = await Promise.all(
        psychologistsData.map(async (psych) => {
          // Get profile data for this psychologist
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', psych.user_id)
            .maybeSingle();
            
          if (profileError) {
            console.error('Error fetching profile for psychologist:', profileError);
            // Return psychologist with empty profile
            return {
              ...psych,
              profile: {
                name: 'Unnamed Psychologist',
                email: 'No email provided',
                id: psych.user_id
              }
            };
          }
          
          // Return psychologist with profile data
          return {
            ...psych,
            profile: profileData ? {
              name: profileData.name || 'Unnamed Psychologist',
              email: profileData.email || 'No email provided',
              id: profileData.id
            } : {
              name: 'Unnamed Psychologist',
              email: 'No email provided',
              id: psych.user_id
            }
          };
        })
      );
      
      return enhancedData || [];
    } catch (error) {
      console.error('Error fetching approved psychologists:', error);
      toast({
        title: 'Failed to load psychologists',
        variant: 'destructive'
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadPsychologists = async () => {
      const data = await fetchApprovedPsychologists();
      setApprovedPsychologists(data);
    };
    
    loadPsychologists();
    
    // Set up realtime subscription for updates
    const channel = supabase
      .channel('approved-psychologists-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'psychologists',
          filter: 'status=eq.approved'
        }, 
        () => {
          loadPsychologists();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    approvedPsychologists,
    loading,
    refreshPsychologists: fetchApprovedPsychologists
  };
};
