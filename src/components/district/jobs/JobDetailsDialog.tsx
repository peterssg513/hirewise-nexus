
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Briefcase, Clock, Languages, GraduationCap, Building2, Check, Users, User, Phone, Mail, Award } from 'lucide-react';
import { Job, fetchJobApplications } from '@/services/jobService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface JobDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job;
}

export const JobDetailsDialog: React.FC<JobDetailsDialogProps> = ({ open, onOpenChange, job }) => {
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && job) {
      loadApplicants();
    }
  }, [open, job]);

  const loadApplicants = async () => {
    try {
      setLoading(true);
      const applications = await fetchJobApplications(job.id);
      setApplicants(applications);
    } catch (error) {
      console.error('Error loading applicants:', error);
      toast({
        title: 'Error',
        description: 'Failed to load applicants for this job.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'offered':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'accepted':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'closed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending Approval';
      case 'active':
        return 'Active';
      case 'offered':
        return 'Offered';
      case 'accepted':
        return 'Accepted';
      case 'closed':
        return 'Closed';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <DialogTitle className="text-xl">{job.title}</DialogTitle>
            <Badge variant="outline" className={`${getStatusBadgeVariant(job.status)}`}>
              {getStatusLabel(job.status)}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Job Details</TabsTrigger>
            <TabsTrigger value="applicants" className="flex items-center">
              <Users className="w-4 h-4 mr-2" /> 
              Applicants ({applicants.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold mb-2">Description</h3>
              <p className="text-sm text-gray-700">{job.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {job.city && job.state && (
                <div className="space-y-1">
                  <div className="flex items-center text-sm font-medium text-gray-700">
                    <MapPin className="h-4 w-4 mr-1" />
                    Location
                  </div>
                  <p className="text-sm">{job.city}, {job.state}</p>
                </div>
              )}

              {job.work_type && (
                <div className="space-y-1">
                  <div className="flex items-center text-sm font-medium text-gray-700">
                    <Briefcase className="h-4 w-4 mr-1" />
                    Work Type
                  </div>
                  <p className="text-sm">{job.work_type}</p>
                </div>
              )}

              {job.work_location && (
                <div className="space-y-1">
                  <div className="flex items-center text-sm font-medium text-gray-700">
                    <Building2 className="h-4 w-4 mr-1" />
                    Work Location
                  </div>
                  <p className="text-sm">{job.work_location}</p>
                </div>
              )}

              {job.timeframe && (
                <div className="space-y-1">
                  <div className="flex items-center text-sm font-medium text-gray-700">
                    <Clock className="h-4 w-4 mr-1" />
                    Timeframe
                  </div>
                  <p className="text-sm">{job.timeframe}</p>
                </div>
              )}
            </div>

            {job.languages_required && job.languages_required.length > 0 && (
              <div>
                <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Languages className="h-4 w-4 mr-1" />
                  Languages Required
                </div>
                <div className="flex flex-wrap gap-1">
                  {job.languages_required.map((language, index) => (
                    <Badge key={index} variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100">
                      {language}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {job.qualifications && job.qualifications.length > 0 && (
              <div>
                <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <GraduationCap className="h-4 w-4 mr-1" />
                  Qualifications
                </div>
                <ul className="list-disc pl-5 space-y-1">
                  {job.qualifications.map((qualification, index) => (
                    <li key={index} className="text-sm">{qualification}</li>
                  ))}
                </ul>
              </div>
            )}

            {job.benefits && job.benefits.length > 0 && (
              <div>
                <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  Benefits
                </div>
                <div className="space-y-2 p-3 bg-gray-50 rounded border">
                  {job.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="applicants">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : applicants.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">No applicants yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  There are no applications for this job posting yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {applicants.map((application) => (
                  <Card key={application.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          {application.psychologists?.profiles?.profile_picture_url ? (
                            <AvatarImage src={application.psychologists.profiles.profile_picture_url} alt={application.psychologists.profiles.name || "Applicant"} />
                          ) : (
                            <AvatarFallback>{getInitials(application.psychologists?.profiles?.name)}</AvatarFallback>
                          )}
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium">{application.psychologists?.profiles?.name || "Unnamed Applicant"}</h3>
                            <Badge variant="outline" className={
                              application.status === 'approved' ? 'bg-green-50 text-green-700 border-green-100' :
                              application.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                              'bg-blue-50 text-blue-700 border-blue-100'
                            }>
                              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 mt-3">
                            {application.psychologists?.experience_years && (
                              <div className="flex items-center text-sm">
                                <Award className="h-4 w-4 text-gray-500 mr-1" />
                                <span>{application.psychologists.experience_years} years experience</span>
                              </div>
                            )}
                            
                            {application.psychologists?.city && application.psychologists?.state && (
                              <div className="flex items-center text-sm">
                                <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                                <span>{application.psychologists.city}, {application.psychologists.state}</span>
                              </div>
                            )}
                          </div>

                          <Separator className="my-4" />
                          
                          <div className="space-y-3">
                            {application.psychologists?.certifications && application.psychologists.certifications.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium">Certifications</h4>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {application.psychologists.certifications.map((cert: string, idx: number) => (
                                    <Badge key={idx} variant="outline">{cert}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {application.psychologists?.specialties && application.psychologists.specialties.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium">Specialties</h4>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {application.psychologists.specialties.map((specialty: string, idx: number) => (
                                    <Badge key={idx} variant="outline">{specialty}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {application.notes && (
                              <div>
                                <h4 className="text-sm font-medium">Application Notes</h4>
                                <p className="text-sm mt-1">{application.notes}</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-4 flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex items-center"
                              onClick={() => window.open(`/psychologist/profile/${application.psychologist_id}`, '_blank')}
                            >
                              <User className="h-4 w-4 mr-1" />
                              View Full Profile
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
