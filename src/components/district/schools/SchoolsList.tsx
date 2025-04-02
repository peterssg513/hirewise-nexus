
import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchSchools, School } from '@/services/schoolService';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { SearchFilterBar } from '@/components/district/search/SearchFilterBar';
import { SchoolCard } from './SchoolCard';
import { CreateSchoolDialog } from '../CreateSchoolDialog';
import { useQuery } from '@tanstack/react-query';

interface SchoolsListProps {
  districtId: string;
}

export const SchoolsList: React.FC<SchoolsListProps> = ({ districtId }) => {
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  const { 
    data: schools = [], 
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ['schools', districtId],
    queryFn: () => fetchSchools(districtId),
    enabled: !!districtId
  });
  
  // Log schools data for debugging
  useEffect(() => {
    console.log('SchoolsList - District ID:', districtId);
    console.log('SchoolsList - Schools:', schools);
    console.log('SchoolsList - Loading:', loading);
    console.log('SchoolsList - Error:', error);
  }, [districtId, schools, loading, error]);
  
  useEffect(() => {
    // Apply filters whenever search term or schools changes
    const filtered = schools.filter(applyFilters);
    setFilteredSchools(filtered);
  }, [searchTerm, schools]);
  
  const handleSchoolCreated = (newSchool: School) => {
    // Refresh schools data after creating a new school
    refetch();
    
    toast({
      title: 'Success',
      description: 'School created successfully',
    });
  };
  
  const handleSchoolUpdated = (updatedSchool: School) => {
    // Refresh schools data after updating a school
    refetch();
    
    toast({
      title: 'Success',
      description: 'School updated successfully',
    });
  };
  
  const handleSchoolDeleted = (deletedSchoolId: string) => {
    // Refresh schools data after deleting a school
    refetch();
    
    toast({
      title: 'Success',
      description: 'School deleted successfully',
    });
  };
  
  const applyFilters = (school: School) => {
    // Apply search term filter
    if (searchTerm && !school.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  };
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  const handleFilter = (filter: string) => {
    // No-op for now since we're not using filters in this component
  };

  const handleEditSchool = (school: School) => {
    // Placeholder for edit functionality
    console.log('Edit school:', school);
    // You would typically open an edit dialog here
  };

  const handleDeleteSchool = (school: School) => {
    // Placeholder for delete functionality
    console.log('Delete school:', school);
    // You would typically open a confirmation dialog here
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    console.error('Error loading schools:', error);
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">Error loading schools. Please try again.</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <SearchFilterBar 
          placeholder="Search schools..." 
          onSearch={handleSearch}
          onFilter={handleFilter}
        />
        <Button onClick={() => setIsCreateDialogOpen(true)} className="md:w-auto w-full">
          <Plus className="mr-1 h-4 w-4" /> Add School
        </Button>
      </div>
      
      {filteredSchools.length === 0 ? (
        <EmptyState 
          title="No Schools Found" 
          description={searchTerm ? 
            "No schools match your search criteria. Try adjusting your filters." : 
            "You haven't added any schools yet."
          }
          actionLabel={!searchTerm ? "Add Your First School" : undefined}
          onAction={!searchTerm ? () => setIsCreateDialogOpen(true) : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSchools.map((school) => (
            <SchoolCard 
              key={school.id} 
              school={school} 
              onEdit={() => handleEditSchool(school)}
              onDelete={() => handleDeleteSchool(school)}
            />
          ))}
        </div>
      )}
      
      <CreateSchoolDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        districtId={districtId}
        onSchoolCreated={handleSchoolCreated}
      />
    </div>
  );
};
