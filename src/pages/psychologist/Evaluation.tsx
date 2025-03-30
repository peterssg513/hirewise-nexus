
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, Loader2, ChevronLeft } from 'lucide-react';
import { 
  getEvaluationById
} from '@/services/evaluationService';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import EvaluationForm from '@/components/evaluation/EvaluationForm';
import { useAuth } from '@/contexts/AuthContext';

const Evaluation = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { 
    data: evaluationData, 
    isLoading: isLoadingEvaluation,
    error: evaluationError 
  } = useQuery({
    queryKey: ['evaluation', id],
    queryFn: () => getEvaluationById(id as string),
    enabled: !!id,
  });
  
  if (isLoadingEvaluation) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-psyched-darkBlue" />
          <p className="text-psyched-darkBlue font-medium">Loading evaluation...</p>
        </div>
      </div>
    );
  }
  
  if (evaluationError) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {(evaluationError as Error)?.message || "An error occurred loading the evaluation."}
          </AlertDescription>
        </Alert>
        
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate('/psychologist-dashboard/applications')}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Applications
        </Button>
      </div>
    );
  }
  
  if (!evaluationData?.template || !evaluationData?.evaluation) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Evaluation not found</AlertTitle>
          <AlertDescription>
            The requested evaluation could not be found or you don't have permission to access it.
          </AlertDescription>
        </Alert>
        
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate('/psychologist-dashboard/applications')}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Applications
        </Button>
      </div>
    );
  }
  
  return (
    <div className="max-w-5xl mx-auto p-6">
      <EvaluationForm 
        evaluationId={id as string}
        evaluationData={{
          evaluation: {
            id: evaluationData.evaluation.id,
            status: evaluationData.evaluation.status,
            submitted_at: evaluationData.evaluation.submitted_at || null,
            form_data: evaluationData.evaluation.form_data || {}
          },
          template: evaluationData.template
        }}
      />
    </div>
  );
};

export default Evaluation;
