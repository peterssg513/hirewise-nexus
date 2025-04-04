
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Clock, ClipboardList, User } from 'lucide-react';
import { EvaluationRequest } from '@/types/evaluationRequest';
import { formatDistanceToNow } from 'date-fns';

interface EvaluationCardProps {
  evaluation: EvaluationRequest;
  onViewDetails: () => void;
}

export const EvaluationCard: React.FC<EvaluationCardProps> = ({ evaluation, onViewDetails }) => {
  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'active':
      case 'offered':
        return 'bg-purple-100 text-purple-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'evaluation in progress':
        return 'bg-amber-100 text-amber-800';
      case 'completed':
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formattedDate = evaluation.created_at
    ? formatDistanceToNow(new Date(evaluation.created_at), { addSuffix: true })
    : 'Unknown date';
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-medium">
            {evaluation.legal_name || 'Unnamed Student'}
          </CardTitle>
          <Badge className={getStatusColor(evaluation.status)}>
            {evaluation.status}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          <CalendarIcon className="h-3 w-3" /> 
          Created {formattedDate}
        </div>
      </CardHeader>
      
      <CardContent className="py-2 flex-grow">
        <div className="space-y-3">
          {evaluation.service_type && (
            <div className="flex items-start gap-2">
              <ClipboardList className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <div className="text-sm font-medium">Service Type</div>
                <div className="text-sm">{evaluation.service_type}</div>
              </div>
            </div>
          )}
          
          {evaluation.timeframe && (
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <div className="text-sm font-medium">Timeframe</div>
                <div className="text-sm">{evaluation.timeframe}</div>
              </div>
            </div>
          )}
          
          {evaluation.grade && (
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <div className="text-sm font-medium">Grade</div>
                <div className="text-sm">{evaluation.grade}</div>
              </div>
            </div>
          )}
          
          {evaluation.skills_required && evaluation.skills_required.length > 0 && (
            <div className="mt-2">
              <div className="text-sm font-medium mb-1">Skills Required</div>
              <div className="flex flex-wrap gap-1">
                {evaluation.skills_required.slice(0, 3).map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {evaluation.skills_required.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{evaluation.skills_required.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <Button 
          onClick={onViewDetails} 
          variant="outline" 
          className="w-full"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};
