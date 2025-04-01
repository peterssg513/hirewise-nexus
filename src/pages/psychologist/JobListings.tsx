
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, MapPin, Clock, Building, Check, Briefcase, GraduationCap, Languages } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Job {
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

const JobListings = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  
  // Fetch active jobs with district information
  const { data: jobs, isLoading, error, refetch } = useQuery({
    queryKey: ['active-jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('active_jobs_with_district')
        .select('*')
        .eq('status', 'active');
      
      if (error) throw error;
      return data as Job[];
    }
  });
  
  // Filter jobs based on search and skills
  const filteredJobs = jobs?.filter(job => {
    const matchesSearch = 
      searchQuery === '' || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.district_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSkills = 
      selectedSkills.length === 0 || 
      selectedSkills.every(skill => job.skills_required?.includes(skill));
    
    return matchesSearch && matchesSkills;
  });
  
  // Apply for job
  const handleApplyForJob = async (jobId: string) => {
    if (isApplying) return; // Prevent multiple clicks
    
    setIsApplying(true);
    try {
      // Call the apply_to_job RPC function
      const { data, error } = await supabase.rpc('apply_to_job', {
        _job_id: jobId
      });
      
      if (error) throw error;
      
      toast({
        title: "Application submitted",
        description: "Your application has been successfully submitted.",
        variant: "default"
      });
      
      // Close the dialog if open
      setSelectedJob(null);
      
      // Refresh jobs list to update applied status if needed
      refetch();
    } catch (error: any) {
      console.error('Error applying for job:', error);
      toast({
        title: "Error submitting application",
        description: error.message || "An error occurred while submitting your application.",
        variant: "destructive"
      });
    } finally {
      setIsApplying(false);
    }
  };
  
  // Extract all unique skills from jobs for filtering
  const allSkills = React.useMemo(() => {
    if (!jobs) return [];
    const skillsSet = new Set<string>();
    jobs.forEach(job => {
      if (job.skills_required) {
        job.skills_required.forEach(skill => skillsSet.add(skill));
      }
    });
    return Array.from(skillsSet);
  }, [jobs]);
  
  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-500">Error loading jobs</h3>
          <p className="text-muted-foreground">{(error as Error).message}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Job Listings</h1>
          <p className="text-muted-foreground">Find and apply for school psychology positions</p>
        </div>
        
        <div className="w-full md:w-auto flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search jobs..."
              className="pl-8 w-full md:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filter Skills</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Filter by Skills</DialogTitle>
                <DialogDescription>Select skills to filter job listings</DialogDescription>
              </DialogHeader>
              <div className="flex flex-wrap gap-2 mt-4">
                {allSkills.map(skill => (
                  <Badge 
                    key={skill}
                    variant={selectedSkills.includes(skill) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedSkills(prev => 
                        prev.includes(skill) 
                          ? prev.filter(s => s !== skill) 
                          : [...prev, skill]
                      );
                    }}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                {selectedSkills.length > 0 && (
                  <Button 
                    variant="ghost" 
                    onClick={() => setSelectedSkills([])}
                  >
                    Clear All
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          // Loading skeletons
          Array(6).fill(0).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full mb-4" />
                <div className="flex flex-wrap gap-2 mb-4">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-8 w-full" />
              </CardFooter>
            </Card>
          ))
        ) : filteredJobs?.length === 0 ? (
          <div className="col-span-full flex justify-center items-center h-64 bg-gray-50 rounded-lg border-2 border-dashed">
            <div className="text-center">
              <h3 className="text-lg font-semibold">No jobs found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search query</p>
              {(selectedSkills.length > 0 || searchQuery) && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSelectedSkills([]);
                    setSearchQuery('');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        ) : (
          filteredJobs?.map(job => (
            <Card key={job.id} className="overflow-hidden hover:shadow-md transition-shadow">
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
                  onClick={() => handleApplyForJob(job.id)}
                  disabled={isApplying}
                >
                  Apply Now
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="flex-1" 
                      onClick={() => setSelectedJob(job)}
                    >
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>{selectedJob?.title}</DialogTitle>
                      <DialogDescription className="flex items-center">
                        <Building className="h-4 w-4 mr-1.5" />
                        {selectedJob?.district_name}
                      </DialogDescription>
                    </DialogHeader>
                    {selectedJob && (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium">About this position</h3>
                          <p className="text-sm text-muted-foreground whitespace-pre-line">{selectedJob.description}</p>
                        </div>
                        
                        {selectedJob.skills_required && selectedJob.skills_required.length > 0 && (
                          <div>
                            <h3 className="text-lg font-medium">Required Skills</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {selectedJob.skills_required.map(skill => (
                                <Badge key={skill} variant="outline" className="bg-blue-50">{skill}</Badge>
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
                              {selectedJob.location || selectedJob.district_location || "Not specified"}
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium">Timeframe</h3>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="w-4 h-4 mr-1" />
                              {selectedJob.timeframe || "Not specified"}
                            </div>
                          </div>
                          
                          {selectedJob.work_type && (
                            <div>
                              <h3 className="text-lg font-medium">Work Type</h3>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Briefcase className="w-4 h-4 mr-1" />
                                {selectedJob.work_type}
                              </div>
                            </div>
                          )}
                          
                          {selectedJob.work_location && (
                            <div>
                              <h3 className="text-lg font-medium">Work Location</h3>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4 mr-1" />
                                {selectedJob.work_location}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Qualifications section */}
                        {selectedJob.qualifications && selectedJob.qualifications.length > 0 && (
                          <div>
                            <h3 className="text-lg font-medium">Qualifications</h3>
                            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-2">
                              {selectedJob.qualifications.map((qual, index) => (
                                <li key={index}>{qual}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {/* Benefits section */}
                        {selectedJob.benefits && selectedJob.benefits.length > 0 && (
                          <div>
                            <h3 className="text-lg font-medium">Benefits</h3>
                            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-2">
                              {selectedJob.benefits.map((benefit, index) => (
                                <li key={index}>{benefit}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {/* Languages section */}
                        {selectedJob.languages_required && selectedJob.languages_required.length > 0 && (
                          <div>
                            <h3 className="text-lg font-medium">Required Languages</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {selectedJob.languages_required.map((language, index) => (
                                <Badge key={index} variant="outline" className="bg-green-50">{language}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex justify-end pt-4">
                          <Button 
                            onClick={() => handleApplyForJob(selectedJob.id)} 
                            disabled={isApplying}
                          >
                            {isApplying ? "Submitting..." : "Apply Now"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default JobListings;
