
import React, { useState, useEffect } from 'react';
import { Student, fetchStudents, deleteStudent } from '@/services/studentService';
import { School, fetchSchools } from '@/services/schoolService';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { User, School as SchoolIcon, GraduationCap, Phone, Mail, Edit, Plus, Trash } from 'lucide-react';
import { CreateStudentDialog } from './CreateStudentDialog';
import { EditStudentDialog } from './EditStudentDialog';
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

interface StudentsListProps {
  districtId: string;
}

export const StudentsList: React.FC<StudentsListProps> = ({ districtId }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [schools, setSchools] = useState<School[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadStudents();
    loadSchools();
  }, [districtId]);

  useEffect(() => {
    setFilteredStudents(students);
  }, [students]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const studentsData = await fetchStudents(districtId);
      setStudents(studentsData);
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

  const loadSchools = async () => {
    try {
      const schoolsData = await fetchSchools(districtId);
      setSchools(schoolsData);
    } catch (error) {
      console.error('Failed to load schools:', error);
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

  const confirmDeleteStudent = (student: Student) => {
    setStudentToDelete(student);
    setDeleteDialogOpen(true);
  };

  const handleDeleteStudent = async () => {
    if (!studentToDelete) return;
    
    try {
      await deleteStudent(studentToDelete.id);
      setStudents(prev => prev.filter(student => student.id !== studentToDelete.id));
      toast({
        title: 'Student deleted',
        description: `${studentToDelete.first_name} ${studentToDelete.last_name} has been deleted successfully.`,
      });
    } catch (error) {
      console.error('Failed to delete student:', error);
      toast({
        title: 'Error deleting student',
        description: 'Failed to delete student. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
    }
  };

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredStudents(students);
      return;
    }
    
    const lowerCaseSearch = searchTerm.toLowerCase();
    const filtered = students.filter(student => 
      `${student.first_name} ${student.last_name}`.toLowerCase().includes(lowerCaseSearch) || 
      (student.grade && student.grade.toLowerCase().includes(lowerCaseSearch)) ||
      (student.current_teacher && student.current_teacher.toLowerCase().includes(lowerCaseSearch))
    );
    
    setFilteredStudents(filtered);
  };

  const handleFilter = (filterValue: string) => {
    if (!filterValue) {
      setFilteredStudents(students);
      return;
    }
    
    const filtered = students.filter(student => 
      student.school_id === filterValue || student.grade === filterValue
    );
    
    setFilteredStudents(filtered);
  };

  const getSchoolName = (schoolId?: string) => {
    if (!schoolId) return null;
    const school = schools.find(s => s.id === schoolId);
    return school ? school.name : null;
  };

  // Create filter options based on schools and grades
  const filterOptions = [
    ...schools.map(school => ({ value: school.id, label: school.name })),
    ...Array.from(new Set(students.map(s => s.grade).filter(Boolean))).map(grade => ({ 
      value: grade || '', 
      label: `Grade ${grade}` 
    }))
  ];

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

      <SearchFilterBar 
        placeholder="Search students by name, grade, teacher..."
        filterOptions={filterOptions}
        onSearch={handleSearch}
        onFilter={handleFilter}
      />

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin h-8 w-8 border-4 border-psyched-darkBlue border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.length === 0 ? (
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
            filteredStudents.map((student) => (
              <Card key={student.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-base">{student.first_name} {student.last_name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pb-2">
                  {student.grade && (
                    <div className="flex items-center text-sm">
                      <GraduationCap className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Grade {student.grade}</span>
                    </div>
                  )}
                  
                  {student.school_id && getSchoolName(student.school_id) && (
                    <div className="flex items-center text-sm">
                      <SchoolIcon className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{getSchoolName(student.school_id)}</span>
                    </div>
                  )}
                  
                  {student.current_teacher && (
                    <div className="text-sm mt-1">
                      <span className="font-medium">Teacher:</span> {student.current_teacher}
                    </div>
                  )}
                  
                  {student.parent_guardian1_name && (
                    <div className="text-sm mt-2">
                      <span className="font-medium">Guardian:</span> {student.parent_guardian1_name}
                      {student.parent_guardian1_phone && (
                        <div className="flex items-center text-xs text-gray-500 mt-0.5">
                          <Phone className="h-3 w-3 mr-1" />
                          {student.parent_guardian1_phone}
                        </div>
                      )}
                      {student.parent_guardian1_email && (
                        <div className="flex items-center text-xs text-gray-500 mt-0.5">
                          <Mail className="h-3 w-3 mr-1" />
                          {student.parent_guardian1_email}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingStudent(student)}
                  >
                    <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => confirmDeleteStudent(student)}
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the student record for{' '}
              <span className="font-semibold">{studentToDelete?.first_name} {studentToDelete?.last_name}</span>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteStudent} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
