
import React, { useState, useEffect } from 'react';
import { School, fetchSchools } from '@/services/schoolService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Edit, Plus, School as SchoolIcon, MapPin, Users } from 'lucide-react';
import { CreateSchoolDialog } from './CreateSchoolDialog';
import { EditSchoolDialog } from './EditSchoolDialog';

interface SchoolsListProps {
  districtId: string;
}

export const SchoolsList: React.FC<SchoolsListProps> = ({ districtId }) => {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadSchools();
  }, [districtId]);

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

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin h-8 w-8 border-4 border-psyched-darkBlue border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schools.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <SchoolIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No schools</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new school.</p>
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
            schools.map((school) => (
              <Card key={school.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{school.name}</CardTitle>
                  <CardDescription>
                    {school.city && school.state ? (
                      <div className="flex items-center text-sm">
                        <MapPin className="h-3.5 w-3.5 mr-1 text-gray-500" />
                        {school.city}, {school.state} {school.zip_code}
                      </div>
                    ) : null}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {school.enrollment_size && (
                    <div className="flex items-center mb-2">
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">{school.enrollment_size.toLocaleString()} students</span>
                    </div>
                  )}
                  {school.street && (
                    <p className="text-sm text-gray-600">{school.street}</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-auto"
                    onClick={() => setEditingSchool(school)}
                  >
                    <Edit className="h-3.5 w-3.5 mr-1" /> Edit
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
    </>
  );
};
