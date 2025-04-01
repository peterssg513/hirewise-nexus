
import React from 'react';
import { MapPin, Clock, Building, Briefcase, Languages, GraduationCap, Eye, Check, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface Job {
  id: string;
  title: string;
  district_name: string;
  district_location?: string;
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
  city?: string;
  state?: string;
  country?: string;
}

interface JobCardProps {
  job: Job;
  onViewDetails: (job: Job) => void;
  onApply: (jobId: string) => void;
  isApplying: boolean;
  hasApplied?: boolean;
  applicationStatus?: string;
}

export const JobCard: React.FC<JobCardProps> = ({ 
  job, 
  onViewDetails, 
  onApply, 
  isApplying,
  hasApplied = false,
  applicationStatus
}) => {
  return (
    <Card className="overflow-hidden border-l-4 hover:shadow-md transition-shadow" 
          style={{ borderLeftColor: '#10b981' }}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{job.title}</CardTitle>
            <CardDescription className="flex items-center text-sm">
              <Building className="h-4 w-4 mr-1.5" />
              {job.district_name}
            </CardDescription>
          </div>
          <Badge className="bg-green-100 text-green-700 border-green-200">
            Active
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        {/* Description */}
        <p className="text-sm line-clamp-2 text-gray-700 mb-3">
          {job.description}
        </p>
        
        {/* Job details grid */}
        <div className="flex flex-wrap text-sm text-gray-600 mb-3 gap-y-1">
          {/* Location */}
          {job.location && (
            <div className="flex items-center mr-4">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
              <span>{job.location}</span>
            </div>
          )}
          
          {/* Work Type */}
          {job.work_type && (
            <div className="flex items-center mr-4">
              <Briefcase className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
              <span>{job.work_type}</span>
            </div>
          )}
        </div>
        
        {/* Tags section */}
        <div className="flex flex-wrap gap-1.5">
          {/* Work Location */}
          {job.work_location && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">
              {job.work_location}
            </Badge>
          )}
          
          {/* Languages */}
          {job.languages_required && job.languages_required.length > 0 && (
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100">
              <Languages className="h-3 w-3 mr-1" />
              {job.languages_required.length} {job.languages_required.length === 1 ? 'language' : 'languages'}
            </Badge>
          )}
          
          {/* Qualifications */}
          {job.qualifications && job.qualifications.length > 0 && (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-100">
              <GraduationCap className="h-3 w-3 mr-1" />
              {job.qualifications.length} {job.qualifications.length === 1 ? 'qualification' : 'qualifications'}
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2 pt-2 border-t bg-gray-50">
        <Button 
          variant="outline"
          className="flex-1 text-blue-600 hover:bg-blue-50 hover:text-blue-700" 
          onClick={() => onViewDetails(job)}
        >
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </Button>
        
        {hasApplied ? (
          <Button 
            variant="outline"
            className="flex-1 font-medium bg-gray-50 text-gray-700"
            disabled={true}
          >
            {applicationStatus === 'approved' ? (
              <><Check className="w-4 h-4 mr-2 text-green-500" />Approved</>
            ) : applicationStatus === 'rejected' ? (
              <><AlertCircle className="w-4 h-4 mr-2 text-red-500" />Rejected</>
            ) : (
              <><Check className="w-4 h-4 mr-2 text-blue-500" />Applied</>
            )}
          </Button>
        ) : (
          <Button 
            variant="success"
            className="flex-1 font-medium"
            onClick={() => onApply(job.id)}
            disabled={isApplying}
          >
            <Check className="w-4 h-4 mr-2" />
            Apply Now
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
