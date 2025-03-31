import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/common/EmptyState';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from 'lucide-react';
import { ConfirmDeleteDialog } from '@/components/common/ConfirmDeleteDialog';

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  school: string;
  grade: string;
  notes: string;
}

interface StudentsListProps {
  schoolId: string;
}

const StudentsList: React.FC<StudentsListProps> = ({ schoolId }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateStudentDialog, setShowCreateStudentDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string | null>(null);
  const [deleteStudentId, setDeleteStudentId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Mock data for students (replace with actual data fetching)
    const mockStudents: Student[] = [
      {
        id: '1',
        name: 'Alice Smith',
        email: 'alice.smith@example.com',
        phone: '123-456-7890',
        school: 'High School A',
        grade: '10',
        notes: 'Active in debate club',
      },
      {
        id: '2',
        name: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        phone: '987-654-3210',
        school: 'High School A',
        grade: '11',
        notes: 'Interested in computer science',
      },
      {
        id: '3',
        name: 'Charlie Brown',
        email: 'charlie.brown@example.com',
        phone: '555-123-4567',
        school: 'High School A',
        grade: '9',
        notes: 'Plays the trumpet in the band',
      },
    ];

    // Simulate loading delay
    setTimeout(() => {
      setStudents(mockStudents);
      setIsLoading(false);
    }, 500);
  }, [schoolId]);

  const handleCreateStudent = (student: Student) => {
    setStudents(prevStudents => [student, ...prevStudents]);
    toast({
      title: 'Student Added',
      description: `${student.name} has been added to the list.`,
    });
  };

  const handleDeleteStudent = () => {
    if (!deleteStudentId) return;

    setStudents(prevStudents => prevStudents.filter(student => student.id !== deleteStudentId));
    setDeleteStudentId(null);
    toast({
      title: 'Student Deleted',
      description: 'The student has been successfully removed.',
    });
  };

  const filteredStudents = students
    .filter(student => !searchTerm || student.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(student => !gradeFilter || student.grade === gradeFilter);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Students</h2>
        <Button onClick={() => setShowCreateStudentDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div>
          <Select value={gradeFilter || ''} onValueChange={(value) => setGradeFilter(value || null)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Grades</SelectItem>
              <SelectItem value="9">Grade 9</SelectItem>
              <SelectItem value="10">Grade 10</SelectItem>
              <SelectItem value="11">Grade 11</SelectItem>
              <SelectItem value="12">Grade 12</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredStudents.length === 0 ? (
        
        
        
          
            
              <Filter className="h-10 w-10 text-muted-foreground" />
            
            
              No students found
            
            
              No students match your criteria. Try adjusting your filters or add a new student.
            
            
              
                
                  <Plus className="mr-2 h-4 w-4" />
                  Add Student
                
              
            
          
        
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>School</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.phone}</TableCell>
                  <TableCell>{student.school}</TableCell>
                  <TableCell>{student.grade}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDeleteStudentId(student.id)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <CreateStudentDialog
        open={showCreateStudentDialog}
        onOpenChange={setShowCreateStudentDialog}
        schoolId={schoolId}
        onStudentCreated={handleCreateStudent}
      />

      <ConfirmDeleteDialog
        open={!!deleteStudentId}
        onOpenChange={() => setDeleteStudentId(null)}
        title="Delete Student"
        description="Are you sure you want to remove this student from the list? This action cannot be undone."
        onConfirm={handleDeleteStudent}
      />
    </div>
  );
};

interface CreateStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schoolId: string;
  onStudentCreated: (student: Student) => void;
}

const CreateStudentDialog: React.FC<CreateStudentDialogProps> = ({ open, onOpenChange, schoolId, onStudentCreated }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    // Mock student data (replace with actual form data)
    const newStudent: Student = {
      id: Math.random().toString(36).substring(7),
      name: 'New Student',
      email: 'new.student@example.com',
      phone: '111-222-3333',
      school: 'High School A',
      grade: '10',
      notes: 'New student notes',
    };

    // Simulate API call
    setTimeout(() => {
      onStudentCreated(newStudent);
      onOpenChange(false);
      setIsSubmitting(false);
      toast({
        title: 'Student Added',
        description: `${newStudent.name} has been added to the list.`,
      });
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Student</DialogTitle>
          <DialogDescription>
            Add a new student to the school's list.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input type="text" id="name" defaultValue="New Student" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input type="email" id="email" defaultValue="new.student@example.com" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input type="tel" id="phone" defaultValue="111-222-3333" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="grade" className="text-right">
                Grade
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9">Grade 9</SelectItem>
                  <SelectItem value="10">Grade 10</SelectItem>
                  <SelectItem value="11">Grade 11</SelectItem>
                  <SelectItem value="12">Grade 12</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea id="notes" defaultValue="New student notes" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Student'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StudentsList;
