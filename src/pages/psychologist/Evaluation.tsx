
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  PencilLine, Save, FileDown, ArrowLeft, CheckCircle, 
  AlertCircle, Loader2, FileUp, RefreshCw, MessageSquarePlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';

interface EvaluationData {
  id: string;
  status: string;
  created_at: string;
  submitted_at: string | null;
  report_url: string | null;
  application: {
    id: string;
    job: {
      id: string;
      title: string;
      district: {
        id: string;
        name: string;
      };
    };
  };
  evaluation_data?: {
    studentInfo?: {
      name?: string;
      dob?: string;
      grade?: string;
      school?: string;
      referralReason?: string;
    };
    assessmentData?: {
      testsAdministered?: string[];
      cognitiveResults?: string;
      academicResults?: string;
      behavioralResults?: string;
      socialEmotionalResults?: string;
    };
    conclusions?: {
      summary?: string;
      diagnosis?: string;
      recommendations?: string;
    };
  };
}

// Define the validation schema for the evaluation form
const evaluationSchema = z.object({
  studentInfo: z.object({
    name: z.string().min(1, "Student name is required"),
    dob: z.string().min(1, "Date of birth is required"),
    grade: z.string().min(1, "Grade level is required"),
    school: z.string().min(1, "School name is required"),
    referralReason: z.string().min(1, "Referral reason is required"),
  }),
  assessmentData: z.object({
    testsAdministered: z.array(z.string()).min(1, "At least one test must be selected"),
    cognitiveResults: z.string().min(1, "Cognitive results are required"),
    academicResults: z.string().min(1, "Academic results are required"),
    behavioralResults: z.string().min(1, "Behavioral results are required"),
    socialEmotionalResults: z.string().min(1, "Social-emotional results are required"),
  }),
  conclusions: z.object({
    summary: z.string().min(1, "Summary is required"),
    diagnosis: z.string().optional(),
    recommendations: z.string().min(1, "Recommendations are required"),
  }),
});

type EvaluationFormValues = z.infer<typeof evaluationSchema>;

// List of common assessment tests
const commonTests = [
  "Wechsler Intelligence Scale for Children (WISC)",
  "Woodcock-Johnson Tests of Achievement",
  "Behavior Assessment System for Children (BASC)",
  "Conners Rating Scales",
  "Vineland Adaptive Behavior Scales",
  "Test of Nonverbal Intelligence (TONI)",
  "Kaufman Assessment Battery for Children (KABC)",
  "Test of Visual-Motor Integration (VMI)",
  "Children's Depression Inventory (CDI)",
  "Multidimensional Anxiety Scale for Children (MASC)",
];

