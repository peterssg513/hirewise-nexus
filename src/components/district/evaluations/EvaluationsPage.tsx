import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EvaluationCard } from './EvaluationCard';
import { CreateEvaluationDialog } from './CreateEvaluationDialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchEvaluationRequests, EvaluationRequest } from '@/services/evaluationRequestService';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
interface EvaluationsPageProps {
  districtId: string;
  evaluationCounts: {
    open: number;
    offered: number;
    accepted: number;
    inProgress: number;
    closed: number;
    total: number;
  };
  loading?: boolean;
}
export const EvaluationsPage: React.FC<EvaluationsPageProps> = ({
  districtId,
  evaluationCounts,
  loading: initialLoading = false
}) => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const {
    data: evaluations,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['districtEvaluations', districtId],
    queryFn: () => fetchEvaluationRequests(districtId),
    initialData: []
  });

  // Filter evaluations based on the active tab
  const filteredEvaluations = evaluations.filter((evaluation: EvaluationRequest) => {
    switch (activeTab) {
      case 'open':
        return evaluation.status === 'pending' || evaluation.status === 'Open';
      case 'offered':
        return evaluation.status === 'active' || evaluation.status === 'Offered';
      case 'accepted':
        return evaluation.status === 'Accepted';
      case 'inProgress':
        return evaluation.status === 'Evaluation In Progress';
      case 'closed':
        return evaluation.status === 'completed' || evaluation.status === 'Closed';
      default:
        return true;
    }
  });
  const handleEvaluationCreated = () => {
    refetch();
  };
  const handleCreateEvaluation = () => {
    setCreateDialogOpen(true);
  };
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Evaluation Requests</h2>
        <Button onClick={() => setCreateDialogOpen(true)} className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90 text-slate-50">
          <PlusCircle className="mr-1 h-5 w-5" />
          New Evaluation
        </Button>
      </div>
      
      <Tabs defaultValue="all" onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="all">
            All ({evaluationCounts.total})
          </TabsTrigger>
          <TabsTrigger value="open">
            Open ({evaluationCounts.open})
          </TabsTrigger>
          <TabsTrigger value="offered">
            Offered ({evaluationCounts.offered})
          </TabsTrigger>
          <TabsTrigger value="accepted">
            Accepted ({evaluationCounts.accepted})
          </TabsTrigger>
          <TabsTrigger value="inProgress">
            In Progress ({evaluationCounts.inProgress})
          </TabsTrigger>
          <TabsTrigger value="closed">
            Closed ({evaluationCounts.closed})
          </TabsTrigger>
        </TabsList>
        
        {/* Shared content for all tabs */}
        <TabsContent value={activeTab} className="space-y-4">
          {isLoading || initialLoading ? <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div> : filteredEvaluations.length === 0 ? <EmptyState title="No evaluations found" description={`No evaluation requests match the current filter.`} actionLabel="Create New Evaluation" onAction={handleCreateEvaluation} /> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEvaluations.map((evaluation: EvaluationRequest) => <EvaluationCard key={evaluation.id} evaluation={evaluation} />)}
            </div>}
        </TabsContent>
      </Tabs>

      <CreateEvaluationDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} districtId={districtId} onEvaluationCreated={handleEvaluationCreated} />
    </div>;
};