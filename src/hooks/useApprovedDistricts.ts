
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useApprovedDistricts = () => {
  const [approvedDistricts, setApprovedDistricts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApprovedDistricts = async () => {
    try {
      setLoading(true);
      
      // First, get all approved districts
      const { data: districtsData, error: districtError } = await supabase
        .from('districts')
        .select('*')
        .eq('status', 'approved');
        
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
      console.error('Error fetching approved districts:', error);
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
      const data = await fetchApprovedDistricts();
      setApprovedDistricts(data);
    };
    
    loadDistricts();
    
    // Set up realtime subscription for updates
    const channel = supabase
      .channel('approved-districts-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'districts',
          filter: 'status=eq.approved'
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

  return {
    approvedDistricts,
    loading,
    refreshDistricts: fetchApprovedDistricts
  };
};
