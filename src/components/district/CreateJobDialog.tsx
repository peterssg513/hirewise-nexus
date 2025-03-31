
// Fix for the CreateJobDialog component
const handleSubmit = async (data: JobFormValues) => {
  try {
    setIsSubmitting(true);
    
    // Convert salary from string to number
    const jobData: CreateJobParams = {
      ...data,
      salary: data.salary ? parseFloat(data.salary as string) : undefined,
      district_id: districtId,
      qualifications: qualifications.map(q => q.text),
      documents_required: documentsRequired
    };
    
    const newJob = await createJob(jobData);
    onJobCreated(newJob);
    onOpenChange(false);
    reset();
    setQualifications([{ id: uuidv4(), text: '' }]);
    setDocumentsRequired([]);
  } catch (error) {
    console.error('Failed to create job:', error);
    toast({
      title: 'Error',
      description: 'Failed to create job. Please try again.',
      variant: 'destructive',
    });
  } finally {
    setIsSubmitting(false);
  }
};
