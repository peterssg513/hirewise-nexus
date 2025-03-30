
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import ExperienceForm, { Experience } from './ExperienceForm';
import ExperienceList from './ExperienceList';

interface ExperienceSectionProps {
  experiences: Experience[];
  onUpdateExperiences: (experiences: Experience[]) => void;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ 
  experiences,
  onUpdateExperiences
}) => {
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);

  const handleAddExperience = (experience: Experience) => {
    if (editingExperience) {
      onUpdateExperiences(
        experiences.map(exp => exp.id === editingExperience.id ? experience : exp)
      );
      setEditingExperience(null);
    } else {
      onUpdateExperiences([...experiences, experience]);
    }
    setShowExperienceForm(false);
  };

  const handleEditExperience = (experience: Experience) => {
    setEditingExperience(experience);
    setShowExperienceForm(true);
  };

  const handleDeleteExperience = (id: string) => {
    onUpdateExperiences(experiences.filter(exp => exp.id !== id));
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Experience Details</h3>
        <Button 
          type="button"
          onClick={() => {
            setEditingExperience(null);
            setShowExperienceForm(true);
          }}
          className="bg-psyched-lightBlue hover:bg-psyched-lightBlue/90 text-white"
        >
          Add Experience
        </Button>
      </div>
      
      {showExperienceForm && (
        <ExperienceForm 
          onAdd={handleAddExperience} 
          onCancel={() => {
            setShowExperienceForm(false);
            setEditingExperience(null);
          }}
          initialData={editingExperience || undefined}
          isEditing={!!editingExperience}
        />
      )}
      
      <ExperienceList 
        experiences={experiences} 
        onEdit={handleEditExperience} 
        onDelete={handleDeleteExperience} 
      />
    </div>
  );
};

export default ExperienceSection;
