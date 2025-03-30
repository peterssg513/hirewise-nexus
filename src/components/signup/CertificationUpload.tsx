
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { 
  saveCertifications, 
  Certification,
  getCertifications
} from '@/services/certificationService';
import CertificationList from './CertificationList';
import CertificationForm from './CertificationForm';

interface CertificationUploadProps {
  onComplete: () => void;
}

const CertificationUpload: React.FC<CertificationUploadProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [showCertificationForm, setShowCertificationForm] = useState(false);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Load existing certifications
    const loadCertifications = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const existingCertifications = await getCertifications(user.id);
        setCertifications(existingCertifications);
      } catch (error) {
        console.error('Error loading certifications:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCertifications();
  }, [user]);
  
  const handleAddCertification = (certification: Certification) => {
    if (!user) {
      toast({
        title: 'Authentication error',
        description: 'You must be logged in to continue',
        variant: 'destructive',
      });
      return;
    }
    
    // Create a new certification object
    const newCertification: Certification = {
      ...certification,
      status: 'pending',
      uploadedAt: new Date().toISOString(),
    };
    
    setCertifications(prev => [...prev, newCertification]);
    setShowCertificationForm(false);
    
    toast({
      title: 'Certification added',
      description: 'Your certification has been added successfully.',
    });
  };
  
  const handleRemoveCertification = (id: string) => {
    setCertifications(prevCerts => prevCerts.filter(cert => cert.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Authentication error',
        description: 'You must be logged in to continue',
        variant: 'destructive',
      });
      return;
    }
    
    if (certifications.length === 0) {
      toast({
        title: 'No certifications',
        description: 'Please add at least one certification.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Save certifications
      await saveCertifications(user.id, certifications);
      
      toast({
        title: 'Certifications saved',
        description: 'Your certifications have been saved successfully.',
      });
      
      onComplete();
    } catch (error: any) {
      toast({
        title: 'Error saving certifications',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-psyched-darkBlue" />
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-psyched-darkBlue mb-6">Your Certifications</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
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
        
        <div className="mt-6">
          <CertificationList 
            certifications={certifications} 
            onRemove={handleRemoveCertification} 
          />
          
          {certifications.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No certifications added yet. Please add your certifications.
            </p>
          )}
        </div>
        
        <div className="flex justify-between pt-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate('/psychologist-dashboard')}
            className="text-gray-600"
          >
            Skip for Now
          </Button>
          
          <Button 
            type="submit" 
            className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90 text-white" 
            disabled={isSubmitting || certifications.length === 0}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Saving...
              </span>
            ) : (
              'Continue to Preferences'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CertificationUpload;
