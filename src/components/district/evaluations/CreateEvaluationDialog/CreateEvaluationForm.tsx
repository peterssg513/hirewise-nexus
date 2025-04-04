
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { evaluationFormSchema, EvaluationFormValues } from './schema';
import { createEvaluationRequest } from '@/services/evaluationRequestService';
import { EvaluationRequestStatus } from '@/types/evaluationRequest';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { StudentSection } from './sections/StudentSection';
import { ServiceSection } from './sections/ServiceSection';
import { AdditionalInfoSection } from './sections/AdditionalInfoSection';
import { useNavigate } from 'react-router-dom';

interface CreateEvaluationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CreateEvaluationForm: React.FC<CreateEvaluationFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<EvaluationFormValues>({
    resolver: zodResolver(evaluationFormSchema),
    defaultValues: {
      legal_name: '',
      service_type: '',
      general_education_teacher: '',
      special_education_teachers: '',
      parents: '',
      grade: '',
      date_of_birth: '',
      age: '',
      other_relevant_info: '',
      school_id: '',
      timeframe: '',
      skills_required: []
    },
  });
  
  const onSubmit = async (data: EvaluationFormValues) => {
    if (!profile?.id) {
      toast.error('Authentication error', {
        description: 'You must be logged in to create an evaluation request'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert age to a number if it's a numeric string
      const numericAge = data.age ? 
        (typeof data.age === 'string' && !isNaN(Number(data.age))) ? 
          Number(data.age) : data.age 
        : undefined;
      
      const response = await createEvaluationRequest({
        ...data,
        age: numericAge,
        district_id: profile.id,
        skills_required: data.skills_required || []
      });
      
      if (response) {
        toast.success('Evaluation request created', {
          description: 'Your evaluation request has been submitted for approval'
        });
        
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/district-dashboard/evaluations');
        }
      }
    } catch (error: any) {
      console.error('Error creating evaluation request:', error);
      toast.error('Failed to create evaluation request', {
        description: error.message || 'Please try again later'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <StudentSection form={form} />
        <ServiceSection form={form} />
        <AdditionalInfoSection form={form} />
        
        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Evaluation Request'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
