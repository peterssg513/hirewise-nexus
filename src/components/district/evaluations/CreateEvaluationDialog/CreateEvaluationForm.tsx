
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { EvaluationRequest, createEvaluationRequest, EvaluationRequestStatus } from '@/services/evaluationRequestService';
import { StudentSection } from './sections/StudentSection';
import { SchoolSection } from './sections/SchoolSection';
import { ServiceSection } from './sections/ServiceSection';
import { AdditionalInfoSection } from './sections/AdditionalInfoSection';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { evaluationFormSchema, EvaluationFormValues } from './schema';
import { Form } from '@/components/ui/form';
import { useQuery } from '@tanstack/react-query';
import { fetchSchoolById } from '@/services/schoolService';

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
  
  // Log district ID for debugging
  console.log("CreateEvaluationForm - Initialized with district ID:", districtId);
  
  const form = useForm<EvaluationFormValues>({
    resolver: zodResolver(evaluationFormSchema),
    defaultValues: {
      legal_name: '',
      age: '',
      grade: '',
      district_id: districtId,
      school_id: '',
      other_relevant_info: '',
      service_type: '',
      status: 'pending' as EvaluationRequestStatus,
      state: '',
      payment_amount: '',
      title: '',
      description: '',
      location: '',
      timeframe: '',
      skills_required: [],
    },
  });

  // Watch for school_id changes to update location information
  const selectedSchoolId = form.watch('school_id');
  
  const { data: schoolData } = useQuery({
    queryKey: ['school', selectedSchoolId],
    queryFn: () => fetchSchoolById(selectedSchoolId),
    enabled: !!selectedSchoolId && selectedSchoolId !== '',
  });

  // Update location info when school changes
  useEffect(() => {
    if (schoolData) {
      console.log("Selected school data:", schoolData);
      form.setValue('state', schoolData.state || '');
      
      // Update location with city/state information
      const locationParts = [];
      if (schoolData.city) locationParts.push(schoolData.city);
      if (schoolData.state) locationParts.push(schoolData.state);
      const locationString = locationParts.join(', ');
      
      if (locationString) {
        form.setValue('location', locationString);
      }
    }
  }, [schoolData, form]);

  // Log debug information
  useEffect(() => {
    console.log("CreateEvaluationForm - District ID:", districtId);
  }, [districtId]);

  // Prepare evaluation data for submission
  const prepareEvaluationData = (data: EvaluationFormValues): Partial<EvaluationRequest> => {
    // Convert age from string to number if present
    return {
      ...data,
      age: data.age ? parseInt(data.age, 10) : undefined,
      district_id: districtId,
      title: data.legal_name ? `Evaluation for ${data.legal_name}` : `New ${data.service_type || 'Evaluation'}`,
      description: data.other_relevant_info || `${data.service_type || 'Evaluation'} request`,
      skills_required: data.skills_required || [],
      location: data.location || (data.state || ''),
      timeframe: data.timeframe || '',
      status: 'pending' as EvaluationRequestStatus 
    };
  };

  const onSubmit = async (data: EvaluationFormValues) => {
    try {
      setIsSubmitting(true);
      
      const evaluationData = prepareEvaluationData(data);
      console.log("Submitting evaluation data:", evaluationData);
      
      const newEvaluation = await createEvaluationRequest(evaluationData);
      console.log("Created evaluation:", newEvaluation);
      
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
      description: 'Evaluation request created and pending admin approval',
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <StudentSection form={form} />
        <SchoolSection form={form} districtId={districtId} />
        <ServiceSection form={form} />
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
    </Form>
  );
};
