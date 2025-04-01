
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { EvaluationRequest, createEvaluationRequest, EvaluationRequestStatus } from '@/services/evaluationRequestService';
import { StudentSection } from './sections/StudentSection';
import { SchoolSection } from './sections/SchoolSection';
import { ServiceSection } from './sections/ServiceSection';
import { ContactSection } from './sections/ContactSection';
import { AdditionalInfoSection } from './sections/AdditionalInfoSection';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { evaluationFormSchema, EvaluationFormValues } from './schema';

export interface CreateEvaluationFormProps {
  districtId: string;
  onEvaluationCreated: (evaluation: EvaluationRequest) => void;
  onOpenChange: (open: boolean) => void;
}

export const CreateEvaluationForm: React.FC<CreateEvaluationFormProps> = ({ 
  districtId, 
  onEvaluationCreated,
  onOpenChange
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<EvaluationFormValues>({
    resolver: zodResolver(evaluationFormSchema),
    defaultValues: {
      legal_name: '',
      date_of_birth: '',
      age: '',
      grade: '',
      district_id: districtId,
      school_id: '',
      student_id: '',
      general_education_teacher: '',
      special_education_teachers: '',
      parents: '',
      other_relevant_info: '',
      service_type: '',
      status: 'Open' as EvaluationRequestStatus,
      state: '',
      payment_amount: '',
      title: '',
      description: '',
      location: '',
      timeframe: '',
      skills_required: [],
    },
  });

  // Prepare evaluation data for submission
  const prepareEvaluationData = (data: EvaluationFormValues) => {
    // Convert age from string to number if present
    return {
      ...data,
      age: data.age ? parseInt(data.age, 10) : undefined,
      district_id: districtId,
      title: data.legal_name ? `Evaluation for ${data.legal_name}` : `New ${data.service_type || 'Evaluation'}`,
      description: data.other_relevant_info || `${data.service_type || 'Evaluation'} request`,
      skills_required: data.skills_required || [],
      location: data.state || '',
      timeframe: data.date_of_birth ? `DOB: ${data.date_of_birth}` : '',
      status: (data.status as EvaluationRequestStatus) || 'Open'
    };
  };

  const onSubmit = async (data: EvaluationFormValues) => {
    try {
      setIsSubmitting(true);
      
      const evaluationData = prepareEvaluationData(data);
      const newEvaluation = await createEvaluationRequest(evaluationData);
      
      // Handle successful submission
      handleSuccessfulSubmission(newEvaluation);
    } catch (error: any) {
      // Handle errors
      handleSubmissionError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessfulSubmission = (evaluation: EvaluationRequest) => {
    onEvaluationCreated(evaluation);
    onOpenChange(false);
    form.reset();
    toast({
      title: 'Success',
      description: 'Evaluation request created successfully',
    });
  };

  const handleSubmissionError = (error: any) => {
    console.error('Failed to create evaluation request:', error);
    toast({
      title: 'Error',
      description: error.message || 'Failed to create evaluation request',
      variant: 'destructive'
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <StudentSection form={form} />
      <SchoolSection form={form} districtId={districtId} />
      <ServiceSection form={form} />
      <ContactSection form={form} />
      <AdditionalInfoSection form={form} />
      
      <div className="flex justify-end pt-4">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Evaluation'
          )}
        </Button>
      </div>
    </form>
  );
};