const Evaluation = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [savedData, setSavedData] = useState<Partial<EvaluationFormValues> | null>(null);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [customTest, setCustomTest] = useState('');
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [aiPrompt, setAIPrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [section, setSection] = useState('studentInfo');
  
  // Form setup
  const form = useForm<EvaluationFormValues>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: {
      studentInfo: {
        name: '',
        dob: '',
        grade: '',
        school: '',
        referralReason: '',
      },
      assessmentData: {
        testsAdministered: [],
        cognitiveResults: '',
        academicResults: '',
        behavioralResults: '',
        socialEmotionalResults: '',
      },
      conclusions: {
        summary: '',
        diagnosis: '',
        recommendations: '',
      },
    },
  });
  
  // Fetch evaluation data
  const { data: evaluation, isLoading, error } = useQuery({
    queryKey: ['evaluation', id],
    queryFn: async () => {
      if (!id) throw new Error("Evaluation ID is required");
      
      const { data, error } = await supabase
        .from('evaluations')
        .select(`
          id, 
          status, 
          created_at, 
          submitted_at, 
          report_url,
          evaluation_data,
          application:applications(
            id,
            job:jobs(
              id, 
              title,
              district:districts(
                id, 
                name
              )
            )
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as EvaluationData;
    },
    enabled: !!id && !!user,
  });
  
  // Update the form when evaluation data is loaded
  useEffect(() => {
    if (evaluation?.evaluation_data) {
      const data = evaluation.evaluation_data;
      
      form.reset({
        studentInfo: {
          name: data.studentInfo?.name || '',
          dob: data.studentInfo?.dob || '',
          grade: data.studentInfo?.grade || '',
          school: data.studentInfo?.school || '',
          referralReason: data.studentInfo?.referralReason || '',
        },
        assessmentData: {
          testsAdministered: data.assessmentData?.testsAdministered || [],
          cognitiveResults: data.assessmentData?.cognitiveResults || '',
          academicResults: data.assessmentData?.academicResults || '',
          behavioralResults: data.assessmentData?.behavioralResults || '',
          socialEmotionalResults: data.assessmentData?.socialEmotionalResults || '',
        },
        conclusions: {
          summary: data.conclusions?.summary || '',
          diagnosis: data.conclusions?.diagnosis || '',
          recommendations: data.conclusions?.recommendations || '',
        },
      });
      
      if (data.assessmentData?.testsAdministered) {
        setSelectedTests(data.assessmentData.testsAdministered);
      }
    }
  }, [evaluation, form]);
  
  // Handle test selection/deselection
  const toggleTest = (test: string) => {
    if (selectedTests.includes(test)) {
      setSelectedTests(selectedTests.filter(t => t !== test));
      form.setValue('assessmentData.testsAdministered', 
        selectedTests.filter(t => t !== test));
    } else {
      const newTests = [...selectedTests, test];
      setSelectedTests(newTests);
      form.setValue('assessmentData.testsAdministered', newTests);
    }
  };
  
  // Add custom test
  const addCustomTest = () => {
    if (customTest.trim()) {
      const newTests = [...selectedTests, customTest.trim()];
      setSelectedTests(newTests);
      form.setValue('assessmentData.testsAdministered', newTests);
      setCustomTest('');
    }
  };
  
  // Save draft mutation
  const saveDraft = useMutation({
    mutationFn: async (formData: Partial<EvaluationFormValues>) => {
      if (!id) throw new Error("Evaluation ID is required");
      
      const { error } = await supabase
        .from('evaluations')
        .update({
          evaluation_data: formData,
          status: 'in_progress',
        })
        .eq('id', id);
      
      if (error) throw error;
      
      return formData;
    },
    onSuccess: (data) => {
      setSavedData(data);
      queryClient.invalidateQueries({ queryKey: ['evaluation', id] });
      toast({
        title: "Draft saved",
        description: "Your evaluation draft has been saved",
      });
    },
    onError: (error) => {
      toast({
        title: "Error saving draft",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    },
  });
  
  // Submit evaluation mutation
  const submitEvaluation = useMutation({
    mutationFn: async (formData: EvaluationFormValues) => {
      if (!id) throw new Error("Evaluation ID is required");
      
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('evaluations')
        .update({
          evaluation_data: formData,
          status: 'submitted',
          submitted_at: new Date().toISOString(),
        })
        .eq('id', id);
      
      if (error) throw error;
      
      return formData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluation', id] });
      toast({
        title: "Evaluation submitted",
        description: "Your evaluation has been successfully submitted",
      });
      navigate('/psychologist-dashboard/applications');
    },
    onError: (error) => {
      toast({
        title: "Error submitting evaluation",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });
  
  // AI-assisted report generation (simulated)
  const generateWithAI = async (prompt: string, section: string) => {
    try {
      setIsAIGenerating(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate content based on the section
      let generatedContent = '';
      
      if (section === 'cognitiveResults') {
        generatedContent = 
          "Based on the cognitive assessment results, the student demonstrates average to above-average intellectual functioning (FSIQ = 112, 79th percentile). Particular strengths were noted in verbal comprehension (VCI = 118, 88th percentile) and visual spatial reasoning (VSI = 115, 84th percentile). Processing speed was in the average range (PSI = 104, 61st percentile), while working memory was slightly lower but still within the average range (WMI = 100, 50th percentile). These results suggest that the student has strong reasoning abilities but may benefit from additional support with tasks requiring sustained attention and memory.";
      } else if (section === 'academicResults') {
        generatedContent = 
          "Academic achievement testing indicates performance consistent with grade-level expectations in most areas. Reading skills are well-developed (Standard Score = 115, 84th percentile), with particularly strong reading comprehension. Mathematics performance was in the average range (Standard Score = 105, 63rd percentile), with relative strength in mathematical reasoning and relative weakness in calculation fluency. Written expression was slightly below grade level expectations (Standard Score = 95, 37th percentile), with difficulties noted in organization of ideas and writing mechanics. Overall, the student demonstrates adequate academic skills with specific needs in written expression.";
      } else if (section === 'behavioralResults') {
        generatedContent = 
          "Behavioral assessment using the BASC-3 indicates elevated scores in the areas of attention problems (T-score = 68, 97th percentile) and hyperactivity (T-score = 65, 93rd percentile), both falling in the At-Risk range. Parent and teacher ratings were consistent in these domains. Social skills and adaptive functioning were rated in the average range. Classroom observations revealed frequent off-task behavior, difficulty sustaining attention during independent work, and occasional impulsive responses. The student responded well to redirection and performed better in structured, small-group settings with clear expectations.";
      } else if (section === 'socialEmotionalResults') {
        generatedContent = 
          "Social-emotional assessment reveals generally positive adjustment with some areas of concern. Self-report measures indicate moderately elevated anxiety (T-score = 63, 90th percentile). The student reports occasional worries about academic performance and social acceptance. Parent and teacher reports indicate appropriate social skills but note that the student can become frustrated when faced with challenging tasks. The student maintains several positive peer relationships and demonstrates empathy toward others. No significant concerns were noted regarding mood, although the student sometimes appears discouraged after academic difficulties.";
      } else if (section === 'summary') {
        generatedContent = 
          "This comprehensive psychoeducational evaluation was conducted to address concerns regarding academic performance and attention. Results indicate average to above-average cognitive abilities with relative strengths in verbal and visual-spatial reasoning. Academic skills are generally at grade level, with specific challenges in written expression. Behavioral assessment reveals significant difficulties with attention and impulse control that impact classroom performance. The student demonstrates age-appropriate social skills and emotional functioning, though moderate anxiety was reported. The pattern of strengths and weaknesses observed across multiple assessment domains is consistent with Attention-Deficit/Hyperactivity Disorder, Predominantly Inattentive Presentation, which is interfering with the student's ability to consistently demonstrate their strong cognitive potential in the classroom setting.";
      } else if (section === 'recommendations') {
        generatedContent = 
          "Based on the evaluation results, the following recommendations are provided:\n\n1. The student qualifies for special education services under the Other Health Impairment (OHI) category due to attention difficulties that adversely affect educational performance.\n\n2. Classroom accommodations should include preferential seating, breaking assignments into smaller segments, providing visual schedules, and allowing for movement breaks.\n\n3. Direct instruction in writing strategies, including organization, planning, and self-monitoring of written work.\n\n4. Implementation of a behavior management system with positive reinforcement for on-task behavior and work completion.\n\n5. Consider a 504 Plan that includes extended time for assignments and tests, reduced homework load, and use of technology for writing tasks.\n\n6. Consultation with the student's pediatrician regarding the evaluation results and possible medical intervention for attention difficulties.\n\n7. Re-evaluation in three years to monitor progress and adjust interventions as needed.";
      }
      
      // Update the form with generated content
      form.setValue(section as any, generatedContent);
      
      toast({
        title: "AI content generated",
        description: "Content has been generated based on your prompt",
      });
    } catch (error) {
      console.error('Error generating AI content:', error);
      toast({
        title: "Error generating content",
        description: "An error occurred while generating content",
        variant: "destructive",
      });
    } finally {
      setIsAIGenerating(false);
      setAIPrompt('');
    }
  };
  
  // Handle save draft
  const handleSaveDraft = () => {
    const formData = form.getValues();
    saveDraft.mutate(formData);
  };
  
  // Handle form submission
  const onSubmit = (data: EvaluationFormValues) => {
    submitEvaluation.mutate(data);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-psyched-darkBlue"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-500">Error loading evaluation</h3>
          <p className="text-muted-foreground">{(error as Error).message}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate('/psychologist-dashboard/applications')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Applications
          </Button>
        </div>
      </div>
    );
  }
  
  if (!evaluation) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-bold text-red-500">Evaluation not found</h2>
        <p className="text-muted-foreground mt-2">Unable to load the evaluation information</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate('/psychologist-dashboard/applications')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Return to Applications
        </Button>
      </div>
    );
  }
  
  // Calculate if form is complete for each section
  const getCompletionStatus = () => {
    const studentInfoComplete = Object.values(form.getValues().studentInfo).every(Boolean);
    
    const assessmentDataComplete = 
      form.getValues().assessmentData.testsAdministered.length > 0 &&
      form.getValues().assessmentData.cognitiveResults &&
      form.getValues().assessmentData.academicResults &&
      form.getValues().assessmentData.behavioralResults &&
      form.getValues().assessmentData.socialEmotionalResults;
    
    const conclusionsComplete = 
      form.getValues().conclusions.summary &&
      form.getValues().conclusions.recommendations;
    
    return {
      studentInfo: studentInfoComplete,
      assessmentData: assessmentDataComplete,
      conclusions: conclusionsComplete,
      overall: studentInfoComplete && assessmentDataComplete && conclusionsComplete
    };
  };
  
  const completionStatus = getCompletionStatus();
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  return (
    <div className="space-y-6 pb-8">
      {/* Header with navigation */}
      <div>
        <Button 
          variant="outline" 
          className="mb-4"
          onClick={() => navigate('/psychologist-dashboard/applications')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Applications
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Psychological Evaluation</h1>
            <p className="text-muted-foreground">
              {evaluation.application.job.title} - {evaluation.application.job.district.name}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
              Status: 
              <span className={
                evaluation.status === 'submitted' ? 'text-green-600' : 
                evaluation.status === 'in_progress' ? 'text-amber-600' : 
                'text-blue-600'
              }>
                {evaluation.status === 'submitted' ? 'Submitted' : 
                 evaluation.status === 'in_progress' ? 'In Progress' : 
                 'Not Started'}
              </span>
            </Badge>
            
            <Badge variant="outline" className="px-3 py-1">
              Created: {formatDate(evaluation.created_at)}
            </Badge>
            
            {evaluation.submitted_at && (
              <Badge variant="outline" className="px-3 py-1">
                Submitted: {formatDate(evaluation.submitted_at)}
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      {/* Evaluation form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs 
            defaultValue="studentInfo" 
            value={section}
            onValueChange={setSection}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="studentInfo" className="relative">
                Student Information
                {completionStatus.studentInfo && (
                  <CheckCircle className="h-3 w-3 text-green-500 absolute top-1 right-1" />
                )}
              </TabsTrigger>
              <TabsTrigger value="assessmentData" className="relative">
                Assessment Data
                {completionStatus.assessmentData && (
                  <CheckCircle className="h-3 w-3 text-green-500 absolute top-1 right-1" />
                )}
              </TabsTrigger>
              <TabsTrigger value="conclusions" className="relative">
                Conclusions & Recommendations
                {completionStatus.conclusions && (
                  <CheckCircle className="h-3 w-3 text-green-500 absolute top-1 right-1" />
                )}
              </TabsTrigger>
            </TabsList>
            
            {/* Student Information Section */}
            <TabsContent value="studentInfo">
              <Card>
                <CardHeader>
                  <CardTitle>Student Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="studentInfo.name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Student Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="studentInfo.dob"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="studentInfo.grade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grade Level</FormLabel>
                          <FormControl>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select grade level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Preschool">Preschool</SelectItem>
                                <SelectItem value="Kindergarten">Kindergarten</SelectItem>
                                <SelectItem value="1st Grade">1st Grade</SelectItem>
                                <SelectItem value="2nd Grade">2nd Grade</SelectItem>
                                <SelectItem value="3rd Grade">3rd Grade</SelectItem>
                                <SelectItem value="4th Grade">4th Grade</SelectItem>
                                <SelectItem value="5th Grade">5th Grade</SelectItem>
                                <SelectItem value="6th Grade">6th Grade</SelectItem>
                                <SelectItem value="7th Grade">7th Grade</SelectItem>
                                <SelectItem value="8th Grade">8th Grade</SelectItem>
                                <SelectItem value="9th Grade">9th Grade</SelectItem>
                                <SelectItem value="10th Grade">10th Grade</SelectItem>
                                <SelectItem value="11th Grade">11th Grade</SelectItem>
                                <SelectItem value="12th Grade">12th Grade</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="studentInfo.school"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>School Name</FormLabel>
                          <FormControl>
                            <Input placeholder="School name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="studentInfo.referralReason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Referral Reason</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the reason for referral" 
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={handleSaveDraft}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setSection('assessmentData')}
                    className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90"
                  >
                    Next: Assessment Data
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Assessment Data Section */}
            <TabsContent value="assessmentData">
              <Card>
                <CardHeader>
                  <CardTitle>Assessment Data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <FormItem>
                      <FormLabel>Tests Administered</FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                        {commonTests.map(test => (
                          <div key={test} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={test}
                              checked={selectedTests.includes(test)}
                              onChange={() => toggleTest(test)}
                              className="rounded border-gray-300 text-psyched-darkBlue focus:ring-psyched-darkBlue"
                            />
                            <Label htmlFor={test}>{test}</Label>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input 
                          value={customTest}
                          onChange={(e) => setCustomTest(e.target.value)}
                          placeholder="Add other test"
                          className="flex-1"
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={addCustomTest}
                          disabled={!customTest.trim()}
                        >
                          Add
                        </Button>
                      </div>
                      <div className="mt-2">
                        {selectedTests.length > 0 ? (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedTests
                              .filter(test => !commonTests.includes(test))
                              .map(test => (
                                <Badge 
                                  key={test} 
                                  variant="secondary"
                                  className="pl-2 pr-1 py-1 flex items-center gap-1"
                                >
                                  {test}
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-4 w-4 rounded-full"
                                    onClick={() => toggleTest(test)}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M18 6L6 18"></path>
                                      <path d="M6 6L18 18"></path>
                                    </svg>
                                  </Button>
                                </Badge>
                              ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No tests selected</p>
                        )}
                      </div>
                      <FormMessage>
                        {form.formState.errors.assessmentData?.testsAdministered?.message}
                      </FormMessage>
                    </FormItem>
                    
                    <Separator />
                    
                    <FormField
                      control={form.control}
                      name="assessmentData.cognitiveResults"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-between items-center">
                            <FormLabel>Cognitive Assessment Results</FormLabel>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <PencilLine className="h-4 w-4 mr-1" />
                                  <span className="text-xs">AI Assist</span>
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Generate Cognitive Results with AI</DialogTitle>
                                  <DialogDescription>
                                    Enter a prompt describing the student's cognitive assessment results.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <Textarea
                                    placeholder="Describe the key cognitive assessment findings (e.g., 'WISC-V results show above average verbal comprehension but below average processing speed')"
                                    className="min-h-[100px]"
                                    value={aiPrompt}
                                    onChange={(e) => setAIPrompt(e.target.value)}
                                  />
                                </div>
                                <DialogFooter>
                                  <Button 
                                    type="button"
                                    onClick={() => generateWithAI(aiPrompt, 'cognitiveResults')}
                                    disabled={isAIGenerating || !aiPrompt.trim()}
                                    className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90"
                                  >
                                    {isAIGenerating ? (
                                      <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating...
                                      </>
                                    ) : (
                                      <>
                                        <MessageSquarePlus className="mr-2 h-4 w-4" />
                                        Generate Content
                                      </>
                                    )}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter cognitive assessment results" 
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="assessmentData.academicResults"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-between items-center">
                            <FormLabel>Academic Assessment Results</FormLabel>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <PencilLine className="h-4 w-4 mr-1" />
                                  <span className="text-xs">AI Assist</span>
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Generate Academic Results with AI</DialogTitle>
                                  <DialogDescription>
                                    Enter a prompt describing the student's academic assessment results.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <Textarea
                                    placeholder="Describe the key academic assessment findings (e.g., 'Reading at grade level but math skills below grade level benchmarks')"
                                    className="min-h-[100px]"
                                    value={aiPrompt}
                                    onChange={(e) => setAIPrompt(e.target.value)}
                                  />
                                </div>
                                <DialogFooter>
                                  <Button 
                                    type="button"
                                    onClick={() => generateWithAI(aiPrompt, 'academicResults')}
                                    disabled={isAIGenerating || !aiPrompt.trim()}
                                    className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90"
                                  >
                                    {isAIGenerating ? (
                                      <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating...
                                      </>
                                    ) : (
                                      <>
                                        <MessageSquarePlus className="mr-2 h-4 w-4" />
                                        Generate Content
                                      </>
                                    )}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter academic assessment results" 
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="assessmentData.behavioralResults"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-between items-center">
                            <FormLabel>Behavioral Assessment Results</FormLabel>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <PencilLine className="h-4 w-4 mr-1" />
                                  <span className="text-xs">AI Assist</span>
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Generate Behavioral Results with AI</DialogTitle>
                                  <DialogDescription>
                                    Enter a prompt describing the student's behavioral assessment results.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <Textarea
                                    placeholder="Describe the behavioral assessment findings (e.g., 'BASC-3 results indicate elevated hyperactivity and attention problems')"
                                    className="min-h-[100px]"
                                    value={aiPrompt}
                                    onChange={(e) => setAIPrompt(e.target.value)}
                                  />
                                </div>
                                <DialogFooter>
                                  <Button 
                                    type="button"
                                    onClick={() => generateWithAI(aiPrompt, 'behavioralResults')}
                                    disabled={isAIGenerating || !aiPrompt.trim()}
                                    className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90"
                                  >
                                    {isAIGenerating ? (
                                      <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating...
                                      </>
                                    ) : (
                                      <>
                                        <MessageSquarePlus className="mr-2 h-4 w-4" />
                                        Generate Content
                                      </>
                                    )}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter behavioral assessment results" 
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="assessmentData.socialEmotionalResults"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-between items-center">
                            <FormLabel>Social-Emotional Assessment Results</FormLabel>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <PencilLine className="h-4 w-4 mr-1" />
                                  <span className="text-xs">AI Assist</span>
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Generate Social-Emotional Results with AI</DialogTitle>
                                  <DialogDescription>
                                    Enter a prompt describing the student's social-emotional assessment results.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <Textarea
                                    placeholder="Describe the social-emotional assessment findings (e.g., 'Elevated anxiety scores but normal range for depression')"
                                    className="min-h-[100px]"
                                    value={aiPrompt}
                                    onChange={(e) => setAIPrompt(e.target.value)}
                                  />
                                </div>
                                <DialogFooter>
                                  <Button 
                                    type="button"
                                    onClick={() => generateWithAI(aiPrompt, 'socialEmotionalResults')}
                                    disabled={isAIGenerating || !aiPrompt.trim()}
                                    className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90"
                                  >
                                    {isAIGenerating ? (
                                      <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating...
                                      </>
                                    ) : (
                                      <>
                                        <MessageSquarePlus className="mr-2 h-4 w-4" />
                                        Generate Content
                                      </>
                                    )}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter social-emotional assessment results" 
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setSection('studentInfo')}
                    >
                      Previous
                    </Button>
                    <Button type="button" variant="outline" onClick={handleSaveDraft}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Draft
                    </Button>
                  </div>
                  <Button 
                    type="button" 
                    onClick={() => setSection('conclusions')}
                    className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90"
                  >
                    Next: Conclusions
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Conclusions Section */}
            <TabsContent value="conclusions">
              <Card>
                <CardHeader>
                  <CardTitle>Conclusions & Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="conclusions.summary"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center">
                          <FormLabel>Summary of Findings</FormLabel>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <PencilLine className="h-4 w-4 mr-1" />
                                <span className="text-xs">AI Assist</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Generate Summary with AI</DialogTitle>
                                <DialogDescription>
                                  Enter a prompt to summarize the evaluation findings.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <Textarea
                                  placeholder="Briefly describe the key findings to summarize (e.g., 'Student shows cognitive strengths but struggles with attention and has academic difficulties in math')"
                                  className="min-h-[100px]"
                                  value={aiPrompt}
                                  onChange={(e) => setAIPrompt(e.target.value)}
                                />
                              </div>
                              <DialogFooter>
                                <Button 
                                  type="button"
                                  onClick={() => generateWithAI(aiPrompt, 'summary')}
                                  disabled={isAIGenerating || !aiPrompt.trim()}
                                  className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90"
                                >
                                  {isAIGenerating ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Generating...
                                    </>
                                  ) : (
                                    <>
                                      <MessageSquarePlus className="mr-2 h-4 w-4" />
                                      Generate Content
                                    </>
                                  )}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                        <FormControl>
                          <Textarea 
                            placeholder="Summarize the key findings of the evaluation" 
                            className="min-h-[150px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="conclusions.diagnosis"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Diagnosis (if applicable)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter any applicable diagnoses" 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          This field is optional if no diagnosis is made
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="conclusions.recommendations"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center">
                          <FormLabel>Recommendations</FormLabel>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <PencilLine className="h-4 w-4 mr-1" />
                                <span className="text-xs">AI Assist</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Generate Recommendations with AI</DialogTitle>
                                <DialogDescription>
                                  Enter a prompt to generate appropriate recommendations.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <Textarea
                                  placeholder="Describe the student's needs for recommendations (e.g., 'Student with ADHD and reading difficulties who would benefit from classroom accommodations')"
                                  className="min-h-[100px]"
                                  value={aiPrompt}
                                  onChange={(e) => setAIPrompt(e.target.value)}
                                />
                              </div>
                              <DialogFooter>
                                <Button 
                                  type="button"
                                  onClick={() => generateWithAI(aiPrompt, 'recommendations')}
                                  disabled={isAIGenerating || !aiPrompt.trim()}
                                  className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90"
                                >
                                  {isAIGenerating ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Generating...
                                    </>
                                  ) : (
                                    <>
                                      <MessageSquarePlus className="mr-2 h-4 w-4" />
                                      Generate Content
                                    </>
                                  )}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter recommendations for interventions and support" 
                            className="min-h-[150px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setSection('assessmentData')}
                    >
                      Previous
                    </Button>
                    <Button type="button" variant="outline" onClick={handleSaveDraft}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Draft
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const pdf = new Blob(['PDF content would go here'], { type: 'application/pdf' });
                        const url = URL.createObjectURL(pdf);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'evaluation_draft.pdf';
                        document.body.appendChild(a);
                        a.click();
                        URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                      }}
                    >
                      <FileDown className="w-4 h-4 mr-2" />
                      Download Draft
                    </Button>
                    
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || !completionStatus.overall}
                      className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <FileUp className="w-4 h-4 mr-2" />
                          Submit Evaluation
                        </>
                      )}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
      
      {/* Form completion status */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Evaluation Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {completionStatus.studentInfo ? (
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500 mr-2" />
                )}
                <span>Student Information</span>
              </div>
              <Badge variant={completionStatus.studentInfo ? "default" : "outline"} className={completionStatus.studentInfo ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}>
                {completionStatus.studentInfo ? "Complete" : "Incomplete"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {completionStatus.assessmentData ? (
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500 mr-2" />
                )}
                <span>Assessment Data</span>
              </div>
              <Badge variant={completionStatus.assessmentData ? "default" : "outline"} className={completionStatus.assessmentData ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}>
                {completionStatus.assessmentData ? "Complete" : "Incomplete"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {completionStatus.conclusions ? (
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500 mr-2" />
                )}
                <span>Conclusions & Recommendations</span>
              </div>
              <Badge variant={completionStatus.conclusions ? "default" : "outline"} className={completionStatus.conclusions ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}>
                {completionStatus.conclusions ? "Complete" : "Incomplete"}
              </Badge>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {completionStatus.overall ? (
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                ) : (
                  <RefreshCw className="w-4 h-4 text-blue-500 mr-2" />
                )}
                <span className="font-medium">Overall Status</span>
              </div>
              <Badge variant={completionStatus.overall ? "default" : "outline"} className={completionStatus.overall ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-blue-100 text-blue-800 hover:bg-blue-100"}>
                {completionStatus.overall ? "Ready to Submit" : "In Progress"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Evaluation;
