import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, MapPin, Clock, BookOpen, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

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
}

interface FilterOptions {
  skillsRequired: string[];
  locations: string[];
  timeframes: string[];
}

const JobListings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedTimeframes, setSelectedTimeframes] = useState<string[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    skillsRequired: [],
    locations: [],
    timeframes: []
  });
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  
  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('active_jobs_with_district')
        .select('*')
        .eq('status', 'active');
      
      if (error) throw error;
      return data as Job[];
    }
  });
  
  useEffect(() => {
    if (jobs) {
      const skills = Array.from(new Set(jobs.flatMap(job => job.skills_required || [])));
      const locations = Array.from(new Set(jobs.map(job => job.location).filter(Boolean)));
      const timeframes = Array.from(new Set(jobs.map(job => job.timeframe).filter(Boolean)));
      
      setFilterOptions({
        skillsRequired: skills,
        locations: locations,
        timeframes: timeframes
      });
    }
  }, [jobs]);
  
  const filteredJobs = jobs?.filter(job => {
    const matchesSearch = 
      searchQuery === '' || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.district_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSkills = 
      selectedSkills.length === 0 || 
      selectedSkills.every(skill => job.skills_required?.includes(skill));
    
    const matchesLocation = 
      selectedLocations.length === 0 || 
      selectedLocations.includes(job.location);
    
    const matchesTimeframe = 
      selectedTimeframes.length === 0 || 
      selectedTimeframes.includes(job.timeframe);
    
    return matchesSearch && matchesSkills && matchesLocation && matchesTimeframe;
  });
  
  const handleApplyToJob = async (jobId: string) => {
    try {
      const { data, error } = await supabase.rpc('apply_to_job', { _job_id: jobId });
      
      if (error) throw error;
      
      toast({
        title: "Application submitted",
        description: "Your application has been successfully submitted.",
      });
      
      navigate('/psychologist-dashboard/applications');
    } catch (error: any) {
      toast({
        title: "Error submitting application",
        description: error.message || "An error occurred while submitting your application.",
        variant: "destructive"
      });
    }
  };
  
  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill) 
        : [...prev, skill]
    );
  };
  
  const toggleLocation = (location: string) => {
    setSelectedLocations(prev => 
      prev.includes(location) 
        ? prev.filter(l => l !== location) 
        : [...prev, location]
    );
  };
  
  const toggleTimeframe = (timeframe: string) => {
    setSelectedTimeframes(prev => 
      prev.includes(timeframe) 
        ? prev.filter(t => t !== timeframe) 
        : [...prev, timeframe]
    );
  };
  
  const clearFilters = () => {
    setSelectedSkills([]);
    setSelectedLocations([]);
    setSelectedTimeframes([]);
    setSearchQuery('');
  };
  
  const JobDetails = ({ job }: { job: Job }) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">About this position</h3>
        <p className="text-sm text-muted-foreground whitespace-pre-line">{job.description}</p>
      </div>
      
      {job.skills_required && job.skills_required.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Required Skills</h3>
          <div className="flex flex-wrap gap-2">
            {job.skills_required.map(skill => (
              <Badge key={skill} variant="outline" className="bg-blue-50">{skill}</Badge>
            ))}
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <h3 className="text-lg font-medium">School District</h3>
        <p className="text-sm text-muted-foreground">{job.district_name}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Location</h3>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-1" />
            {job.location || job.district_location || "Not specified"}
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Timeframe</h3>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="w-4 h-4 mr-1" />
            {job.timeframe || "Not specified"}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end pt-4">
        <Button onClick={() => handleApplyToJob(job.id)} className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90">
          Apply for this Position
        </Button>
      </div>
    </div>
  );
  
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
          
          {isMobile ? (
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Filter Jobs</DrawerTitle>
                  <DrawerDescription>Narrow down the job listings</DrawerDescription>
                </DrawerHeader>
                <div className="p-4 space-y-4">
                  <Tabs defaultValue="skills">
                    <TabsList className="grid grid-cols-3 mb-4">
                      <TabsTrigger value="skills">Skills</TabsTrigger>
                      <TabsTrigger value="location">Location</TabsTrigger>
                      <TabsTrigger value="timeframe">Timeframe</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="skills" className="space-y-2">
                      <div className="font-medium">Skills Required</div>
                      <div className="flex flex-wrap gap-2">
                        {filterOptions.skillsRequired.map(skill => (
                          <Badge 
                            key={skill}
                            variant={selectedSkills.includes(skill) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => toggleSkill(skill)}
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="location" className="space-y-2">
                      <div className="font-medium">Locations</div>
                      <div className="flex flex-wrap gap-2">
                        {filterOptions.locations.map(location => (
                          <Badge 
                            key={location}
                            variant={selectedLocations.includes(location) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => toggleLocation(location)}
                          >
                            {location}
                          </Badge>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="timeframe" className="space-y-2">
                      <div className="font-medium">Timeframes</div>
                      <div className="flex flex-wrap gap-2">
                        {filterOptions.timeframes.map(timeframe => (
                          <Badge 
                            key={timeframe}
                            variant={selectedTimeframes.includes(timeframe) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => toggleTimeframe(timeframe)}
                          >
                            {timeframe}
                          </Badge>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                <DrawerFooter>
                  <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
                  <DrawerClose asChild>
                    <Button>Apply Filters</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Filter Jobs</DialogTitle>
                  <DialogDescription>Narrow down the job listings</DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Skills Required</h4>
                      <div className="flex flex-wrap gap-2">
                        {filterOptions.skillsRequired.map(skill => (
                          <Badge 
                            key={skill}
                            variant={selectedSkills.includes(skill) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => toggleSkill(skill)}
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Locations</h4>
                      <div className="flex flex-wrap gap-2">
                        {filterOptions.locations.map(location => (
                          <Badge 
                            key={location}
                            variant={selectedLocations.includes(location) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => toggleLocation(location)}
                          >
                            {location}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Timeframes</h4>
                      <div className="flex flex-wrap gap-2">
                        {filterOptions.timeframes.map(timeframe => (
                          <Badge 
                            key={timeframe}
                            variant={selectedTimeframes.includes(timeframe) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => toggleTimeframe(timeframe)}
                          >
                            {timeframe}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={clearFilters}>Clear All</Button>
                    <Button>Apply Filters</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      
      {(selectedSkills.length > 0 || selectedLocations.length > 0 || selectedTimeframes.length > 0) && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Filters:</span>
          {selectedSkills.map(skill => (
            <Badge key={skill} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
              {skill}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 rounded-full"
                onClick={() => toggleSkill(skill)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          {selectedLocations.map(location => (
            <Badge key={location} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
              {location}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 rounded-full"
                onClick={() => toggleLocation(location)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          {selectedTimeframes.map(timeframe => (
            <Badge key={timeframe} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
              {timeframe}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 rounded-full"
                onClick={() => toggleTimeframe(timeframe)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          {(selectedSkills.length > 0 || selectedLocations.length > 0 || selectedTimeframes.length > 0) && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all
            </Button>
          )}
        </div>
      )}
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? 
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
              <CardFooter className="flex justify-end">
                <Skeleton className="h-9 w-24" />
              </CardFooter>
            </Card>
          )) : 
          filteredJobs?.length === 0 ? (
            <div className="col-span-full flex justify-center items-center h-64 bg-gray-50 rounded-lg border-2 border-dashed">
              <div className="text-center">
                <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold">No jobs found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search query</p>
                {(selectedSkills.length > 0 || selectedLocations.length > 0 || selectedTimeframes.length > 0 || searchQuery) && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={clearFilters}
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
                  <CardTitle className="text-lg font-semibold">{job.title}</CardTitle>
                  <CardDescription>{job.district_name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm line-clamp-3 h-12">{job.description}</p>
                  
                  {job.skills_required && job.skills_required.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {job.skills_required.slice(0, 3).map(skill => (
                        <Badge key={skill} variant="outline" className="bg-blue-50">{skill}</Badge>
                      ))}
                      {job.skills_required.length > 3 && (
                        <Badge variant="outline">+{job.skills_required.length - 3} more</Badge>
                      )}
                    </div>
                  )}
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1 inline" />
                      {job.location || job.district_location || "Location not specified"}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1 inline" />
                      {job.timeframe || "Timeframe not specified"}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  {isMobile ? (
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          onClick={() => setCurrentJob(job)}
                        >
                          View Details
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent>
                        <DrawerHeader>
                          <DrawerTitle>{currentJob?.title}</DrawerTitle>
                          <DrawerDescription>{currentJob?.district_name}</DrawerDescription>
                        </DrawerHeader>
                        <div className="p-4">
                          {currentJob && <JobDetails job={currentJob} />}
                        </div>
                      </DrawerContent>
                    </Drawer>
                  ) : (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          onClick={() => setCurrentJob(job)}
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>{currentJob?.title}</DialogTitle>
                          <DialogDescription>{currentJob?.district_name}</DialogDescription>
                        </DialogHeader>
                        {currentJob && <JobDetails job={currentJob} />}
                      </DialogContent>
                    </Dialog>
                  )}
                </CardFooter>
              </Card>
            ))
          )
        }
      </div>
    </div>
  );
};

export default JobListings;
