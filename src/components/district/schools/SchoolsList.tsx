import React, { useState, useEffect } from 'react';
import { School, fetchSchools, deleteSchool } from '@/services/schoolService';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus, School as SchoolIcon, Filter } from 'lucide-react';
import { CreateSchoolDialog } from '../CreateSchoolDialog';
import { EditSchoolDialog } from '../EditSchoolDialog';
import { SearchFilterBar } from '../search/SearchFilterBar';
import { SchoolCard } from './SchoolCard';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ConfirmDeleteDialog } from '@/components/common/ConfirmDeleteDialog';

interface SchoolsListProps {
  districtId: string;
}

export const SchoolsList: React.FC<SchoolsListProps> = ({ districtId }) => {
  const [schools, setSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [schoolToDelete, setSchoolToDelete] = useState<School | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSchools();
  }, [districtId]);

  useEffect(() => {
    setFilteredSchools(schools);
  }, [schools]);

  const loadSchools = async () => {
    try {
      setLoading(true);
      const schoolsData = await fetchSchools(districtId);
      setSchools(schoolsData);
    } catch (error) {
      console.error('Failed to load schools:', error);
      toast({
        title: 'Error loading schools',
        description: 'Failed to load schools. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSchoolCreated = (newSchool: School) => {
    setSchools(prev => [...prev, newSchool]);
    toast({
      title: 'School created',
      description: `${newSchool.name} has been created successfully.`,
    });
  };

  const handleSchoolUpdated = (updatedSchool: School) => {
    setSchools(prev => prev.map(school => 
      school.id === updatedSchool.id ? updatedSchool : school
    ));
    toast({
      title: 'School updated',
      description: `${updatedSchool.name} has been updated successfully.`,
    });
  };

  const confirmDeleteSchool = (school: School) => {
    setSchoolToDelete(school);
    setDeleteDialogOpen(true);
  };

  const handleDeleteSchool = async () => {
    if (!schoolToDelete) return;
    
    try {
      setIsDeleting(true);
      await deleteSchool(schoolToDelete.id);
      setSchools(prev => prev.filter(school => school.id !== schoolToDelete.id));
      toast({
        title: 'School deleted',
        description: `${schoolToDelete.name} has been deleted successfully.`,
      });
    } catch (error) {
      console.error('Failed to delete school:', error);
      toast({
        title: 'Error deleting school',
        description: 'Failed to delete school. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setSchoolToDelete(null);
    }
  };

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredSchools(schools);
      return;
    }
    
    const lowerCaseSearch = searchTerm.toLowerCase();
    const filtered = schools.filter(school => 
      school.name.toLowerCase().includes(lowerCaseSearch) || 
      (school.city && school.city.toLowerCase().includes(lowerCaseSearch)) ||
      (school.state && school.state.toLowerCase().includes(lowerCaseSearch)) ||
      (school.zip_code && school.zip_code.toLowerCase().includes(lowerCaseSearch))
    );
    
    setFilteredSchools(filtered);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Schools</h2>
        <Button 
          onClick={() => setCreateDialogOpen(true)}
          className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90"
        >
          <Plus className="mr-2 h-4 w-4" /> Add School
        </Button>
      </div>

      <SearchFilterBar 
        placeholder="Search schools by name, location..."
        onSearch={handleSearch}
      />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSchools.length === 0 ? (
            <EmptyState
              icon={<Filter className="h-10 w-10" />}
              title="No schools found"
              description="No schools match your criteria. Try adjusting your filters or create your first school."
              actionLabel="Add School"
              onAction={() => setCreateDialogOpen(true)}
            />
          ) : (
            filteredSchools.map((school) => (
              <SchoolCard
                key={school.id}
                school={school}
                onEdit={setEditingSchool}
                onDelete={confirmDeleteSchool}
              />
            ))
          )}
        </div>
      )}

      <CreateSchoolDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        districtId={districtId}
        onSchoolCreated={handleSchoolCreated}
      />

      {editingSchool && (
        <EditSchoolDialog
          open={!!editingSchool}
          onOpenChange={(isOpen) => !isOpen && setEditingSchool(null)}
          school={editingSchool}
          onSchoolUpdated={handleSchoolUpdated}
        />
      )}

      {schoolToDelete && (
        <ConfirmDeleteDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteSchool}
          title="Are you sure?"
          description={
            <>
              This will permanently delete the school{' '}
              <span className="font-semibold">{schoolToDelete.name}</span> and may affect related records. This action cannot be undone.
            </>
          }
          isDeleting={isDeleting}
        />
      )}
    </>
  );
};
