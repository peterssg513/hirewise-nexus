
import React from 'react';
import { JobDetailsDialog } from '@/components/psychologist/jobs/JobDetailsDialog';
import { useJobApplications } from '@/contexts/JobApplicationContext';
import { Job } from '@/components/psychologist/jobs/JobCard';
import { Badge } from '@/components/ui/badge';

export const MyApplications: React.FC = () => {
  const { applications, isApplicationsLoading, applyForJob, isApplying } = useJobApplications();
  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'offered':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-purple-100 text-purple-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isApplicationsLoading) {
    return (
      <div className="col-span-full flex justify-center py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-7 bg-gray-200 rounded w-64"></div>
          <div className="h-24 bg-gray-200 rounded w-96"></div>
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="col-span-full text-center py-16">
        <h3 className="text-xl font-semibold text-gray-700">No Applications Found</h3>
        <p className="text-gray-500 mt-2">You haven't applied to any jobs yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {applications.map(application => (
          <div key={application.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex justify-between">
                <h3 className="text-lg font-medium">{application.job?.title}</h3>
                <Badge className={`text-sm font-medium px-2 py-1 rounded ${getStatusBadgeClass(application.status)}`}>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mt-1">{application.job?.district_name}</p>
              <p className="text-xs text-gray-500 mt-1">Applied on {new Date(application.created_at).toLocaleDateString()}</p>
              <p className="line-clamp-2 text-sm text-gray-700 mt-2">{application.job?.description}</p>
            </div>
            <div className="bg-gray-50 px-4 py-3 border-t flex justify-end">
              <button 
                className="text-sm text-psyched-lightBlue hover:underline"
                onClick={() => application.job && setSelectedJob(application.job)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {selectedJob && (
        <JobDetailsDialog 
          job={selectedJob} 
          isOpen={!!selectedJob} 
          onClose={() => setSelectedJob(null)} 
          onApply={applyForJob} 
          isApplying={isApplying}
          hasApplied={true}
          applicationStatus={applications.find(app => app.job_id === selectedJob.id)?.status}
        />
      )}
    </>
  );
};
