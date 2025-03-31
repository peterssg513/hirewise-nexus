
// Fix for the EditEvaluationDialog component
const handleSubmit = async (data: EvaluationFormValues) => {
  try {
    setIsSubmitting(true);
    
    // Convert age from string to number if present
    const evaluationData: Partial<EvaluationRequest> = {
      ...data,
      age: data.age ? parseInt(data.age as string, 10) : undefined
    };
    
    const updatedEvaluation = await updateEvaluationRequest(evaluation.id, evaluationData);
    onEvaluationUpdated(updatedEvaluation);
    onOpenChange(false);
  } catch (error) {
    console.error('Failed to update evaluation request:', error);
    toast({
      title: 'Error',
      description: 'Failed to update evaluation request. Please try again.',
      variant: 'destructive',
    });
  } finally {
    setIsSubmitting(false);
  }
};

// And ensure the default value is properly handled
useEffect(() => {
  if (evaluation) {
    reset({
      legal_name: evaluation.legal_name || '',
      date_of_birth: evaluation.date_of_birth || '',
      age: evaluation.age ? evaluation.age.toString() : '',
      grade: evaluation.grade || '',
      school_id: evaluation.school_id || '',
      student_id: evaluation.student_id || '',
      general_education_teacher: evaluation.general_education_teacher || '',
      special_education_teachers: evaluation.special_education_teachers || '',
      parents: evaluation.parents || '',
      other_relevant_info: evaluation.other_relevant_info || '',
      service_type: evaluation.service_type || '',
    });
  }
}, [evaluation, reset]);
