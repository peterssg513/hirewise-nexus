
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import CertificationForm from './CertificationForm';
import { Certification } from '@/services/certificationService';

interface CertificationFormSectionProps {
  certifications: Certification[];
  onAddCertification: (certification: Certification) => void;
}

const CertificationFormSection: React.FC<CertificationFormSectionProps> = ({ 
  certifications, 
  onAddCertification 
}) => {
  const [showCertificationForm, setShowCertificationForm] = useState(false);
  
  const handleAddCertification = (certification: Certification) => {
    onAddCertification(certification);
    setShowCertificationForm(false);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium">Certifications</label>
        {!showCertificationForm && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setShowCertificationForm(true)}
            className="text-psyched-darkBlue border-psyched-darkBlue"
          >
            Add Certification
          </Button>
        )}
      </div>
      
      {showCertificationForm && (
        <CertificationForm 
          onAdd={handleAddCertification}
          onCancel={() => setShowCertificationForm(false)}
        />
      )}
    </div>
  );
};

export default CertificationFormSection;
