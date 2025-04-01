
import React, { useState, useEffect } from 'react';
import { EvaluationsPage } from './evaluations/EvaluationsPage';
import { fetchEvaluationRequests } from '@/services/evaluationRequestService';
import { useToast } from '@/hooks/use-toast';

interface EvaluationsListProps {
  districtId: string;
}

export const EvaluationsList: React.FC<EvaluationsListProps> = ({ districtId }) => {
  const [evaluationCounts, setEvaluationCounts] = useState({
    open: 0,
    offered: 0,
    accepted: 0,
    inProgress: 0,
    closed: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadEvaluationCounts = async () => {
      try {
        setLoading(true);
        const evaluations = await fetchEvaluationRequests(districtId);
        
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
  }, [districtId, toast]);

  return (
    <EvaluationsPage 
      districtId={districtId}
      evaluationCounts={evaluationCounts}
    />
  );
};
