import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Save, 
  SendHorizonal, 
  AlertTriangle, 
  CheckCircle, 
  ChevronLeft, 
  Loader2 
} from 'lucide-react';
import { 
  getEvaluationById, 
  getEvaluationTemplate, 
  saveEvaluationData,
  submitEvaluation,
  EvaluationFormField,
  EvaluationTemplate,
  EvaluationFormData,
  checkColumnExists
} from '@/services/evaluationService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

const Evaluation = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    data: evaluationData, 
    isLoading: isLoadingEvaluation,
    error: evaluationError 
  } = useQuery({
    queryKey: ['evaluation', id],
    queryFn: () => getEvaluationById(id as string),
    enabled: !!id,
  });
  
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
    if (!id) return;
    
    try {
      setIsSaving(true);
      await saveEvaluationData(id, formData);
      
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
    if (!id) return;
    
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
      await submitEvaluation(id, formData as EvaluationFormData);
      
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
  
  const renderField = (field: EvaluationFormField) => {
    const { id: fieldId, type, label, required, placeholder, options } = field;
    
    switch (type) {
      case 'text':
        return (
          <div className="space-y-2" key={fieldId}>
            <Label htmlFor={fieldId}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={fieldId}
              value={formData[fieldId] || ''}
              onChange={(e) => handleFieldChange(fieldId, e.target.value)}
              placeholder={placeholder}
            />
          </div>
        );
      
      case 'textarea':
        return (
          <div className="space-y-2" key={fieldId}>
            <Label htmlFor={fieldId}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={fieldId}
              value={formData[fieldId] || ''}
              onChange={(e) => handleFieldChange(fieldId, e.target.value)}
              placeholder={placeholder}
              rows={5}
            />
          </div>
        );
      
      case 'select':
        return (
          <div className="space-y-2" key={fieldId}>
            <Label htmlFor={fieldId}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={formData[fieldId] || ''}
              onValueChange={(value) => handleFieldChange(fieldId, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      
      case 'multiselect':
        return (
          <div className="space-y-2" key={fieldId}>
            <Label>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="space-y-2">
              {options?.map((option) => {
                const selected = Array.isArray(formData[fieldId])
                  ? formData[fieldId].includes(option)
                  : false;
                
                return (
                  <div className="flex items-center space-x-2" key={option}>
                    <Checkbox
                      id={`${fieldId}-${option}`}
                      checked={selected}
                      onCheckedChange={(checked) => {
                        const currentValues = Array.isArray(formData[fieldId])
                          ? [...formData[fieldId]]
                          : [];
                        
                        const newValues = checked
                          ? [...currentValues, option]
                          : currentValues.filter(val => val !== option);
                        
                        handleFieldChange(fieldId, newValues);
                      }}
                    />
                    <Label htmlFor={`${fieldId}-${option}`} className="font-normal">
                      {option}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
        );
      
      case 'radio':
        return (
          <div className="space-y-2" key={fieldId}>
            <Label>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <RadioGroup
              value={formData[fieldId] || ''}
              onValueChange={(value) => handleFieldChange(fieldId, value)}
            >
              {options?.map((option) => (
                <div className="flex items-center space-x-2" key={option}>
                  <RadioGroupItem value={option} id={`${fieldId}-${option}`} />
                  <Label htmlFor={`${fieldId}-${option}`} className="font-normal">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2" key={fieldId}>
            <Checkbox
              id={fieldId}
              checked={formData[fieldId] || false}
              onCheckedChange={(checked) => handleFieldChange(fieldId, checked)}
            />
            <Label htmlFor={fieldId} className="font-normal">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
          </div>
        );
      
      case 'date':
        return (
          <div className="space-y-2" key={fieldId}>
            <Label htmlFor={fieldId}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={fieldId}
              type="date"
              value={formData[fieldId] || ''}
              onChange={(e) => handleFieldChange(fieldId, e.target.value)}
            />
          </div>
        );
      
      default:
        return null;
    }
  };
  
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
  
  const status = evaluationData.evaluation.status || 'assigned';
  const submittedAt = evaluationData.evaluation.submitted_at || null;
  
  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{evaluationData.template.name}</h1>
          <p className="text-muted-foreground">{evaluationData.template.description}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate('/psychologist-dashboard/applications')}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <Button
            variant="outline"
            className="gap-2"
            disabled={isSaving || status === 'submitted'}
            onClick={handleSave}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save
          </Button>
          
          <Button
            className="gap-2 bg-psyched-darkBlue hover:bg-psyched-darkBlue/90"
            disabled={isSubmitting || status === 'submitted'}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendHorizonal className="h-4 w-4" />
            )}
            Submit
          </Button>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Badge
            variant={status === 'submitted' ? 'default' : 'outline'}
            className={status === 'submitted' ? 'bg-green-100 text-green-800' : ''}
          >
            {status === 'submitted' ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Submitted
              </>
            ) : (
              'Draft'
            )}
          </Badge>
          
          {submittedAt && (
            <span className="text-sm text-muted-foreground">
              Submitted on {new Date(submittedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
      
      {status === 'submitted' && (
        <Alert className="mb-6">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Evaluation Submitted</AlertTitle>
          <AlertDescription>
            This evaluation has been submitted and cannot be modified.
          </AlertDescription>
        </Alert>
      )}
      
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <ScrollArea className="w-full">
            <TabsList className="flex w-full justify-start p-0 h-auto mb-0 bg-transparent border-b rounded-none">
              {evaluationData.template.sections.map((section) => (
                <TabsTrigger
                  key={section}
                  value={section}
                  className="py-2 px-4 border-b-2 border-transparent data-[state=active]:border-psyched-darkBlue rounded-none"
                >
                  {section}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>
          
          <CardContent className="pt-6">
            {evaluationData.template.sections.map((section) => (
              <TabsContent key={section} value={section} className="m-0">
                <div className="space-y-6">
                  {evaluationData.template.fields
                    .filter(field => field.section === section)
                    .map(field => renderField(field))}
                </div>
              </TabsContent>
            ))}
          </CardContent>
        </Tabs>
      </Card>
      
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => navigate('/psychologist-dashboard/applications')}
        >
          Cancel
        </Button>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2"
            disabled={isSaving || status === 'submitted'}
            onClick={handleSave}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save
          </Button>
          
          <Button
            className="gap-2 bg-psyched-darkBlue hover:bg-psyched-darkBlue/90"
            disabled={isSubmitting || status === 'submitted'}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendHorizonal className="h-4 w-4" />
            )}
            Submit Evaluation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Evaluation;
