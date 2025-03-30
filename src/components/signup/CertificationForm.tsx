
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Certification } from '@/services/certificationService';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page refresh
    
    const newCertification: Certification = {
      id: uuidv4(),
      ...formData,
    };
    
    onAdd(newCertification);
    setFormData({ name: '', startYear: '', endYear: '', issuer: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-md bg-gray-50">
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
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90 text-white">
          Add Certification
        </Button>
      </div>
    </form>
  );
};

export default CertificationForm;
