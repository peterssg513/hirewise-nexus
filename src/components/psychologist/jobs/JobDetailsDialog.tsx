
import React from 'react';
import { Building, MapPin, Clock, Briefcase, Check, Languages, GraduationCap } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Job } from './JobCard';
import { Separator } from '@/components/ui/separator';

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
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }).format(date);
    } catch (e) {
      return 'Date not available';
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{job.title}</DialogTitle>
          <DialogDescription className="flex items-center">
            <Building className="h-4 w-4 mr-1.5" />
            {job.district_name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-5">
          {/* Job details grid */}
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-md">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-600" />
              <div>
                <div className="text-xs font-medium text-gray-500">Location</div>
                <div className="text-sm">{job.location || job.district_location || "Not specified"}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-600" />
              <div>
                <div className="text-xs font-medium text-gray-500">Timeframe</div>
                <div className="text-sm">{job.timeframe || "Not specified"}</div>
              </div>
            </div>
            
            {job.work_type && (
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gray-600" />
                <div>
                  <div className="text-xs font-medium text-gray-500">Work Type</div>
                  <div className="text-sm">{job.work_type}</div>
                </div>
              </div>
            )}
            
            {job.work_location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-600" />
                <div>
                  <div className="text-xs font-medium text-gray-500">Work Location</div>
                  <div className="text-sm">{job.work_location}</div>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-2 col-span-2">
              <div className="text-xs font-medium text-gray-500">Posted</div>
              <div className="text-sm">{formatDate(job.created_at)}</div>
            </div>
          </div>
          
          {/* Job description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">About this position</h3>
            <p className="text-sm text-gray-700 whitespace-pre-line">{job.description}</p>
          </div>
          
          {/* Skills section */}
          {job.skills_required && job.skills_required.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills_required.map(skill => (
                  <Badge key={skill} variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <Separator />
          
          {/* Qualifications section */}
          {job.qualifications && job.qualifications.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-gray-600" />
                Qualifications
              </h3>
              <ul className="space-y-2">
                {job.qualifications.map((qual, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{qual}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Benefits section */}
          {job.benefits && job.benefits.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                Benefits
              </h3>
              <ul className="space-y-2">
                {job.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Languages section */}
          {job.languages_required && job.languages_required.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Languages className="h-5 w-5 text-gray-600" />
                Required Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.languages_required.map((language, index) => (
                  <Badge key={index} variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100">
                    {language}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <DialogFooter className="flex justify-end pt-4">
            <Button 
              variant="success"
              onClick={() => onApply(job.id)} 
              disabled={isApplying}
              className="w-full sm:w-auto"
            >
              {isApplying ? "Submitting..." : "Apply Now"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
