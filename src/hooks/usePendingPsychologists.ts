
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const usePendingPsychologists = () => {
  const { profile } = useAuth();
  const [pendingPsychologists, setPendingPsychologists] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingPsychologists = async () => {
    try {
      setLoading(true);
      
      // First, get all pending psychologists
      const { data: psychologistsData, error: psychError } = await supabase
        .from('psychologists')
        .select('*')
        .eq('status', 'pending');
        
      if (psychError) throw psychError;
      
      // Then, for each psychologist, get their profile information
      const enhancedData = await Promise.all(
        psychologistsData.map(async (psych) => {
          // Get profile data for this psychologist
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', psych.user_id)
            .single();
            
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
            profile: {
              name: profileData.name || 'Unnamed Psychologist',
              email: profileData.email || 'No email provided',
              id: profileData.id
            }
          };
        })
      );
      
      console.log('Enhanced psychologist data:', enhancedData);
      return enhancedData || [];
    } catch (error) {
      console.error('Error fetching pending psychologists:', error);
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
      const data = await fetchPendingPsychologists();
      setPendingPsychologists(data);
    };
    
    loadPsychologists();
    
    // Set up realtime subscription for updates
    const channel = supabase
      .channel('admin-psychologists-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'psychologists',
          filter: 'status=eq.pending'
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

  const approvePsychologist = async (id, name) => {
    try {
      const result = await supabase.rpc('approve_psychologist', { psychologist_id: id });
      
      if (result.error) throw result.error;
      
      // Get psychologist user_id for notification
      const { data: psychData } = await supabase
        .from('psychologists')
        .select('user_id')
        .eq('id', id)
        .single();
        
      // Create notification for the user
      if (psychData?.user_id) {
        await supabase.from('notifications').insert({
          user_id: psychData.user_id,
          message: `Your psychologist profile has been approved! You can now apply for jobs and evaluations.`,
          type: 'psychologist_approved',
          related_id: id
        });
      }
      
      toast({
        title: 'Success',
        description: `Psychologist approved successfully`
      });
      
      // Update local state to reflect the approval
      setPendingPsychologists(pendingPsychologists.filter(p => p.id !== id));
      
      // Log this approval action
      await supabase.from('analytics_events').insert({
        event_type: 'psychologist_approved',
        user_id: profile?.id,
        event_data: { 
          entity_id: id,
          entity_name: name,
          timestamp: new Date().toISOString()
        }
      });
      
    } catch (error) {
      console.error(`Error approving psychologist:`, error);
      toast({
        title: `Failed to approve psychologist`,
        variant: 'destructive'
      });
    }
  };

  const rejectPsychologist = async (id, name, reason) => {
    try {
      const result = await supabase
        .from('psychologists')
        .update({ 
          status: 'rejected'
        })
        .eq('id', id);
      
      if (result.error) throw result.error;
      
      // Get psychologist user_id for notification
      const { data: psychData } = await supabase
        .from('psychologists')
        .select('user_id')
        .eq('id', id)
        .single();
        
      // Create notification for the user
      if (psychData?.user_id) {
        await supabase.from('notifications').insert({
          user_id: psychData.user_id,
          message: `Your psychologist profile was not approved. Reason: ${reason}`,
          type: 'psychologist_rejected',
          related_id: id
        });
      }
      
      toast({
        title: 'Rejected',
        description: `Psychologist has been rejected`
      });
      
      // Update local state to reflect the rejection
      setPendingPsychologists(pendingPsychologists.filter(p => p.id !== id));
      
      // Log this rejection action
      await supabase.from('analytics_events').insert({
        event_type: 'psychologist_rejected',
        user_id: profile?.id,
        event_data: { 
          entity_id: id,
          entity_name: name,
          reason: reason,
          timestamp: new Date().toISOString()
        }
      });
      
    } catch (error) {
      console.error(`Error rejecting psychologist:`, error);
      toast({
        title: `Failed to reject psychologist`,
        variant: 'destructive'
      });
    }
  };

  return {
    pendingPsychologists,
    loading,
    approvePsychologist,
    rejectPsychologist,
    refreshPsychologists: fetchPendingPsychologists
  };
};
