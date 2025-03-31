
import React, { useState, useEffect } from 'react';
import { Student, fetchStudents, deleteStudent } from '@/services/studentService';
import { School, fetchSchools } from '@/services/schoolService';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus, User } from 'lucide-react';
import { CreateStudentDialog } from '../CreateStudentDialog';
import { EditStudentDialog } from '../EditStudentDialog';
import { SearchFilterBar } from '../search/SearchFilterBar';
import { StudentCard } from './StudentCard';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ConfirmDeleteDialog } from '@/components/common/ConfirmDeleteDialog';
import { createStudentFilterOptions } from './StudentFilters';

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
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
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
      setIsDeleting(true);
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
      setIsDeleting(false);
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

  // Create filter options from the helper function
  const filterOptions = createStudentFilterOptions(schools, students);

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
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.length === 0 ? (
            <EmptyState
              icon={User}
              title="No students"
              description="Get started by adding a new student."
              actionText="Add Student"
              onAction={() => setCreateDialogOpen(true)}
            />
          ) : (
            filteredStudents.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                schoolName={getSchoolName(student.school_id)}
                onEdit={setEditingStudent}
                onDelete={confirmDeleteStudent}
              />
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

      {studentToDelete && (
        <ConfirmDeleteDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteStudent}
          title="Are you sure?"
          description={
            <>
              This will permanently delete the student record for{' '}
              <span className="font-semibold">{studentToDelete.first_name} {studentToDelete.last_name}</span>. This action cannot be undone.
            </>
          }
          isDeleting={isDeleting}
        />
      )}
    </>
  );
};
