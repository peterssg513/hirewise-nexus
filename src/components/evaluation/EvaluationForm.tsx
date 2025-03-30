
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Alert,
  AlertDescription,
  AlertTitle
} from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { 
  saveEvaluationData,
  submitEvaluation
} from '@/services/evaluationService';
import { useToast } from '@/hooks/use-toast';
import { EvaluationTemplate } from '@/types/evaluation';
import EvaluationHeader from './EvaluationHeader';
import EvaluationTabs from './EvaluationTabs';
import EvaluationFormActions from './EvaluationFormActions';

interface EvaluationFormProps {
  evaluationId: string;
  evaluationData: {
    evaluation: {
      id: string;
      status: string;
      submitted_at: string | null;
      form_data?: Record<string, any>;
    };
    template: EvaluationTemplate;
  };
}

const EvaluationForm = ({ evaluationId, evaluationData }: EvaluationFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (evaluationData?.evaluation?.form_data) {
      setFormData(evaluationData.evaluation.form_data);
    }
  }, [evaluationData]);
  
  useEffect(() => {
    if (evaluationData?.template?.sections?.length > 0) {
      setActiveTab(evaluationData.template.sections[0]);
    }
  }, [evaluationData]);
  
  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };
  
  const handleSave = async () => {
    if (!evaluationId) return;
    
    try {
      setIsSaving(true);
      await saveEvaluationData(evaluationId, formData);
      
      toast({
        title: "Progress saved",
        description: "Your evaluation has been saved successfully.",
        duration: 3000,
      });
    } catch (error: any) {
      toast({
        title: "Error saving evaluation",
        description: error.message || "An error occurred while saving your evaluation.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSubmit = async () => {
    if (!evaluationId) return;
    
    const requiredFields = evaluationData?.template?.fields.filter(field => field.required) || [];
    const missingFields = requiredFields.filter(field => !formData[field.id]);
    
    if (missingFields.length > 0) {
      const missingFieldNames = missingFields.map(field => field.label).join(', ');
      
      toast({
        title: "Missing required fields",
        description: `Please fill in the following required fields: ${missingFieldNames}`,
        variant: "destructive",
        duration: 5000,
      });
      
      return;
    }
    
    try {
      setIsSubmitting(true);
      await submitEvaluation(evaluationId, formData);
      
      toast({
        title: "Evaluation submitted",
        description: "Your evaluation has been submitted successfully.",
        duration: 3000,
      });
      
      navigate('/psychologist-dashboard/applications');
    } catch (error: any) {
      toast({
        title: "Error submitting evaluation",
        description: error.message || "An error occurred while submitting your evaluation.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const status = evaluationData.evaluation.status || 'assigned';
  const submittedAt = evaluationData.evaluation.submitted_at || null;
  const isSubmitted = status === 'submitted';
  
  return (
    <>
      <EvaluationHeader 
        template={evaluationData.template}
        status={status}
        submittedAt={submittedAt}
        isSaving={isSaving}
        isSubmitting={isSubmitting}
        onSave={handleSave}
        onSubmit={handleSubmit}
      />
      
      {isSubmitted && (
        <Alert className="mb-6">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Evaluation Submitted</AlertTitle>
          <AlertDescription>
            This evaluation has been submitted and cannot be modified.
          </AlertDescription>
        </Alert>
      )}
      
      <Card>
        <EvaluationTabs
          template={evaluationData.template}
          formData={formData}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          handleFieldChange={handleFieldChange}
          isSubmitted={isSubmitted}
        />
      </Card>
      
      <EvaluationFormActions
        isSubmitted={isSubmitted}
        isSaving={isSaving}
        isSubmitting={isSubmitting}
        onSave={handleSave}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default EvaluationForm;
