
import React, { useState, useEffect } from 'react';
import DistrictNavigation from '@/components/district/DistrictNavigation';
import { EvaluationsPage } from '@/components/district/evaluations/EvaluationsPage';
import { useAuth } from '@/contexts/AuthContext';
import { fetchEvaluationRequests } from '@/services/evaluationRequestService';
import { useToast } from '@/hooks/use-toast';

const DistrictEvaluations = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [evaluationCounts, setEvaluationCounts] = useState({
    open: 0,
    offered: 0,
    accepted: 0,
    inProgress: 0,
    closed: 0,
    total: 0
  });

  useEffect(() => {
    const loadEvaluationCounts = async () => {
      if (!profile?.id) return;
      
      try {
        setLoading(true);
        const evaluations = await fetchEvaluationRequests(profile.id);
        
        // Count evaluations by status
        const counts = {
          open: evaluations.filter(e => e.status === 'pending' || e.status === 'Open').length,
          offered: evaluations.filter(e => e.status === 'active' || e.status === 'Offered').length,
          accepted: evaluations.filter(e => e.status === 'Accepted').length,
          inProgress: evaluations.filter(e => e.status === 'Evaluation In Progress').length,
          closed: evaluations.filter(e => e.status === 'completed' || e.status === 'Closed').length,
          total: evaluations.length
        };
        
        setEvaluationCounts(counts);
      } catch (error) {
        console.error('Error loading evaluation counts:', error);
        toast({
          title: 'Error',
          description: 'Failed to load evaluation data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadEvaluationCounts();
  }, [profile?.id, toast]);

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
