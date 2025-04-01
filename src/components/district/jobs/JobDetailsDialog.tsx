
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Briefcase, Clock, Languages, GraduationCap, Building2, Check } from 'lucide-react';
import { Job } from '@/services/jobService';

interface JobDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job;
}

export const JobDetailsDialog: React.FC<JobDetailsDialogProps> = ({ open, onOpenChange, job }) => {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <DialogTitle className="text-xl">{job.title}</DialogTitle>
            <Badge variant="outline" className={`${getStatusBadgeVariant(job.status)}`}>
              {getStatusLabel(job.status)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
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
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
