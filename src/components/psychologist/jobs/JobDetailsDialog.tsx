
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Job } from '@/components/psychologist/jobs/JobCard';
import { MapPin, Building, Briefcase, Clock, CheckCircle2, GraduationCap, Languages, School } from 'lucide-react';
import { format } from 'date-fns';

interface JobDetailsDialogProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (jobId: string) => void;
  isApplying: boolean;
  hasApplied?: boolean;
}

export const JobDetailsDialog: React.FC<JobDetailsDialogProps> = ({ job, isOpen, onClose, onApply, isApplying, hasApplied = false }) => {
  if (!job) return null;
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch {
      return 'Recently posted';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{job.title}</DialogTitle>
          <DialogDescription className="flex items-center mt-1">
            <Building className="h-4 w-4 mr-1.5" />
            {job.district_name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-5 py-4">
          {/* Location and Job Type */}
          <div className="flex flex-wrap gap-4">
            {job.location && (
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-1.5 text-gray-500" />
                <span>{job.location}</span>
              </div>
            )}
            
            {job.work_type && (
              <div className="flex items-center text-sm">
                <Briefcase className="h-4 w-4 mr-1.5 text-gray-500" />
                <span>{job.work_type}</span>
              </div>
            )}
            
            {job.work_location && (
              <div className="flex items-center text-sm">
                <School className="h-4 w-4 mr-1.5 text-gray-500" />
                <span>{job.work_location}</span>
              </div>
            )}
            
            {job.timeframe && (
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-1.5 text-gray-500" />
                <span>{job.timeframe}</span>
              </div>
            )}
            
            <div className="flex items-center text-sm ml-auto">
              <Badge className="bg-green-100 text-green-700 border-green-200">
                Posted {formatDate(job.created_at)}
              </Badge>
            </div>
          </div>
          
          <Separator />
          
          {/* Description */}
          <div>
            <h3 className="text-sm font-medium mb-2">Job Description</h3>
            <div className="text-sm text-gray-700 whitespace-pre-wrap">
              {job.description}
            </div>
          </div>
          
          {/* Required Skills */}
          {job.skills_required && job.skills_required.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {job.skills_required.map((skill, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 border-blue-100">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
          
          {/* Qualifications */}
          {job.qualifications && job.qualifications.length > 0 && (
            <>
              <Separator />
              <div>
                <div className="flex items-center mb-2">
                  <GraduationCap className="h-4 w-4 mr-1.5 text-gray-500" />
                  <h3 className="text-sm font-medium">Qualifications</h3>
                </div>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 pl-1">
                  {job.qualifications.map((qualification, index) => (
                    <li key={index}>{qualification}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
          
          {/* Languages */}
          {job.languages_required && job.languages_required.length > 0 && (
            <>
              <Separator />
              <div>
                <div className="flex items-center mb-2">
                  <Languages className="h-4 w-4 mr-1.5 text-gray-500" />
                  <h3 className="text-sm font-medium">Languages</h3>
                </div>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 pl-1">
                  {job.languages_required.map((language, index) => (
                    <li key={index}>{language}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
          
          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium mb-2">Benefits</h3>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 pl-1">
                  {job.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="mr-2">
            Cancel
          </Button>
          <Button 
            variant={hasApplied ? "outline" : "success"}
            onClick={() => onApply(job.id)} 
            disabled={isApplying || hasApplied}
            className="px-6"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            {hasApplied ? "Already Applied" : isApplying ? "Applying..." : "Apply Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
