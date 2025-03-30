
import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Trash } from 'lucide-react';
import { Experience } from './ExperienceForm';

interface ExperienceListProps {
  experiences: Experience[];
  onEdit: (experience: Experience) => void;
  onDelete: (id: string) => void;
}

const ExperienceList: React.FC<ExperienceListProps> = ({ 
  experiences, 
  onEdit, 
  onDelete 
}) => {
  if (experiences.length === 0) {
    return (
      <p className="text-gray-500 text-center py-4">
        No experience added yet. Please add your work history.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {experiences.map((experience) => (
        <li key={experience.id} className="border p-3 rounded bg-gray-50">
          <div className="flex justify-between">
            <div>
              <h4 className="font-medium">{experience.jobTitle}</h4>
              <p className="text-sm text-gray-600">{experience.placeOfEmployment}</p>
              <p className="text-sm text-gray-500">
                {experience.yearStarted} - {experience.yearWorked}
              </p>
              {experience.description && (
                <p className="text-sm mt-1">{experience.description}</p>
              )}
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onEdit(experience)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onDelete(experience.id)}
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

export default ExperienceList;
