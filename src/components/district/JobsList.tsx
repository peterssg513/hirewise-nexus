import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, Eye, Pencil, Trash } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/common/EmptyState';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { fetchJobs, Job, deleteJob } from '@/services/jobService';
import { useToast } from '@/hooks/use-toast';
import { CreateJobDialog } from './CreateJobDialog';
import { Badge } from '@/components/ui/badge';
import { SearchFilterBar } from './search/SearchFilterBar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WORK_LOCATIONS, WORK_TYPES } from '@/services/stateSalaryService';
import { ConfirmDeleteDialog } from '@/components/common/ConfirmDeleteDialog';

interface JobsListProps {
  districtId: string;
}

export const JobsList: React.FC<JobsListProps> = ({ districtId }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateJobDialog, setShowCreateJobDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [jobTypeFilter, setJobTypeFilter] = useState<string | null>(null);
  const [deleteJobId, setDeleteJobId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const { toast } = useToast();

  const loadJobs = async () => {
    try {
      setIsLoading(true);
      const jobsData = await fetchJobs(districtId);
      setJobs(jobsData);
    } catch (error) {
      console.error('Failed to load jobs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load job listings.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [districtId]);

  const handleCreateJob = (job: Job) => {
    setJobs(prevJobs => [job, ...prevJobs]);
    toast({
      title: 'Job Created',
      description: 'Your job posting has been created and is pending approval.',
    });
  };

  const handleDeleteJob = async () => {
    if (!deleteJobId) return;
    
    try {
      await deleteJob(deleteJobId);
      setJobs(prevJobs => prevJobs.filter(job => job.id !== deleteJobId));
      toast({
        title: 'Job Deleted',
        description: 'The job posting has been successfully deleted.',
      });
    } catch (error) {
      console.error('Failed to delete job:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete job posting.',
        variant: 'destructive',
      });
    } finally {
      setDeleteJobId(null);
    }
  };

  const handleViewJobDetails = (job: Job) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

  const filteredJobs = jobs
    .filter(job => !searchTerm || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(job => !statusFilter || job.status === statusFilter)
    .filter(job => !locationFilter || job.work_location === locationFilter)
    .filter(job => !jobTypeFilter || job.work_type === jobTypeFilter);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'offered':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending Approval';
      case 'active':
        return 'Open';
      case 'offered':
        return 'Offered';
      case 'accepted':
        return 'Accepted';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Job Listings</h2>
        <Button onClick={() => setShowCreateJobDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Job
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter || ''} onValueChange={(value) => setStatusFilter(value || null)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="pending">Pending Approval</SelectItem>
              <SelectItem value="active">Open</SelectItem>
              <SelectItem value="offered">Offered</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={locationFilter || ''} onValueChange={(value) => setLocationFilter(value || null)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Work Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Locations</SelectItem>
              {WORK_LOCATIONS.map(location => (
                <SelectItem key={location} value={location}>{location}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={jobTypeFilter || ''} onValueChange={(value) => setJobTypeFilter(value || null)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Work Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              {WORK_TYPES.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredJobs.length === 0 ? (
        <EmptyState
          title="No job listings found"
          description="No job listings match your criteria. Try adjusting your filters or create your first job."
          icon={<Filter className="h-10 w-10 text-muted-foreground" />}
          actionLabel="Create Job"
          onAction={() => setShowCreateJobDialog(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold truncate" title={job.title}>{job.title}</h3>
                    <Badge variant="outline" className={getStatusBadgeColor(job.status)}>
                      {getStatusLabel(job.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2" title={job.description}>
                    {job.description}
                  </p>
                  <div className="mt-3 space-y-1">
                    {job.city && job.state && (
                      <div className="text-xs text-muted-foreground">
                        Location: {job.city}, {job.state}
                      </div>
                    )}
                    {job.work_location && (
                      <div className="text-xs text-muted-foreground">
                        Work Location: {job.work_location}
                      </div>
                    )}
                    {job.work_type && (
                      <div className="text-xs text-muted-foreground">
                        Work Type: {job.work_type}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex border-t">
                  <Button
                    variant="ghost"
                    className="flex-1 rounded-none py-2 h-auto"
                    onClick={() => handleViewJobDetails(job)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <div className="border-l h-10" />
                  <Button
                    variant="ghost"
                    className="flex-1 rounded-none py-2 h-auto text-destructive hover:text-destructive"
                    onClick={() => setDeleteJobId(job.id)}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <CreateJobDialog
        open={showCreateJobDialog}
        onOpenChange={setShowCreateJobDialog}
        districtId={districtId}
        onJobCreated={handleCreateJob}
      />

      <ConfirmDeleteDialog
        open={!!deleteJobId}
        onOpenChange={() => setDeleteJobId(null)}
        title="Delete Job"
        description="Are you sure you want to delete this job posting? This action cannot be undone."
        onConfirm={handleDeleteJob}
      />
      
      {selectedJob && (
        <Dialog open={showJobDetails} onOpenChange={setShowJobDetails}>
          <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedJob.title}</DialogTitle>
              <div className="mt-1">
                <Badge variant="outline" className={getStatusBadgeColor(selectedJob.status)}>
                  {getStatusLabel(selectedJob.status)}
                </Badge>
              </div>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Description</h4>
                <p className="text-sm">{selectedJob.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {selectedJob.city && selectedJob.state && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Location</h4>
                    <p className="text-sm">{selectedJob.city}, {selectedJob.state}</p>
                  </div>
                )}
                
                {selectedJob.work_location && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Work Location</h4>
                    <p className="text-sm">{selectedJob.work_location}</p>
                  </div>
                )}
                
                {selectedJob.work_type && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Work Type</h4>
                    <p className="text-sm">{selectedJob.work_type}</p>
                  </div>
                )}
                
                {selectedJob.salary && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Salary</h4>
                    <p className="text-sm">${selectedJob.salary.toLocaleString()}</p>
                  </div>
                )}
              </div>
              
              {selectedJob.qualifications && selectedJob.qualifications.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Qualifications</h4>
                  <ul className="list-disc list-inside text-sm">
                    {selectedJob.qualifications.map((qualification, index) => (
                      <li key={index}>{qualification}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedJob.benefits && selectedJob.benefits.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Benefits</h4>
                  <ul className="list-disc list-inside text-sm">
                    {selectedJob.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowJobDetails(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
