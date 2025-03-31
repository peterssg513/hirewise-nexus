
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { formatEducation, formatExperience } from '@/utils/formatters';

interface PsychologistCardProps {
  psych: any;
  onApprove: (id: string, name: string) => void;
  onReject: (id: string, name: string) => void;
}

const PsychologistCard: React.FC<PsychologistCardProps> = ({ 
  psych, 
  onApprove, 
  onReject 
}) => {
  return (
    <Card key={psych.id} className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>{psych.profile?.name || 'Unnamed Psychologist'}</CardTitle>
          <Badge className="bg-yellow-500">Pending</Badge>
        </div>
        <CardDescription>{psych.profile?.email || 'No email provided'}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Education</p>
            <p className="text-sm text-muted-foreground">{formatEducation(psych.education)}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Experience</p>
            <p className="text-sm text-muted-foreground">{psych.experience_years ? `${psych.experience_years} years` : 'Not specified'}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Location</p>
            <p className="text-sm text-muted-foreground">
              {psych.city && psych.state ? `${psych.city}, ${psych.state}` : 'Not specified'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Phone</p>
            <p className="text-sm text-muted-foreground">
              {psych.phone_number || 'Not provided'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Specialties</p>
            <p className="text-sm text-muted-foreground">
              {psych.specialties?.length ? psych.specialties.join(', ') : 'None specified'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Certifications</p>
            <p className="text-sm text-muted-foreground">
              {psych.certifications?.length ? psych.certifications.join(', ') : 'None specified'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Work Types</p>
            <p className="text-sm text-muted-foreground">
              {psych.work_types?.length ? psych.work_types.join(', ') : 'None specified'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Evaluation Types</p>
            <p className="text-sm text-muted-foreground">
              {psych.evaluation_types?.length ? psych.evaluation_types.join(', ') : 'None specified'}
            </p>
          </div>
        </div>
        
        {psych.experience && (
          <div className="mt-4">
            <p className="text-sm font-medium">Experience Details</p>
            <div className="text-sm text-muted-foreground mt-1 border rounded-md p-3 bg-gray-50">
              {formatExperience(psych.experience)}
            </div>
          </div>
        )}
        
        {psych.certification_details && Object.keys(typeof psych.certification_details === 'object' ? psych.certification_details : {}).length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium">Certification Details</p>
            <div className="border rounded-md p-2 bg-gray-50 mt-1">
              {Object.entries(typeof psych.certification_details === 'object' ? psych.certification_details : {}).map(([key, value], i) => (
                <div key={i} className="mb-2">
                  <p className="text-xs font-medium">{key}</p>
                  <p className="text-sm">{typeof value === 'string' ? value : JSON.stringify(value)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-6 flex justify-end space-x-2">
          <Button 
            variant="outline" 
            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => onReject(psych.id, psych.profile?.name || 'Unnamed Psychologist')}
          >
            <X className="mr-1 h-4 w-4" />
            Reject
          </Button>
          <Button 
            onClick={() => onApprove(psych.id, psych.profile?.name || 'Unnamed Psychologist')}
          >
            <Check className="mr-1 h-4 w-4" />
            Approve Psychologist
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PsychologistCard;
