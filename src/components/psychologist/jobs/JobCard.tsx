
import React from 'react';
import { MapPin, Clock, Building, Briefcase, GraduationCap, Languages } from 'lucide-react';
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
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{job.title}</CardTitle>
        <CardDescription className="flex items-center">
          <Building className="h-3.5 w-3.5 mr-1.5" />
          {job.district_name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm line-clamp-3">{job.description}</p>
        
        {job.skills_required && job.skills_required.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {job.skills_required.slice(0, 3).map(skill => (
              <Badge key={skill} variant="outline" className="bg-blue-50">{skill}</Badge>
            ))}
            {job.skills_required.length > 3 && (
              <Badge variant="outline">+{job.skills_required.length - 3} more</Badge>
            )}
          </div>
        )}
        
        <div className="grid grid-cols-2 text-xs text-muted-foreground gap-y-2">
          <div className="flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            {job.location || job.district_location || "Location not specified"}
          </div>
          
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {job.timeframe || "Timeframe not specified"}
          </div>
          
          {job.work_type && (
            <div className="flex items-center">
              <Briefcase className="w-3 h-3 mr-1" />
              {job.work_type}
            </div>
          )}
          
          {job.work_location && (
            <div className="flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {job.work_location}
            </div>
          )}
          
          {job.languages_required && job.languages_required.length > 0 && (
            <div className="flex items-center">
              <Languages className="w-3 h-3 mr-1" />
              {job.languages_required.length} {job.languages_required.length === 1 ? 'language' : 'languages'}
            </div>
          )}
          
          {job.qualifications && job.qualifications.length > 0 && (
            <div className="flex items-center">
              <GraduationCap className="w-3 h-3 mr-1" />
              {job.qualifications.length} {job.qualifications.length === 1 ? 'qualification' : 'qualifications'}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-2">
        <Button 
          variant="default" 
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
