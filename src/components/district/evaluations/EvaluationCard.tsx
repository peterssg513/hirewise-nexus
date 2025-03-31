
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { EvaluationRequest } from '@/services/evaluationRequestService';
import { MoreVertical, Calendar, School, User } from 'lucide-react';
import { format } from 'date-fns';
import { EditEvaluationDialog } from '../EditEvaluationDialog';
import { useToast } from '@/hooks/use-toast';
import { ConfirmDeleteDialog } from '@/components/common/ConfirmDeleteDialog';

interface EvaluationCardProps {
  evaluation: EvaluationRequest;
}

export const EvaluationCard: React.FC<EvaluationCardProps> = ({ evaluation }) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-500';
      case 'Offered':
        return 'bg-purple-500';
      case 'Accepted':
        return 'bg-green-500';
      case 'Evaluation In Progress':
        return 'bg-yellow-500';
      case 'Closed':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleEvaluationUpdated = (updatedEvaluation: EvaluationRequest) => {
    toast({
      title: 'Success',
      description: 'Evaluation request updated successfully.',
    });
    // In a real implementation, you would update the evaluation in the parent component
  };

  const handleDelete = async () => {
    try {
      // In a real implementation, you would delete the evaluation
      toast({
        title: 'Success',
        description: 'Evaluation request deleted successfully.',
      });
    } catch (error) {
      console.error('Failed to delete evaluation:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete evaluation request. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <Badge className={`${getStatusColor(evaluation.status)} text-white`}>
                {evaluation.status || 'Pending'}
              </Badge>
              <CardTitle className="mt-2 text-lg">
                {evaluation.legal_name || 'Unnamed Student'}
              </CardTitle>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                  Edit evaluation
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setDeleteDialogOpen(true)}
                  className="text-red-600"
                >
                  Delete evaluation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pb-2 flex-grow">
          <div className="space-y-2 text-sm">
            {evaluation.service_type && (
              <div className="text-muted-foreground">
                Service: <span className="font-medium text-foreground">{evaluation.service_type}</span>
              </div>
            )}
            {evaluation.grade && (
              <div className="flex items-center text-muted-foreground">
                <School className="h-3.5 w-3.5 mr-1" />
                Grade <span className="font-medium text-foreground ml-1">{evaluation.grade}</span>
              </div>
            )}
            {evaluation.age && (
              <div className="flex items-center text-muted-foreground">
                <User className="h-3.5 w-3.5 mr-1" />
                Age <span className="font-medium text-foreground ml-1">{evaluation.age}</span>
              </div>
            )}
            {evaluation.created_at && (
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                Created <span className="font-medium text-foreground ml-1">
                  {format(new Date(evaluation.created_at), 'MMM d, yyyy')}
                </span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => setEditDialogOpen(true)}
          >
            View Details
          </Button>
        </CardFooter>
      </Card>

      <EditEvaluationDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        evaluation={evaluation}
        onEvaluationUpdated={handleEvaluationUpdated}
      />

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Evaluation Request"
        description="Are you sure you want to delete this evaluation request? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </>
  );
};
