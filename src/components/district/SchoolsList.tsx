
import React, { useState, useEffect } from 'react';
import { School, fetchSchools, deleteSchool } from '@/services/schoolService';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { School as SchoolIcon, MapPin, Users, Edit, Plus, Trash } from 'lucide-react';
import { CreateSchoolDialog } from './CreateSchoolDialog';
import { EditSchoolDialog } from './EditSchoolDialog';
import { SearchFilterBar } from './SearchFilterBar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin h-8 w-8 border-4 border-psyched-darkBlue border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSchools.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <SchoolIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No schools</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a new school.</p>
              <div className="mt-6">
                <Button
                  onClick={() => setCreateDialogOpen(true)}
                  className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add School
                </Button>
              </div>
            </div>
          ) : (
            filteredSchools.map((school) => (
              <Card key={school.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle>{school.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pb-2">
                  {(school.city || school.state) && (
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <span>
                        {[
                          school.street,
                          school.city,
                          school.state,
                          school.zip_code
                        ].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  )}
                  
                  {school.enrollment_size && (
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{school.enrollment_size.toLocaleString()} students</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingSchool(school)}
                  >
                    <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => confirmDeleteSchool(school)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash className="h-3.5 w-3.5 mr-1" /> Delete
                  </Button>
                </CardFooter>
              </Card>
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the school {' '}
              <span className="font-semibold">{schoolToDelete?.name}</span> and may affect related records. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSchool} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
