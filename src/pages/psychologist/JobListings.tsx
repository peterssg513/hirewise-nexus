
import React, { useState } from 'react';
import { JobApplicationProvider } from '@/contexts/JobApplicationContext';
import { AvailableJobs } from '@/components/psychologist/jobs/AvailableJobs';
import { MyApplications } from '@/components/psychologist/jobs/MyApplications';

const JobListings = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('available');

  return (
    <JobApplicationProvider>
      <div className="space-y-6">
        <div className="border-b border-gray-200 mb-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('available')}
              className={`py-2 px-1 relative ${
                activeTab === 'available' 
                  ? 'text-psyched-lightBlue font-medium' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Available Jobs
              {activeTab === 'available' && (
                <span className="absolute -bottom-px left-0 w-full h-0.5 bg-psyched-lightBlue"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`py-2 px-1 relative ${
                activeTab === 'applications' 
                  ? 'text-psyched-lightBlue font-medium' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              My Applications
              {activeTab === 'applications' && (
                <span className="absolute -bottom-px left-0 w-full h-0.5 bg-psyched-lightBlue"></span>
              )}
            </button>
          </div>
        </div>
        
        {activeTab === 'available' && (
          <AvailableJobs
            searchQuery={searchQuery}
            selectedSkills={selectedSkills}
            setSearchQuery={setSearchQuery}
            setSelectedSkills={setSelectedSkills}
          />
        )}
        
        {activeTab === 'applications' && (
          <MyApplications />
        )}
      </div>
    </JobApplicationProvider>
  );
};

export default JobListings;
