
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CreateEvaluationDialog } from './CreateEvaluationDialog';
import { EvaluationCard } from './EvaluationCard';
import { getEvaluationRequests } from '@/services/evaluationRequestService';
import { EvaluationRequest } from '@/types/evaluationRequest';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

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
  loading?: boolean;
}

export const EvaluationsPage: React.FC<EvaluationsPageProps> = ({ 
  districtId, 
  evaluationCounts = { open: 0, offered: 0, accepted: 0, inProgress: 0, closed: 0, total: 0 },
  loading = false 
}) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [evaluations, setEvaluations] = useState<EvaluationRequest[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(loading);
  const { toast } = useToast();

  const fetchEvaluations = async () => {
    if (!districtId) return;
    
    try {
      setIsLoading(true);
      const data = await getEvaluationRequests(districtId);
      setEvaluations(data);
    } catch (error) {
      console.error('Error fetching evaluations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load evaluations',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (districtId) {
      fetchEvaluations();
    }
  }, [districtId]);
  
  const handleCreateEvaluation = () => {
    setIsCreateDialogOpen(true);
  };
  
  const handleEvaluationCreated = (newEvaluation: EvaluationRequest) => {
    setEvaluations(prevEvaluations => [newEvaluation, ...prevEvaluations]);
    setIsCreateDialogOpen(false);
  };
  
  const filteredEvaluations = () => {
    switch (activeTab) {
      case 'open':
        return evaluations.filter(e => e.status === 'pending' || e.status === 'Open');
      case 'offered':
        return evaluations.filter(e => e.status === 'active' || e.status === 'Offered');
      case 'accepted':
        return evaluations.filter(e => e.status === 'Accepted');
      case 'inProgress':
        return evaluations.filter(e => e.status === 'Evaluation In Progress');
      case 'closed':
        return evaluations.filter(e => e.status === 'completed' || e.status === 'Closed');
      default:
        return evaluations;
    }
  };
  
  const handleViewDetails = (evaluation: EvaluationRequest) => {
    // To be implemented
    console.log('View details for evaluation:', evaluation);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Evaluation Requests</h2>
        <Button onClick={handleCreateEvaluation}>
          <Plus className="mr-2 h-4 w-4" />
          New Evaluation
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 mb-6">
          <TabsTrigger value="all">All ({evaluationCounts.total})</TabsTrigger>
          <TabsTrigger value="open">Open ({evaluationCounts.open})</TabsTrigger>
          <TabsTrigger value="offered">Offered ({evaluationCounts.offered})</TabsTrigger>
          <TabsTrigger value="accepted">Accepted ({evaluationCounts.accepted})</TabsTrigger>
          <TabsTrigger value="inProgress">In Progress ({evaluationCounts.inProgress})</TabsTrigger>
          <TabsTrigger value="closed">Closed ({evaluationCounts.closed})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="w-full">
          {renderEvaluationsList()}
        </TabsContent>
        <TabsContent value="open" className="w-full">
          {renderEvaluationsList()}
        </TabsContent>
        <TabsContent value="offered" className="w-full">
          {renderEvaluationsList()}
        </TabsContent>
        <TabsContent value="accepted" className="w-full">
          {renderEvaluationsList()}
        </TabsContent>
        <TabsContent value="inProgress" className="w-full">
          {renderEvaluationsList()}
        </TabsContent>
        <TabsContent value="closed" className="w-full">
          {renderEvaluationsList()}
        </TabsContent>
      </Tabs>
      
      <CreateEvaluationDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        districtId={districtId}
        onEvaluationCreated={handleEvaluationCreated}
      />
    </div>
  );
  
  function renderEvaluationsList() {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    
    const evaluationsToShow = filteredEvaluations();
    
    if (evaluationsToShow.length === 0) {
      return (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">No evaluation requests found</p>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {evaluationsToShow.map(evaluation => (
          <EvaluationCard 
            key={evaluation.id} 
            evaluation={evaluation} 
            onViewDetails={() => handleViewDetails(evaluation)}
          />
        ))}
      </div>
    );
  }
};
