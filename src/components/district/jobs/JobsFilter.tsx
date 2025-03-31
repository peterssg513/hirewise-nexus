
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WORK_LOCATIONS, WORK_TYPES } from '@/services/stateSalaryService';

interface JobsFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string | null;
  setStatusFilter: (value: string | null) => void;
  locationFilter: string | null; 
  setLocationFilter: (value: string | null) => void;
  jobTypeFilter: string | null;
  setJobTypeFilter: (value: string | null) => void;
}

export const JobsFilter: React.FC<JobsFilterProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  locationFilter,
  setLocationFilter,
  jobTypeFilter,
  setJobTypeFilter
}) => {
  return (
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
            <SelectItem value="all">All Statuses</SelectItem>
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
            <SelectItem value="all">All Locations</SelectItem>
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
            <SelectItem value="all">All Types</SelectItem>
            {WORK_TYPES.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
