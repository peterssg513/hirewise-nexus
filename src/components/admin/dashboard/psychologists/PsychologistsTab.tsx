
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Users } from 'lucide-react';

interface Psychologist {
  id: string;
  user_id: string;
  education?: string;
  experience_years?: number;
  specialties?: string[];
  certification_details?: Record<string, any>;
  phone_number?: string;
  city?: string;
  state?: string;
  work_types?: string[];
  evaluation_types?: string[];
  experience?: string;
  certifications?: string[];
  profiles?: {
    name?: string;
    email?: string;
  };
}

interface PsychologistsTabProps {
  loading: boolean;
  pendingPsychologists: Psychologist[];
  onApprove: (type: string, id: string, name: string) => void;
  onReject: (type: string, id: string, name: string) => void;
}

export const PsychologistsTab: React.FC<PsychologistsTabProps> = ({
  loading,
  pendingPsychologists,
  onApprove,
  onReject
}) => {
  if (loading) {
    return <p>Loading pending psychologists...</p>;
  }

  if (pendingPsychologists.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center text-muted-foreground">
            <Users className="mr-2 h-5 w-5" />
            <span>No pending psychologist approvals</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {pendingPsychologists.map(psych => (
        <Card key={psych.id} className="mb-4">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>{psych.profiles?.name || 'Unnamed Psychologist'}</CardTitle>
              <Badge className="bg-yellow-500">Pending</Badge>
            </div>
            <CardDescription>{psych.profiles?.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Education</p>
                <p className="text-sm text-muted-foreground">{psych.education || 'Not specified'}</p>
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
                <p className="text-sm font-medium">Experience</p>
                <div className="text-sm text-muted-foreground mt-1">
                  {(() => {
                    try {
                      const parsedExperience = JSON.parse(psych.experience);
                      if (Array.isArray(parsedExperience)) {
                        return (
                          <div className="border rounded-md p-2 bg-gray-50">
                            {parsedExperience.map((exp, i) => (
                              <div key={i} className="mb-2 pb-2 border-b last:border-b-0">
                                <p className="font-medium">{exp.organization} - {exp.position}</p>
                                <p className="text-xs">{exp.startDate} to {exp.current ? 'Present' : exp.endDate}</p>
                                <p className="mt-1">{exp.description}</p>
                              </div>
                            ))}
                          </div>
                        );
                      }
                    } catch (e) {}
                    return psych.experience;
                  })()}
                </div>
              </div>
            )}
            
            {psych.certification_details && Object.keys(psych.certification_details).length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium">Certification Details</p>
                <div className="border rounded-md p-2 bg-gray-50 mt-1">
                  {Object.entries(psych.certification_details).map(([key, value], i) => (
                    <div key={i} className="mb-2">
                      <p className="text-xs font-medium">{key}</p>
                      <p className="text-sm">{value?.toString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-6 flex justify-end space-x-2">
              <Button 
                variant="outline" 
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => onReject('psychologist', psych.id, psych.profiles?.name || 'Unnamed Psychologist')}
              >
                <X className="mr-1 h-4 w-4" />
                Reject
              </Button>
              <Button onClick={() => onApprove('psychologist', psych.id, psych.profiles?.name || 'Unnamed Psychologist')}>
                <Check className="mr-1 h-4 w-4" />
                Approve Psychologist
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};
