import React, { useState, useEffect } from 'react';
import { 
  EvaluationRequest, 
  fetchEvaluationRequests, 
  deleteEvaluationRequest 
} from '@/services/evaluationManagementService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, Calendar, School, User, Book, Users, Edit, Plus, Trash, 
  CheckCircle, Clock, AlertCircle, File, Eye 
} from 'lucide-react';
import { CreateEvaluationDialog } from './CreateEvaluationDialog';
import { EditEvaluationDialog } from './EditEvaluationDialog';
import { SearchFilterBar } from './SearchFilterBar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface EvaluationsListProps {
  districtId: string;
}

export const EvaluationsList: React.FC<EvaluationsListProps> = ({ districtId }) => {
  const [evaluations, setEvaluations] = useState<EvaluationRequest[]>([]);
  const [filteredEvaluations, setFilteredEvaluations] = useState<EvaluationRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [editingEvaluation, setEditingEvaluation] = useState<EvaluationRequest | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [evaluationToDelete, setEvaluationToDelete] = useState<EvaluationRequest | null>(null);
  const [selectedEvaluation, setSelectedEvaluation] = useState<EvaluationRequest | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadEvaluations();
  }, [districtId]);

  useEffect(() => {
    setFilteredEvaluations(evaluations);
  }, [evaluations]);

  const loadEvaluations = async () => {
    try {
      setLoading(true);
      const evaluationsData = await fetchEvaluationRequests(districtId);
      setEvaluations(evaluationsData);
    } catch (error) {
      console.error('Failed to load evaluations:', error);
      toast({
        title: 'Error loading evaluations',
        description: 'Failed to load evaluations. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluationCreated = (newEvaluation: EvaluationRequest) => {
    setEvaluations(prev => [newEvaluation, ...prev]);
    toast({
      title: 'Evaluation request created',
      description: `Evaluation request for ${newEvaluation.legal_name || 'student'} has been created successfully.`,
    });
  };

  const handleEvaluationUpdated = (updatedEvaluation: EvaluationRequest) => {
    setEvaluations(prev => prev.map(evaluation => 
      evaluation.id === updatedEvaluation.id ? updatedEvaluation : evaluation
    ));
    toast({
      title: 'Evaluation request updated',
      description: `Evaluation request for ${updatedEvaluation.legal_name || 'student'} has been updated successfully.`,
    });
  };

  const confirmDeleteEvaluation = (evaluation: EvaluationRequest) => {
    setEvaluationToDelete(evaluation);
    setDeleteDialogOpen(true);
  };

  const handleDeleteEvaluation = async () => {
    if (!evaluationToDelete) return;
    
    try {
      await deleteEvaluationRequest(evaluationToDelete.id);
      setEvaluations(prev => prev.filter(evaluation => evaluation.id !== evaluationToDelete.id));
      toast({
        title: 'Evaluation request deleted',
        description: `Evaluation request for ${evaluationToDelete.legal_name || 'student'} has been deleted successfully.`,
      });
    } catch (error) {
      console.error('Failed to delete evaluation:', error);
      toast({
        title: 'Error deleting evaluation',
        description: 'Failed to delete evaluation. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setEvaluationToDelete(null);
    }
  };

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredEvaluations(evaluations);
      return;
    }
    
    const lowerCaseSearch = searchTerm.toLowerCase();
    const filtered = evaluations.filter(evaluation => 
      (evaluation.legal_name && evaluation.legal_name.toLowerCase().includes(lowerCaseSearch)) || 
      (evaluation.grade && evaluation.grade.toLowerCase().includes(lowerCaseSearch)) || 
      (evaluation.general_education_teacher && evaluation.general_education_teacher.toLowerCase().includes(lowerCaseSearch)) ||
      (evaluation.service_type && evaluation.service_type.toLowerCase().includes(lowerCaseSearch))
    );
    
    setFilteredEvaluations(filtered);
  };

  const handleFilter = (filterValue: string) => {
    if (!filterValue) {
      setFilteredEvaluations(evaluations);
      return;
    }
    
    const filtered = evaluations.filter(evaluation => 
      evaluation.status === filterValue
    );
    
    setFilteredEvaluations(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            Approved
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
            <File className="mr-1 h-3 w-3" />
            In Progress
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
            <AlertCircle className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  const filterOptions = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "rejected", label: "Rejected" }
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Evaluation Requests</h2>
        <Button 
          onClick={() => setCreateDialogOpen(true)}
          className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90"
        >
          <Plus className="mr-2 h-4 w-4" /> Request Evaluation
        </Button>
      </div>

      <SearchFilterBar 
        placeholder="Search evaluations by student name, grade, teacher..."
        filterOptions={filterOptions}
        onSearch={handleSearch}
        onFilter={handleFilter}
      />

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin h-8 w-8 border-4 border-psyched-darkBlue border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvaluations.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No evaluation requests</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by requesting a new evaluation.</p>
              <div className="mt-6">
                <Button
                  onClick={() => setCreateDialogOpen(true)}
                  className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90"
                >
                  <Plus className="mr-2 h-4 w-4" /> Request Evaluation
                </Button>
              </div>
            </div>
          ) : (
            filteredEvaluations.map((evaluation) => (
              <Card key={evaluation.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      {evaluation.legal_name || 'Unnamed Student'}
                    </CardTitle>
                    {getStatusBadge(evaluation.status)}
                  </div>
                  <CardDescription>
                    {evaluation.service_type && (
                      <div className="flex items-center text-sm">
                        <FileText className="h-3.5 w-3.5 mr-1 text-gray-500" />
                        {evaluation.service_type}
                      </div>
                    )}
                    
                    {evaluation.created_at && (
                      <div className="flex items-center text-sm mt-1">
                        <Calendar className="h-3.5 w-3.5 mr-1 text-gray-500" />
                        Requested: {format(new Date(evaluation.created_at), 'MMM d, yyyy')}
                      </div>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {evaluation.grade && (
                    <div className="flex items-center text-sm">
                      <Book className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Grade: {evaluation.grade}</span>
                    </div>
                  )}
                  
                  {evaluation.schools && (
                    <div className="flex items-center text-sm">
                      <School className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{(evaluation.schools as any).name}</span>
                    </div>
                  )}
                  
                  {evaluation.general_education_teacher && (
                    <div className="flex items-center text-sm">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Teacher: {evaluation.general_education_teacher}</span>
                    </div>
                  )}
                  
                  {evaluation.students && (
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Student: {(evaluation.students as any).first_name} {(evaluation.students as any).last_name}</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-psyched-darkBlue hover:text-psyched-darkBlue hover:bg-psyched-darkBlue/10"
                    onClick={() => setSelectedEvaluation(evaluation)}
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" /> Details
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingEvaluation(evaluation)}
                  >
                    <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => confirmDeleteEvaluation(evaluation)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash className="h-3.5 w-3.5 mr-1" /> Delete
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the evaluation request for{' '}
              <span className="font-semibold">{evaluationToDelete?.legal_name || 'this student'}</span>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEvaluation} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
