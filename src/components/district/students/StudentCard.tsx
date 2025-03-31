
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, School as SchoolIcon, GraduationCap, Phone, Mail, Edit, Trash } from 'lucide-react';
import { Student } from '@/services/studentService';

interface StudentCardProps {
  student: Student;
  schoolName: string | null;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({ 
  student, 
  schoolName, 
  onEdit, 
  onDelete 
}) => {
  return (
    <Card className="overflow-hidden">
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
        
        {student.school_id && schoolName && (
          <div className="flex items-center text-sm">
            <SchoolIcon className="h-4 w-4 mr-2 text-gray-500" />
            <span>{schoolName}</span>
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
          onClick={() => onEdit(student)}
        >
          <Edit className="h-3.5 w-3.5 mr-1" /> Edit
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onDelete(student)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash className="h-3.5 w-3.5 mr-1" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
};
