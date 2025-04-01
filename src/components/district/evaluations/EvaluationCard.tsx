
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EvaluationRequest } from '@/services/evaluationRequestService';
import { ClipboardList, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EvaluationCardProps {
  evaluation: EvaluationRequest;
}

export const EvaluationCard: React.FC<EvaluationCardProps> = ({ evaluation }) => {
  const navigate = useNavigate();
  
  const getBadgeColorByStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'canceled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleViewDetails = () => {
    navigate(`/district-dashboard/evaluations/${evaluation.id}`);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg line-clamp-2">{evaluation.title}</h3>
          <Badge 
            variant="outline" 
            className={`${getBadgeColorByStatus(evaluation.status)} ml-2 whitespace-nowrap`}
          >
            {evaluation.status}
          </Badge>
        </div>
        
        <div className="text-sm text-muted-foreground space-y-1">
          {evaluation.location && (
            <div className="flex items-center">
              <MapPin className="h-3.5 w-3.5 mr-1 text-gray-500" />
              <span className="truncate">{evaluation.location}</span>
            </div>
          )}
          
          {evaluation.timeframe && (
            <div className="flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1 text-gray-500" />
              <span>{evaluation.timeframe}</span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="py-2 flex-grow">
        <div className="text-sm space-y-3">
          <div>
            <p className="text-muted-foreground mb-1">Service Type:</p>
            <p>{evaluation.service_type}</p>
          </div>

          {evaluation.skills_required?.length > 0 && (
            <div>
              <p className="text-muted-foreground mb-1">Skills Required:</p>
              <div className="flex flex-wrap gap-1">
                {evaluation.skills_required.map((skill, index) => (
                  <Badge key={index} variant="outline" className="bg-slate-50">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {evaluation.description && (
            <div>
              <p className="text-muted-foreground mb-1">Description:</p>
              <p className="line-clamp-3">{evaluation.description}</p>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-3">
        <Button 
          onClick={handleViewDetails}
          className="w-full bg-psyched-darkBlue hover:bg-psyched-darkBlue/90"
          size="sm"
        >
          <ClipboardList className="mr-1 h-4 w-4" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};
