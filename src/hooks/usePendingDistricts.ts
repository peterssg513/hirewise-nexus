
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const usePendingDistricts = () => {
  const { profile } = useAuth();
  const [pendingDistricts, setPendingDistricts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingDistricts = async () => {
    try {
      setLoading(true);
      
      // First, get all pending districts
      const { data: districtsData, error: districtError } = await supabase
        .from('districts')
        .select('*')
        .eq('status', 'pending');
        
      if (districtError) throw districtError;
      
      // Then, for each district, get their profile information
      const enhancedData = await Promise.all(
        districtsData.map(async (district) => {
          // Get profile data for this district
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', district.user_id)
            .maybeSingle();
            
          if (profileError) {
            console.error('Error fetching profile for district:', profileError);
            // Return district with empty profile
            return {
              ...district,
              profile: {
                email: 'No email provided',
                id: district.user_id
              }
            };
          }
          
          // Return district with profile data
          return {
            ...district,
            profile: profileData ? {
              email: profileData.email || 'No email provided',
              id: profileData.id
            } : {
              email: 'No email provided',
              id: district.user_id
            }
          };
        })
      );
      
      return enhancedData || [];
    } catch (error) {
      console.error('Error fetching pending districts:', error);
      toast({
        title: 'Failed to load districts',
        variant: 'destructive'
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadDistricts = async () => {
      const data = await fetchPendingDistricts();
      setPendingDistricts(data);
    };
    
    loadDistricts();
    
    // Set up realtime subscription for updates
    const channel = supabase
      .channel('pending-districts-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'districts',
          filter: 'status=eq.pending'
        }, 
        () => {
          loadDistricts();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const approveDistrict = async (id, name) => {
    try {
      const result = await supabase.rpc('approve_district', { district_id: id });
      
      if (result.error) throw result.error;
      
      // Get district user_id for notification
      const { data: districtData } = await supabase
        .from('districts')
        .select('user_id')
        .eq('id', id)
        .single();
        
      // Create notification for the user
      if (districtData?.user_id) {
        await supabase.from('notifications').insert({
          user_id: districtData.user_id,
          message: `Your district has been approved! You can now post jobs and request evaluations.`,
          type: 'district_approved',
          related_id: id
        });
      }
      
      toast({
        title: 'Success',
        description: `District approved successfully`
      });
      
      // Update local state to reflect the approval
      setPendingDistricts(pendingDistricts.filter(d => d.id !== id));
      
      // Log this approval action
      await supabase.from('analytics_events').insert({
        event_type: 'district_approved',
        user_id: profile?.id,
        event_data: { 
          entity_id: id,
          entity_name: name,
          timestamp: new Date().toISOString()
        }
      });
      
    } catch (error) {
      console.error(`Error approving district:`, error);
      toast({
        title: `Failed to approve district`,
        variant: 'destructive'
      });
    }
  };

  const rejectDistrict = async (id, name, reason) => {
    try {
      const result = await supabase
        .from('districts')
        .update({ 
          status: 'rejected'
        })
        .eq('id', id);
      
      if (result.error) throw result.error;
      
      // Get district user_id for notification
      const { data: districtData } = await supabase
        .from('districts')
        .select('user_id')
        .eq('id', id)
        .single();
        
      // Create notification for the user
      if (districtData?.user_id) {
        await supabase.from('notifications').insert({
          user_id: districtData.user_id,
          message: `Your district registration was not approved. Reason: ${reason}`,
          type: 'district_rejected',
          related_id: id
        });
      }
      
      toast({
        title: 'Rejected',
        description: `District has been rejected`
      });
      
      // Update local state to reflect the rejection
      setPendingDistricts(pendingDistricts.filter(d => d.id !== id));
      
      // Log this rejection action
      await supabase.from('analytics_events').insert({
        event_type: 'district_rejected',
        user_id: profile?.id,
        event_data: { 
          entity_id: id,
          entity_name: name,
          reason: reason,
          timestamp: new Date().toISOString()
        }
      });
      
    } catch (error) {
      console.error(`Error rejecting district:`, error);
      toast({
        title: `Failed to reject district`,
        variant: 'destructive'
      });
    }
  };

  return {
    pendingDistricts,
    loading,
    approveDistrict,
    rejectDistrict,
    refreshDistricts: fetchPendingDistricts
  };
};
