
import React, { useState, useEffect } from 'react';
import { EvaluationRequest, fetchEvaluationRequests, SERVICE_TYPES } from '@/services/evaluationRequestService';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Edit, Plus, FileText, Clock, Calendar, School, User } from 'lucide-react';
import { CreateEvaluationDialog } from './CreateEvaluationDialog';
import { EditEvaluationDialog } from './EditEvaluationDialog';
import { fetchSchoolById } from '@/services/schoolService';
import { fetchStudentById } from '@/services/studentService';
import { Badge } from '@/components/ui/badge';

interface EvaluationsListProps {
  districtId: string;
}

export const EvaluationsList: React.FC<EvaluationsListProps> = ({ districtId }) => {
  const [evaluations, setEvaluations] = useState<EvaluationRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [editingEvaluation, setEditingEvaluation] = useState<EvaluationRequest | null>(null);
  const [schoolNames, setSchoolNames] = useState<{ [key: string]: string }>({});
  const [studentNames, setStudentNames] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  useEffect(() => {
    loadEvaluations();
  }, [districtId]);

  const loadEvaluations = async () => {
    try {
      setLoading(true);
      const evaluationsData = await fetchEvaluationRequests(districtId);
      setEvaluations(evaluationsData);
      
      // Load school names
      const schoolIds = Array.from(new Set(evaluationsData.filter(e => e.school_id).map(e => e.school_id)));
      const schoolNamesMap: { [key: string]: string } = {};
      
      await Promise.all(schoolIds.map(async (schoolId) => {
        if (!schoolId) return;
        const school = await fetchSchoolById(schoolId);
        if (school) {
          schoolNamesMap[schoolId] = school.name;
        }
      }));
      
      setSchoolNames(schoolNamesMap);
      
      // Load student names
      const studentIds = Array.from(new Set(evaluationsData.filter(e => e.student_id).map(e => e.student_id)));
      const studentNamesMap: { [key: string]: string } = {};
      
      await Promise.all(studentIds.map(async (studentId) => {
        if (!studentId) return;
        const student = await fetchStudentById(studentId);
        if (student) {
          studentNamesMap[studentId] = `${student.first_name} ${student.last_name}`;
        }
      }));
      
      setStudentNames(studentNamesMap);
      
    } catch (error) {
      console.error('Failed to load evaluations:', error);
      toast({
        title: 'Error loading evaluations',
        description: 'Failed to load evaluation requests. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluationCreated = (newEvaluation: EvaluationRequest) => {
    setEvaluations(prev => [...prev, newEvaluation]);
    toast({
      title: 'Evaluation created',
      description: 'The evaluation request has been created successfully.',
    });
    loadEvaluations(); // Reload to get updated data with names
  };

  const handleEvaluationUpdated = (updatedEvaluation: EvaluationRequest) => {
    // Fix: Renamed 'eval' to 'evaluation' to avoid reserved keyword
    setEvaluations(prev => prev.map(evaluation => 
      evaluation.id === updatedEvaluation.id ? updatedEvaluation : evaluation
    ));
    toast({
      title: 'Evaluation updated',
      description: 'The evaluation request has been updated successfully.',
    });
    loadEvaluations(); // Reload to get updated data with names
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200">
            <Clock className="h-3.5 w-3.5 mr-1" />
            Pending
          </Badge>
        );
      case 'assigned':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">
            <User className="h-3.5 w-3.5 mr-1" />
            Assigned
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">
            <Clock className="h-3.5 w-3.5 mr-1" />
            Completed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">{status}</Badge>
        );
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Evaluation Requests</h2>
        <Button 
          onClick={() => setCreateDialogOpen(true)}
          className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90"
        >
          <Plus className="mr-2 h-4 w-4" /> Create Evaluation
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin h-8 w-8 border-4 border-psyched-darkBlue border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {evaluations.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No evaluation requests</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new evaluation request.</p>
              <div className="mt-6">
                <Button
                  onClick={() => setCreateDialogOpen(true)}
                  className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90"
                >
                  <Plus className="mr-2 h-4 w-4" /> Create Evaluation
                </Button>
              </div>
            </div>
          ) : (
            evaluations.map((evaluation) => (
              <Card key={evaluation.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">
                      {evaluation.student_id && studentNames[evaluation.student_id] 
                        ? studentNames[evaluation.student_id] 
                        : evaluation.legal_name || 'Unnamed Student'}
                    </CardTitle>
                    {getStatusBadge(evaluation.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 pb-2">
                  {evaluation.service_type && (
                    <div className="text-sm">
                      <span className="font-medium">Service Type:</span> {evaluation.service_type}
                    </div>
                  )}
                  
                  {evaluation.grade && (
                    <div className="text-sm">
                      <span className="font-medium">Grade:</span> {evaluation.grade}
                    </div>
                  )}
                  
                  {evaluation.school_id && schoolNames[evaluation.school_id] && (
                    <div className="flex items-center text-sm">
                      <School className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{schoolNames[evaluation.school_id]}</span>
                    </div>
                  )}
                  
                  {evaluation.created_at && (
                    <div className="flex items-center text-xs text-gray-500 mt-2">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>Created: {new Date(evaluation.created_at).toLocaleDateString()}</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-auto"
                    onClick={() => setEditingEvaluation(evaluation)}
                  >
                    <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}

      <CreateEvaluationDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        districtId={districtId}
        onEvaluationCreated={handleEvaluationCreated}
      />

      {editingEvaluation && (
        <EditEvaluationDialog
          open={!!editingEvaluation}
          onOpenChange={(isOpen) => !isOpen && setEditingEvaluation(null)}
          evaluation={editingEvaluation}
          onEvaluationUpdated={handleEvaluationUpdated}
        />
      )}
    </>
  );
};
