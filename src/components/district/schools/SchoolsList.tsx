
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

interface SchoolsListProps {
  districtId: string;
}

export const SchoolsList: React.FC<SchoolsListProps> = ({ districtId }) => {
  const [schools, setSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    loadSchools();
  }, [districtId]);
  
  const loadSchools = async () => {
    try {
      setLoading(true);
      const schoolsData = await fetchSchools(districtId);
      setSchools(schoolsData);
      setFilteredSchools(schoolsData);
    } catch (error) {
      console.error('Error loading schools:', error);
      toast({
        title: 'Error',
        description: 'Failed to load schools. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSchoolCreated = (newSchool: School) => {
    setSchools(prev => [newSchool, ...prev]);
    setFilteredSchools(prev => [newSchool, ...prev]);
    toast({
      title: 'Success',
      description: 'School created successfully',
    });
  };
  
  const handleSchoolUpdated = (updatedSchool: School) => {
    const updatedSchools = schools.map(school => 
      school.id === updatedSchool.id ? updatedSchool : school
    );
    setSchools(updatedSchools);
    setFilteredSchools(updatedSchools.filter(school => applyFilters(school)));
    toast({
      title: 'Success',
      description: 'School updated successfully',
    });
  };
  
  const handleSchoolDeleted = (deletedSchoolId: string) => {
    const updatedSchools = schools.filter(school => school.id !== deletedSchoolId);
    setSchools(updatedSchools);
    setFilteredSchools(updatedSchools.filter(school => applyFilters(school)));
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
  
  useEffect(() => {
    // Apply filters whenever search term changes
    const filtered = schools.filter(applyFilters);
    setFilteredSchools(filtered);
  }, [searchTerm, schools]);
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  const handleFilter = (filter: string) => {
    // No-op for now since we're not using filters in this component
  };
  
  if (loading) {
    return <LoadingSpinner />;
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
