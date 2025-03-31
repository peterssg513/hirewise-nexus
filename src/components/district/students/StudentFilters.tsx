
import React from 'react';
import { School } from '@/services/schoolService';
import { Student } from '@/services/studentService';

export interface FilterOption {
  value: string;
  label: string;
}

export const createStudentFilterOptions = (schools: School[], students: Student[]): FilterOption[] => {
  // Create filter options based on schools and grades
  return [
    ...schools.map(school => ({ value: school.id, label: school.name })),
    ...Array.from(new Set(students.map(s => s.grade).filter(Boolean))).map(grade => ({ 
      value: grade || '', 
      label: `Grade ${grade}` 
    }))
  ];
};
