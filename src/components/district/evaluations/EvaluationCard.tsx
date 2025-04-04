
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClipboardList, Clock, Calendar, User, School, GraduationCap, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { EvaluationRequest } from '@/types/evaluationRequest';

interface EvaluationCardProps {
  evaluation: EvaluationRequest;
  onViewDetails: (evaluation: EvaluationRequest) => void;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500',
  active: 'bg-green-500',
  completed: 'bg-blue-500',
  rejected: 'bg-red-500',
};

const getFormattedDate = (dateString: string) => {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
};

export const EvaluationCard: React.FC<EvaluationCardProps> = ({
  evaluation,
  onViewDetails,
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg line-clamp-1">{evaluation.legal_name}</CardTitle>
          <Badge className={statusColors[evaluation.status] || 'bg-gray-500'}>
            {evaluation.status.charAt(0).toUpperCase() + evaluation.status.slice(1)}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          {getFormattedDate(evaluation.created_at)}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <ClipboardList className="h-4 w-4 text-muted-foreground mt-1" />
            <span className="text-sm">
              <span className="font-medium">Service:</span> {evaluation.service_type || 'Not specified'}
            </span>
          </div>
          
          {evaluation.timeframe && (
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-muted-foreground mt-1" />
              <span className="text-sm">
                <span className="font-medium">Timeframe:</span> {evaluation.timeframe}
              </span>
            </div>
          )}
          
          {evaluation.grade && (
            <div className="flex items-start gap-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground mt-1" />
              <span className="text-sm">
                <span className="font-medium">Grade:</span> {evaluation.grade}
              </span>
            </div>
          )}
          
          {evaluation.skills_required && evaluation.skills_required.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {evaluation.skills_required.map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          )}
          
          {evaluation.status === 'pending' && (
            <div className="mt-2 flex items-start gap-2 text-yellow-600">
              <AlertCircle className="h-4 w-4 mt-1" />
              <span className="text-sm">Awaiting admin approval</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={() => onViewDetails(evaluation)} className="w-full">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};
