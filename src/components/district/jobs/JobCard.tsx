
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Trash, MapPin, Clock, Briefcase, Users, GraduationCap, Languages } from 'lucide-react';
import { Job } from '@/services/jobService';

interface JobCardProps {
  job: Job;
  onView: (job: Job) => void;
  onDelete: (jobId: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onView, onDelete }) => {
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
        return 'Pending';
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
    <Card className="overflow-hidden border-l-4 hover:shadow-md transition-shadow" 
          style={{ borderLeftColor: job.status === 'active' ? '#10b981' : 
                                  job.status === 'pending' ? '#f59e0b' : 
                                  job.status === 'offered' ? '#3b82f6' : 
                                  job.status === 'accepted' ? '#8b5cf6' : '#6b7280' }}>
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-lg" title={job.title}>{job.title}</h3>
              <div className="flex items-center mt-1 text-sm text-gray-600">
                {job.city && job.state && (
                  <div className="flex items-center mr-3">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    <span>{job.city}, {job.state}</span>
                  </div>
                )}
                {job.work_type && (
                  <div className="flex items-center">
                    <Briefcase className="h-3.5 w-3.5 mr-1" />
                    <span>{job.work_type}</span>
                  </div>
                )}
              </div>
            </div>
            <Badge variant="outline" className={`font-medium ${getStatusBadgeVariant(job.status)}`}>
              {getStatusLabel(job.status)}
            </Badge>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2 mb-3" title={job.description}>
            {job.description}
          </p>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {job.work_location && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">
                {job.work_location}
              </Badge>
            )}
            
            {job.timeframe && (
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-100">
                <Clock className="h-3 w-3 mr-1" />
                {job.timeframe}
              </Badge>
            )}
            
            {job.languages_required && job.languages_required.length > 0 && (
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100">
                <Languages className="h-3 w-3 mr-1" />
                {job.languages_required.length} {job.languages_required.length === 1 ? 'language' : 'languages'}
              </Badge>
            )}
            
            {job.qualifications && job.qualifications.length > 0 && (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-100">
                <GraduationCap className="h-3 w-3 mr-1" />
                {job.qualifications.length} {job.qualifications.length === 1 ? 'qualification' : 'qualifications'}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex border-t bg-gray-50">
          <Button
            variant="ghost"
            className="flex-1 rounded-none py-2 h-auto text-blue-600 hover:bg-blue-50 hover:text-blue-700"
            onClick={() => onView(job)}
          >
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Button>
          <div className="border-l h-10" />
          <Button
            variant="ghost"
            className="flex-1 rounded-none py-2 h-auto text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => onDelete(job.id)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
