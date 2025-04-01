
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
import { Plus, ClipboardCheck, Search } from 'lucide-react';
import { SearchFilterBar } from '@/components/district/search/SearchFilterBar';

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
  const [filteredEvaluations, setFilteredEvaluations] = useState<EvaluationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadEvaluations = async () => {
      try {
        setLoading(true);
        const evaluationsData = await fetchEvaluationRequests(districtId);
        setEvaluations(evaluationsData);
        setFilteredEvaluations(evaluationsData);
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
    setFilteredEvaluations([evaluation, ...filteredEvaluations]);
    toast({
      title: 'Success',
      description: 'Evaluation request created successfully.',
    });
  };

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      // If search is empty, show all evaluations
      setFilteredEvaluations(evaluations);
      return;
    }

    // Filter based on search term
    const term = searchTerm.toLowerCase();
    const filtered = evaluations.filter(evaluation => 
      (evaluation.title && evaluation.title.toLowerCase().includes(term)) ||
      (evaluation.description && evaluation.description.toLowerCase().includes(term)) ||
      (evaluation.service_type && evaluation.service_type.toLowerCase().includes(term))
    );
    
    setFilteredEvaluations(filtered);
  };

  const handleFilter = (filterValue: string) => {
    if (filterValue === 'all' || !filterValue) {
      setFilteredEvaluations(evaluations);
      return;
    }

    // Filter by evaluation status
    const filtered = evaluations.filter(evaluation => 
      evaluation.status.toLowerCase() === filterValue.toLowerCase()
    );
    
    setFilteredEvaluations(filtered);
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

      <SearchFilterBar 
        placeholder="Search evaluations..." 
        onSearch={handleSearch}
        onFilter={handleFilter}
        filterOptions={[
          { value: 'all', label: 'All Statuses' },
          { value: 'open', label: 'Open' },
          { value: 'offered', label: 'Offered' },
          { value: 'accepted', label: 'Accepted' },
          { value: 'evaluation in progress', label: 'In Progress' },
          { value: 'closed', label: 'Closed' }
        ]}
      />

      <CreateEvaluationDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        districtId={districtId}
        onEvaluationCreated={handleEvaluationCreated}
      />

      {filteredEvaluations.length === 0 ? (
        evaluations.length === 0 ? (
          <EmptyState
            icon={<ClipboardCheck className="w-12 h-12 mx-auto" />}
            title="No evaluation requests yet"
            description="Create your first evaluation request to get started."
            actionLabel="Create Evaluation"
            onAction={() => setCreateDialogOpen(true)}
          />
        ) : (
          <EmptyState
            icon={<Search className="w-12 h-12 mx-auto" />}
            title="No matching evaluations"
            description="No evaluations match your search criteria. Try adjusting your search."
            actionLabel="Clear Search"
            onAction={() => handleSearch('')}
          />
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvaluations.map((evaluation) => (
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
