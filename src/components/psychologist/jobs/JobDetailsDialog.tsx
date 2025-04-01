
import React from 'react';
import { Building, MapPin, Clock, Briefcase, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Job } from './JobCard';

interface JobDetailsDialogProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (jobId: string) => void;
  isApplying: boolean;
}

export const JobDetailsDialog: React.FC<JobDetailsDialogProps> = ({
  job,
  isOpen,
  onClose,
  onApply,
  isApplying
}) => {
  if (!job) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{job.title}</DialogTitle>
          <DialogDescription className="flex items-center">
            <Building className="h-4 w-4 mr-1.5" />
            {job.district_name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">About this position</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-line mt-2">{job.description}</p>
          </div>
          
          {job.skills_required && job.skills_required.length > 0 && (
            <div>
              <h3 className="text-lg font-medium">Required Skills</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {job.skills_required.map(skill => (
                  <Badge key={skill} variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">{skill}</Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Job details grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium">Location</h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mr-1" />
                {job.location || job.district_location || "Not specified"}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Timeframe</h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-1" />
                {job.timeframe || "Not specified"}
              </div>
            </div>
            
            {job.work_type && (
              <div>
                <h3 className="text-lg font-medium">Work Type</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Briefcase className="w-4 h-4 mr-1" />
                  {job.work_type}
                </div>
              </div>
            )}
            
            {job.work_location && (
              <div>
                <h3 className="text-lg font-medium">Work Location</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-1" />
                  {job.work_location}
                </div>
              </div>
            )}
          </div>
          
          {/* Qualifications section */}
          {job.qualifications && job.qualifications.length > 0 && (
            <div>
              <h3 className="text-lg font-medium">Qualifications</h3>
              <ul className="mt-2 space-y-1">
                {job.qualifications.map((qual, index) => (
                  <li key={index} className="flex items-start text-sm text-muted-foreground">
                    <Check className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{qual}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Benefits section */}
          {job.benefits && job.benefits.length > 0 && (
            <div>
              <h3 className="text-lg font-medium">Benefits</h3>
              <ul className="mt-2 space-y-1">
                {job.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start text-sm text-muted-foreground">
                    <Check className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Languages section */}
          {job.languages_required && job.languages_required.length > 0 && (
            <div>
              <h3 className="text-lg font-medium">Required Languages</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {job.languages_required.map((language, index) => (
                  <Badge key={index} variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100">{language}</Badge>
                ))}
              </div>
            </div>
          )}
          
          <DialogFooter className="flex justify-end pt-4">
            <Button 
              variant="default"
              onClick={() => onApply(job.id)} 
              disabled={isApplying}
              className="bg-green-500 hover:bg-green-600"
            >
              {isApplying ? "Submitting..." : "Apply Now"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
