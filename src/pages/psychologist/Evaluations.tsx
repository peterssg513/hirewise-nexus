
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileText, Info, Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Evaluation, fetchAvailableEvaluations, applyForEvaluation } from '@/services/evaluationService';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Evaluations = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [applying, setApplying] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        setLoading(true);
        const data = await fetchAvailableEvaluations();
        setEvaluations(data || []);
      } catch (error: any) {
        console.error('Error fetching evaluations:', error);
        toast({
          title: 'Failed to load evaluations',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluations();
  }, [toast]);

  const handleApply = async (evaluationId: string) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to apply for evaluations',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setApplying(evaluationId);
      await applyForEvaluation(evaluationId);

      toast({
        title: 'Application submitted',
        description: 'Your application has been submitted successfully.',
      });
      
      // Remove the evaluation from the list or mark it as applied
      setEvaluations(prev => prev.filter(e => e.id !== evaluationId));
    } catch (error: any) {
      console.error('Error applying for evaluation:', error);
      toast({
        title: 'Application failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setApplying(null);
    }
  };

  const filteredEvaluations = evaluations.filter(evaluation => 
    evaluation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    evaluation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    evaluation.district_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-psyched-darkBlue" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Evaluations</h1>
          <p className="text-gray-500 mt-1">Browse and apply for evaluation opportunities</p>
        </div>
        
        <div className="mt-4 md:mt-0 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search evaluations..."
              className="pl-8 pr-4 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredEvaluations.length === 0 ? (
        <Card className="bg-slate-50 border-dashed">
          <CardContent className="pt-6 text-center">
            <Info className="h-12 w-12 text-slate-400 mx-auto mb-2" />
            <h3 className="text-lg font-medium text-slate-700 mb-2">No evaluations available</h3>
            <p className="text-slate-500">
              {searchTerm ? 'No evaluations match your search criteria.' : 'There are currently no evaluation opportunities available. Please check back later.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvaluations.map((evaluation) => (
            <Card key={evaluation.id} className="transition-all hover:shadow-md">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{evaluation.title}</CardTitle>
                    <CardDescription>{evaluation.district_name}</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {evaluation.timeframe || 'Flexible'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 mb-4">
                  <div className="flex items-start mb-2">
                    <FileText className="h-4 w-4 mr-2 text-gray-400 mt-1 shrink-0" />
                    <span>
                      {evaluation.description?.substring(0, 100)}
                      {evaluation.description?.length > 100 ? '...' : ''}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {evaluation.skills_required?.map((skill: string, index: number) => (
                      <Badge key={index} variant="outline" className="bg-slate-50">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-psyched-darkBlue hover:bg-psyched-darkBlue/90"
                  onClick={() => handleApply(evaluation.id)}
                  disabled={applying === evaluation.id}
                >
                  {applying === evaluation.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Applying...
                    </>
                  ) : 'Apply'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Evaluations;
