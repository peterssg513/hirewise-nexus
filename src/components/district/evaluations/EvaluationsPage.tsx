
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  fetchEvaluationRequests, 
  EvaluationRequest 
} from '@/services/evaluationRequestService';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { CreateEvaluationDialog } from './CreateEvaluationDialog';
import { EvaluationCard } from './EvaluationCard';
import { Plus, ClipboardCheck } from 'lucide-react';

interface EvaluationsPageProps {
  districtId: string;
  evaluationCounts?: {
    open: number;
    offered: number;
    accepted: number;
    inProgress: number;
    closed: number;
    total: number;
  };
}

export const EvaluationsPage: React.FC<EvaluationsPageProps> = ({ 
  districtId,
  evaluationCounts = {
    open: 0,
    offered: 0,
    accepted: 0,
    inProgress: 0,
    closed: 0,
    total: 0
  }
}) => {
  const [evaluations, setEvaluations] = useState<EvaluationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadEvaluations = async () => {
      try {
        setLoading(true);
        const evaluationsData = await fetchEvaluationRequests(districtId);
        setEvaluations(evaluationsData);
      } catch (error) {
        console.error('Failed to load evaluations:', error);
        toast({
          title: 'Error',
          description: 'Failed to load evaluation requests. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadEvaluations();
  }, [districtId, toast]);

  const handleEvaluationCreated = (evaluation: EvaluationRequest) => {
    setEvaluations([evaluation, ...evaluations]);
    toast({
      title: 'Success',
      description: 'Evaluation request created successfully.',
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Evaluation Requests</h2>
        <Button 
          onClick={() => setCreateDialogOpen(true)}
          className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Evaluation
        </Button>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="col-span-5 md:col-span-1 bg-white rounded-lg border p-4 flex flex-col items-center">
          <div className="text-sm text-muted-foreground">Open</div>
          <div className="text-2xl font-bold">{evaluationCounts.open}</div>
        </div>
        <div className="col-span-5 md:col-span-1 bg-white rounded-lg border p-4 flex flex-col items-center">
          <div className="text-sm text-muted-foreground">Offered</div>
          <div className="text-2xl font-bold">{evaluationCounts.offered}</div>
        </div>
        <div className="col-span-5 md:col-span-1 bg-white rounded-lg border p-4 flex flex-col items-center">
          <div className="text-sm text-muted-foreground">Accepted</div>
          <div className="text-2xl font-bold">{evaluationCounts.accepted}</div>
        </div>
        <div className="col-span-5 md:col-span-1 bg-white rounded-lg border p-4 flex flex-col items-center">
          <div className="text-sm text-muted-foreground">In Progress</div>
          <div className="text-2xl font-bold">{evaluationCounts.inProgress}</div>
        </div>
        <div className="col-span-5 md:col-span-1 bg-white rounded-lg border p-4 flex flex-col items-center">
          <div className="text-sm text-muted-foreground">Closed</div>
          <div className="text-2xl font-bold">{evaluationCounts.closed}</div>
        </div>
      </div>

      <CreateEvaluationDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        districtId={districtId}
        onEvaluationCreated={handleEvaluationCreated}
      />

      {evaluations.length === 0 ? (
        <EmptyState
          icon={<ClipboardCheck className="w-12 h-12 mx-auto" />}
          title="No evaluation requests yet"
          description="Create your first evaluation request to get started."
          actionLabel="Create Evaluation"
          onAction={() => setCreateDialogOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {evaluations.map((evaluation) => (
            <EvaluationCard 
              key={evaluation.id} 
              evaluation={evaluation}
            />
          ))}
        </div>
      )}
    </div>
  );
};
