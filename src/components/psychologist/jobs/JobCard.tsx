
import React from 'react';
import { MapPin, Clock, Building, Briefcase, GraduationCap, Languages, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface Job {
  id: string;
  title: string;
  district_name: string;
  district_location: string;
  description: string;
  skills_required: string[];
  location: string;
  timeframe: string;
  status: string;
  created_at: string;
  work_type?: string;
  work_location?: string;
  languages_required?: string[];
  qualifications?: string[];
  benefits?: string[];
}

interface JobCardProps {
  job: Job;
  onViewDetails: (job: Job) => void;
  onApply: (jobId: string) => void;
  isApplying: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onViewDetails, onApply, isApplying }) => {
  const truncateText = (text: string, maxLength = 120) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card className="overflow-hidden border-l-4 hover:shadow-md transition-shadow" 
          style={{ borderLeftColor: '#10b981' }}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">{job.title}</CardTitle>
        <CardDescription className="flex items-center text-sm">
          <Building className="h-4 w-4 mr-1.5" />
          {job.district_name}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        {/* Description */}
        <p className="text-sm line-clamp-2 text-gray-700 mb-3">
          {truncateText(job.description)}
        </p>
        
        {/* Job details grid */}
        <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600 mb-3">
          {/* Location */}
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1.5 text-gray-500" />
            <span>{job.location || "Location not specified"}</span>
          </div>
          
          {/* Timeframe */}
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1.5 text-gray-500" />
            <span>{job.timeframe || "Timeframe not specified"}</span>
          </div>
          
          {/* Work Type */}
          {job.work_type && (
            <div className="flex items-center">
              <Briefcase className="w-4 h-4 mr-1.5 text-gray-500" />
              <span>{job.work_type}</span>
            </div>
          )}
        </div>
        
        {/* Required Skills */}
        {job.skills_required && job.skills_required.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {job.skills_required.slice(0, 3).map(skill => (
              <Badge key={skill} variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">
                {skill}
              </Badge>
            ))}
            {job.skills_required.length > 3 && (
              <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-100">
                +{job.skills_required.length - 3} more
              </Badge>
            )}
          </div>
        )}
        
        {/* Languages */}
        {job.languages_required && job.languages_required.length > 0 && (
          <div className="flex items-center mb-1.5 text-xs text-gray-600">
            <Languages className="w-3.5 h-3.5 mr-1 text-gray-500" />
            <span>
              {job.languages_required.length > 1 
                ? `${job.languages_required.length} languages required` 
                : job.languages_required[0]}
            </span>
          </div>
        )}
        
        {/* Qualifications */}
        {job.qualifications && job.qualifications.length > 0 && (
          <div className="flex items-center text-xs text-gray-600">
            <GraduationCap className="w-3.5 h-3.5 mr-1 text-gray-500" />
            <span>{job.qualifications.length} qualification{job.qualifications.length > 1 ? 's' : ''} required</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2 pt-2 border-t bg-gray-50">
        <Button 
          variant="success" 
          className="flex-1 font-medium"
          onClick={() => onApply(job.id)}
          disabled={isApplying}
        >
          Apply Now
        </Button>
        <Button 
          variant="outline" 
          className="flex-1" 
          onClick={() => onViewDetails(job)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};
