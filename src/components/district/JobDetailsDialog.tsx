
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Job, fetchJobApplications, updateJob } from '@/services/jobService';
import { fetchSchoolById } from '@/services/schoolService';
import { ApplicationsList } from './ApplicationsList';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Building, Calendar, DollarSign, Briefcase, Award, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface JobDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job;
  onJobUpdated: (job: Job) => void;
}

export const JobDetailsDialog: React.FC<JobDetailsDialogProps> = ({
  open,
  onOpenChange,
  job,
  onJobUpdated,
}) => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [schoolName, setSchoolName] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open && job) {
      loadApplications();
      if (job.school_id) {
        loadSchoolInfo();
      }
    }
  }, [open, job]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const apps = await fetchJobApplications(job.id);
      setApplications(apps);
    } catch (error) {
      console.error('Failed to load applications:', error);
      toast({
        title: 'Error',
        description: 'Failed to load applications for this job.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSchoolInfo = async () => {
    if (!job.school_id) return;
    
    try {
      const school = await fetchSchoolById(job.school_id);
      if (school) {
        setSchoolName(school.name);
      }
    } catch (error) {
      console.error('Failed to load school info:', error);
    }
  };

  const toggleActiveStatus = async () => {
    try {
      const newStatus = job.status === 'active' ? 'inactive' : 'active';
      const updatedJob = await updateJob(job.id, { status: newStatus });
      onJobUpdated(updatedJob);
      
      toast({
        title: 'Status updated',
        description: `Job is now ${newStatus}.`,
      });
    } catch (error) {
      console.error('Failed to update job status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update job status.',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">
            <CheckCircle className="h-3.5 w-3.5 mr-1" />
            Active
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200">
            <Clock className="h-3.5 w-3.5 mr-1" />
            Pending
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50 border-gray-200">
            {status}
          </Badge>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <DialogTitle>{job.title}</DialogTitle>
            {getStatusBadge(job.status)}
          </div>
          <DialogDescription>
            {job.location || (job.city && job.state) && (
              <div className="flex items-center mt-1">
                <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                <span>{job.location || `${job.city}, ${job.state}`}</span>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Job Details</TabsTrigger>
            <TabsTrigger value="applications">
              Applications ({applications.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-2 gap-4 my-4">
              {job.salary && (
                <div className="flex items-start">
                  <DollarSign className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm font-medium">${job.salary.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Salary</p>
                  </div>
                </div>
              )}
              
              {job.job_type && (
                <div className="flex items-start">
                  <Briefcase className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm font-medium">{job.job_type}</p>
                    <p className="text-xs text-gray-500">Job Type</p>
                  </div>
                </div>
              )}
              
              {job.timeframe && (
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm font-medium">{job.timeframe}</p>
                    <p className="text-xs text-gray-500">Timeframe</p>
                  </div>
                </div>
              )}
              
              {schoolName && (
                <div className="flex items-start">
                  <Building className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm font-medium">{schoolName}</p>
                    <p className="text-xs text-gray-500">School</p>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Description</h3>
              <p className="text-sm whitespace-pre-line">{job.description}</p>
            </div>
            
            {job.qualifications && job.qualifications.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Qualifications</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {job.qualifications.map((qual, index) => (
                    <li key={index} className="text-sm">{qual}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {job.skills_required && job.skills_required.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Required Skills</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {job.skills_required.map((skill, index) => (
                    <li key={index} className="text-sm">{skill}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {job.documents_required && job.documents_required.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Required Documents</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {job.documents_required.map((doc, index) => (
                    <li key={index} className="text-sm">{doc}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div>
              <h3 className="text-sm font-medium mb-2">Benefits</h3>
              <ul className="list-disc pl-5 space-y-1">
                {job.benefits && job.benefits.map((benefit, index) => (
                  <li key={index} className="text-sm">{benefit}</li>
                ))}
              </ul>
            </div>

            <DialogFooter>
              <Button 
                variant={job.status === 'active' ? 'outline' : 'default'}
                onClick={toggleActiveStatus}
              >
                {job.status === 'active' ? 'Deactivate Job' : 'Activate Job'}
              </Button>
            </DialogFooter>
          </TabsContent>
          
          <TabsContent value="applications">
            <ApplicationsList 
              applications={applications} 
              isLoading={loading} 
              onApplicationStatusChanged={loadApplications}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
