
import React, { useState, useEffect } from 'react';
import { Student, fetchStudents } from '@/services/studentService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Edit, Plus, User, School, Phone, Mail } from 'lucide-react';
import { CreateStudentDialog } from './CreateStudentDialog';
import { EditStudentDialog } from './EditStudentDialog';
import { fetchSchoolById } from '@/services/schoolService';

interface StudentsListProps {
  districtId: string;
}

export const StudentsList: React.FC<StudentsListProps> = ({ districtId }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [schoolNames, setSchoolNames] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  useEffect(() => {
    loadStudents();
  }, [districtId]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const studentsData = await fetchStudents(districtId);
      setStudents(studentsData);
      
      // Load school names for all school IDs
      const schoolIds = Array.from(new Set(studentsData.filter(s => s.school_id).map(s => s.school_id)));
      const schoolNamesMap: { [key: string]: string } = {};
      
      await Promise.all(schoolIds.map(async (schoolId) => {
        if (!schoolId) return;
        const school = await fetchSchoolById(schoolId);
        if (school) {
          schoolNamesMap[schoolId] = school.name;
        }
      }));
      
      setSchoolNames(schoolNamesMap);
    } catch (error) {
      console.error('Failed to load students:', error);
      toast({
        title: 'Error loading students',
        description: 'Failed to load students. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStudentCreated = (newStudent: Student) => {
    setStudents(prev => [...prev, newStudent]);
    toast({
      title: 'Student created',
      description: `${newStudent.first_name} ${newStudent.last_name} has been created successfully.`,
    });
  };

  const handleStudentUpdated = (updatedStudent: Student) => {
    setStudents(prev => prev.map(student => 
      student.id === updatedStudent.id ? updatedStudent : student
    ));
    toast({
      title: 'Student updated',
      description: `${updatedStudent.first_name} ${updatedStudent.last_name} has been updated successfully.`,
    });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Students</h2>
        <Button 
          onClick={() => setCreateDialogOpen(true)}
          className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Student
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin h-8 w-8 border-4 border-psyched-darkBlue border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <User className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No students</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a new student.</p>
              <div className="mt-6">
                <Button
                  onClick={() => setCreateDialogOpen(true)}
                  className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Student
                </Button>
              </div>
            </div>
          ) : (
            students.map((student) => (
              <Card key={student.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    {student.first_name} {student.last_name}
                  </CardTitle>
                  <CardDescription>
                    {student.grade && (
                      <span className="text-sm">Grade {student.grade}</span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {student.school_id && schoolNames[student.school_id] && (
                    <div className="flex items-center text-sm">
                      <School className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{schoolNames[student.school_id]}</span>
                    </div>
                  )}
                  
                  {student.current_teacher && (
                    <div className="text-sm">
                      <span className="font-medium">Teacher:</span> {student.current_teacher}
                    </div>
                  )}
                  
                  {student.parent_guardian1_name && (
                    <div className="text-sm border-t pt-2 mt-2">
                      <div className="font-medium">Parent/Guardian:</div>
                      <div>{student.parent_guardian1_name}</div>
                      
                      {student.parent_guardian1_phone && (
                        <div className="flex items-center mt-1">
                          <Phone className="h-3 w-3 mr-1 text-gray-500" />
                          <span>{student.parent_guardian1_phone}</span>
                        </div>
                      )}
                      
                      {student.parent_guardian1_email && (
                        <div className="flex items-center mt-1">
                          <Mail className="h-3 w-3 mr-1 text-gray-500" />
                          <span className="truncate">{student.parent_guardian1_email}</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-auto"
                    onClick={() => setEditingStudent(student)}
                  >
                    <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}

      <CreateStudentDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        districtId={districtId}
        onStudentCreated={handleStudentCreated}
      />

      {editingStudent && (
        <EditStudentDialog
          open={!!editingStudent}
          onOpenChange={(isOpen) => !isOpen && setEditingStudent(null)}
          student={editingStudent}
          onStudentUpdated={handleStudentUpdated}
        />
      )}
    </>
  );
};
