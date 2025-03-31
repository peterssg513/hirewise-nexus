
// Fix for the CreateEvaluationDialog component
const handleSubmit = async (data: EvaluationFormValues) => {
  try {
    setIsSubmitting(true);
    
    // Convert age from string to number if present
    const evaluationData: CreateEvaluationRequestParams = {
      ...data,
      age: data.age ? parseInt(data.age as string, 10) : undefined,
      district_id: districtId
    };
    
    const newEvaluation = await createEvaluationRequest(evaluationData);
    onEvaluationCreated(newEvaluation);
    onOpenChange(false);
    reset();
  } catch (error) {
    console.error('Failed to create evaluation request:', error);
    toast({
      title: 'Error',
      description: 'Failed to create evaluation request. Please try again.',
      variant: 'destructive',
    });
  } finally {
    setIsSubmitting(false);
  }
};
