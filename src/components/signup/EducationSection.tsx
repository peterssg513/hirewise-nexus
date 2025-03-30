
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import EducationForm, { Education } from './EducationForm';
import EducationList from './EducationList';

interface EducationSectionProps {
  education: Education[];
  onUpdateEducation: (education: Education[]) => void;
}

const EducationSection: React.FC<EducationSectionProps> = ({ 
  education,
  onUpdateEducation
}) => {
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);

  const handleAddEducation = (newEducation: Education) => {
    if (editingEducation) {
      onUpdateEducation(
        education.map(edu => edu.id === editingEducation.id ? newEducation : edu)
      );
      setEditingEducation(null);
    } else {
      onUpdateEducation([...education, newEducation]);
    }
    setShowEducationForm(false);
  };

  const handleEditEducation = (edu: Education) => {
    setEditingEducation(edu);
    setShowEducationForm(true);
  };

  const handleDeleteEducation = (id: string) => {
    onUpdateEducation(education.filter(edu => edu.id !== id));
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Education Details</h3>
        <Button 
          type="button"
          onClick={() => {
            setEditingEducation(null);
            setShowEducationForm(true);
          }}
          className="bg-psyched-lightBlue hover:bg-psyched-lightBlue/90 text-white"
        >
          Add Education
        </Button>
      </div>
      
      {showEducationForm && (
        <EducationForm 
          onAdd={handleAddEducation} 
          onCancel={() => {
            setShowEducationForm(false);
            setEditingEducation(null);
          }}
          initialData={editingEducation || undefined}
          isEditing={!!editingEducation}
        />
      )}
      
      <EducationList 
        education={education} 
        onEdit={handleEditEducation} 
        onDelete={handleDeleteEducation} 
      />
    </div>
  );
};

export default EducationSection;
