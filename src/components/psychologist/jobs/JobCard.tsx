
import React from 'react';
import { MapPin, Clock, Building, Briefcase, GraduationCap, Languages, Check, Users } from 'lucide-react';
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
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">{job.title}</CardTitle>
        <CardDescription className="flex items-center text-sm">
          <Building className="h-3.5 w-3.5 mr-1.5" />
          {job.district_name}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-3 space-y-3">
        {/* Description */}
        <p className="text-sm line-clamp-2 text-gray-700">
          {truncateText(job.description)}
        </p>
        
        {/* Required Skills */}
        {job.skills_required && job.skills_required.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {job.skills_required.slice(0, 3).map(skill => (
              <Badge key={skill} variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 text-xs">
                {skill}
              </Badge>
            ))}
            {job.skills_required.length > 3 && (
              <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-100 text-xs">
                +{job.skills_required.length - 3} more
              </Badge>
            )}
          </div>
        )}
        
        {/* Job details grid */}
        <div className="grid grid-cols-2 gap-y-2 text-xs text-muted-foreground">
          {/* Location */}
          <div className="flex items-center">
            <MapPin className="w-3 h-3 mr-1 text-gray-500" />
            <span className="truncate">{job.location || job.district_location || "Location not specified"}</span>
          </div>
          
          {/* Timeframe */}
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1 text-gray-500" />
            <span className="truncate">{job.timeframe || "Timeframe not specified"}</span>
          </div>
          
          {/* Work Type */}
          {job.work_type && (
            <div className="flex items-center">
              <Briefcase className="w-3 h-3 mr-1 text-gray-500" />
              <span className="truncate">{job.work_type}</span>
            </div>
          )}
          
          {/* Work Location */}
          {job.work_location && (
            <div className="flex items-center">
              <MapPin className="w-3 h-3 mr-1 text-gray-500" />
              <span className="truncate">{job.work_location}</span>
            </div>
          )}
          
          {/* Languages */}
          {job.languages_required && job.languages_required.length > 0 && (
            <div className="flex items-center">
              <Languages className="w-3 h-3 mr-1 text-gray-500" />
              <span className="truncate">
                {job.languages_required.length} {job.languages_required.length === 1 ? 'language' : 'languages'}
              </span>
            </div>
          )}
          
          {/* Qualifications */}
          {job.qualifications && job.qualifications.length > 0 && (
            <div className="flex items-center">
              <GraduationCap className="w-3 h-3 mr-1 text-gray-500" />
              <span className="truncate">
                {job.qualifications.length} {job.qualifications.length === 1 ? 'qualification' : 'qualifications'}
              </span>
            </div>
          )}
          
          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <div className="flex items-center col-span-2">
              <Check className="w-3 h-3 mr-1 text-green-500" />
              <span className="truncate">{job.benefits.length} benefits included</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-2 border-t bg-gray-50">
        <Button 
          variant="success" 
          className="flex-1"
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
