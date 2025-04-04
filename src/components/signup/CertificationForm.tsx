
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Certification } from '@/services/certificationService';
import { Loader2 } from 'lucide-react';

interface CertificationFormProps {
  onAdd: (certification: Certification) => void;
  onCancel: () => void;
}

const CertificationForm: React.FC<CertificationFormProps> = ({ onAdd, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    startYear: '',
    endYear: '',
    issuer: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior
    
    setIsSubmitting(true);
    
    try {
      const newCertification: Certification = {
        id: uuidv4(),
        ...formData,
      };
      
      onAdd(newCertification);
      setFormData({ name: '', startYear: '', endYear: '', issuer: '' });
    } catch (error) {
      console.error('Error adding certification:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 border rounded-md bg-gray-50">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">Certification Name</label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g. Licensed School Psychologist"
          />
        </div>
        
        <div>
          <label htmlFor="issuer" className="block text-sm font-medium mb-1">Issuing Organization</label>
          <Input
            id="issuer"
            name="issuer"
            value={formData.issuer}
            onChange={handleChange}
            placeholder="e.g. State Board of Psychology"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startYear" className="block text-sm font-medium mb-1">Start Year</label>
            <Input
              id="startYear"
              name="startYear"
              value={formData.startYear}
              onChange={handleChange}
              required
              placeholder="YYYY"
            />
          </div>
          
          <div>
            <label htmlFor="endYear" className="block text-sm font-medium mb-1">Expiration Year</label>
            <Input
              id="endYear"
              name="endYear"
              value={formData.endYear}
              onChange={handleChange}
              required
              placeholder="YYYY"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 mt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="button" 
          onClick={handleSubmit} 
          className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              Adding...
            </span>
          ) : 'Add Certification'}
        </Button>
      </div>
    </div>
  );
};

export default CertificationForm;
