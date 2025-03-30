
import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Trash } from 'lucide-react';
import { Education } from './EducationForm';

interface EducationListProps {
  education: Education[];
  onEdit: (education: Education) => void;
  onDelete: (id: string) => void;
}

const EducationList: React.FC<EducationListProps> = ({ 
  education, 
  onEdit, 
  onDelete 
}) => {
  if (education.length === 0) {
    return (
      <p className="text-gray-500 text-center py-4">
        No education added yet. Please add your educational background.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {education.map((edu) => (
        <li key={edu.id} className="border p-3 rounded bg-gray-50">
          <div className="flex justify-between">
            <div>
              <h4 className="font-medium">{edu.schoolName}</h4>
              <p className="text-sm text-gray-600">{edu.major}</p>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onEdit(edu)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onDelete(edu.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default EducationList;
