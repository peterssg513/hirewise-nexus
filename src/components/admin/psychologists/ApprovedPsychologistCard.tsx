
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserRound } from 'lucide-react';
import { formatEducation, formatExperience } from '@/utils/formatters';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ApprovedPsychologistCardProps {
  psych: any;
}

const ApprovedPsychologistCard: React.FC<ApprovedPsychologistCardProps> = ({ 
  psych
}) => {
  const experiences = formatExperience(psych.experience);

  return (
    <Card key={psych.id} className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              {psych.profile_picture_url ? (
                <AvatarImage src={psych.profile_picture_url} alt={psych.profile?.name || 'Profile'} />
              ) : (
                <AvatarFallback>
                  <UserRound className="h-6 w-6" />
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <CardTitle>{psych.profile?.name || 'Unnamed Psychologist'}</CardTitle>
              <CardDescription>{psych.profile?.email || 'No email provided'}</CardDescription>
            </div>
          </div>
          <Badge className="bg-green-500">Approved</Badge>
        </div>
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
        
        {experiences.length > 0 && experiences[0].content !== 'Not specified' && (
          <div className="mt-4">
            <p className="text-sm font-medium">Experience Details</p>
            <div className="text-sm text-muted-foreground mt-1 border rounded-md p-3 bg-gray-50">
              {experiences.map(({ key, content }) => {
                if (typeof content === 'string') {
                  return <div key={key}>{content}</div>;
                }
                
                return (
                  <div key={key} className="mb-2 last:mb-0">
                    <p className="font-medium">
                      {content.organization}{content.position ? ` - ${content.position}` : ''}
                    </p>
                    {(content.startDate || content.endDate) && (
                      <p className="text-xs">{content.startDate} to {content.endDate}</p>
                    )}
                    {content.description && <p className="mt-1 text-sm">{content.description}</p>}
                  </div>
                );
              })}
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
      </CardContent>
    </Card>
  );
};

export default ApprovedPsychologistCard;
