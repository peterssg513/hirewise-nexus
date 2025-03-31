
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, FileText } from 'lucide-react';

interface Evaluation {
  id: string;
  legal_name?: string;
  service_type?: string;
  created_at: string;
  grade?: string;
  age?: number;
  general_education_teacher?: string;
  parents?: string;
  other_relevant_info?: string;
  districts?: {
    name?: string;
  };
  schools?: {
    name?: string;
  };
}

interface EvaluationsTabProps {
  loading: boolean;
  pendingEvaluations: Evaluation[];
  onApprove: (type: string, id: string, name: string) => void;
  onReject: (type: string, id: string, name: string) => void;
}

export const EvaluationsTab: React.FC<EvaluationsTabProps> = ({
  loading,
  pendingEvaluations,
  onApprove,
  onReject
}) => {
  if (loading) {
    return <p>Loading pending evaluations...</p>;
  }

  if (pendingEvaluations.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center text-muted-foreground">
            <FileText className="mr-2 h-5 w-5" />
            <span>No pending evaluation approvals</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {pendingEvaluations.map(evaluation => (
        <Card key={evaluation.id} className="mb-4">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>{evaluation.legal_name || 'Unnamed Student'}</CardTitle>
              <Badge className="bg-yellow-500">Pending</Badge>
            </div>
            <CardDescription>
              {evaluation.service_type || 'General Evaluation'} - {' '}
              {evaluation.districts?.name || 'Unknown District'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium">School</p>
                <p className="text-sm text-muted-foreground">{evaluation.schools?.name || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Submission Date</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(evaluation.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Grade</p>
                <p className="text-sm text-muted-foreground">
                  {evaluation.grade || 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Age</p>
                <p className="text-sm text-muted-foreground">
                  {evaluation.age ? `${evaluation.age} years` : 'Not specified'}
                </p>
              </div>
            </div>
            
            {evaluation.general_education_teacher && (
              <div className="mt-2">
                <p className="text-sm font-medium">General Education Teacher</p>
                <p className="text-sm text-muted-foreground">
                  {evaluation.general_education_teacher}
                </p>
              </div>
            )}
            
            {evaluation.parents && (
              <div className="mt-2">
                <p className="text-sm font-medium">Parents/Guardians</p>
                <p className="text-sm text-muted-foreground">
                  {evaluation.parents}
                </p>
              </div>
            )}
            
            {evaluation.other_relevant_info && (
              <div className="mt-2">
                <p className="text-sm font-medium">Additional Information</p>
                <p className="text-sm text-muted-foreground">
                  {evaluation.other_relevant_info}
                </p>
              </div>
            )}
            
            <div className="mt-6 flex justify-end space-x-2">
              <Button 
                variant="outline" 
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => onReject('evaluation', evaluation.id, evaluation.legal_name || 'Unnamed Student')}
              >
                <X className="mr-1 h-4 w-4" />
                Reject
              </Button>
              <Button onClick={() => onApprove('evaluation', evaluation.id, evaluation.legal_name || 'Unnamed Student')}>
                <Check className="mr-1 h-4 w-4" />
                Approve Evaluation
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};
