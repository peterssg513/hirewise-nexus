
import React, { useState } from 'react';
import DistrictNavigation from '@/components/district/DistrictNavigation';
import { EvaluationsPage } from '@/components/district/evaluations/EvaluationsPage';
import { useAuth } from '@/contexts/AuthContext';
import { fetchEvaluationRequests } from '@/services/evaluationRequestService';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

const DistrictEvaluations = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [evaluationCounts, setEvaluationCounts] = useState({
    open: 0,
    offered: 0,
    accepted: 0,
    inProgress: 0,
    closed: 0,
    total: 0
  });

  // Add logging to see the actual profile ID being used
  console.log("DistrictEvaluations - Profile:", profile);
  
  // Use React Query to handle the data fetching with proper options
  const { data: evaluations = [], isLoading: loading } = useQuery({
    queryKey: ['evaluationRequests', profile?.id],
    queryFn: () => {
      console.log("DistrictEvaluations - Fetching evaluations for profile ID:", profile?.id);
      return fetchEvaluationRequests(profile?.id || '');
    },
    enabled: !!profile?.id,
    meta: {
      onSuccess: (data) => {
        // Count evaluations by status
        const counts = {
          open: data.filter(e => e.status === 'pending' || e.status === 'Open').length,
          offered: data.filter(e => e.status === 'active' || e.status === 'Offered').length,
          accepted: data.filter(e => e.status === 'Accepted').length,
          inProgress: data.filter(e => e.status === 'Evaluation In Progress').length,
          closed: data.filter(e => e.status === 'completed' || e.status === 'Closed').length,
          total: data.length
        };
        
        setEvaluationCounts(counts);
        console.log("DistrictEvaluations - Evaluation counts:", counts);
      },
      onError: (error) => {
        console.error('Error loading evaluation counts:', error);
        toast({
          title: 'Error',
          description: 'Failed to load evaluation data',
          variant: 'destructive',
        });
      }
    }
  });

  // Add a useEffect to update counts when data is loaded
  React.useEffect(() => {
    if (evaluations && evaluations.length > 0) {
      const counts = {
        open: evaluations.filter(e => e.status === 'pending' || e.status === 'Open').length,
        offered: evaluations.filter(e => e.status === 'active' || e.status === 'Offered').length,
        accepted: evaluations.filter(e => e.status === 'Accepted').length,
        inProgress: evaluations.filter(e => e.status === 'Evaluation In Progress').length,
        closed: evaluations.filter(e => e.status === 'completed' || e.status === 'Closed').length,
        total: evaluations.length
      };
      
      setEvaluationCounts(counts);
      console.log("DistrictEvaluations - Updated evaluation counts:", counts);
    }
  }, [evaluations]);

  if (!profile?.id) {
    return <div>Loading profile...</div>;
  }

  return (
    <div>
      <DistrictNavigation />
      <div className="mt-4">
        <EvaluationsPage 
          districtId={profile.id} 
          evaluationCounts={evaluationCounts}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default DistrictEvaluations;
