import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { File, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { 
  saveCertifications, 
  uploadCertificationFile,
  Certification 
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
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showCertificationForm, setShowCertificationForm] = useState(false);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Load existing certifications from local storage or database if needed
  }, []);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setShowCertificationForm(true);
    }
  };
  
  const handleAddCertification = async (certification: Certification) => {
    if (!user || !selectedFile) {
      toast({
        title: 'Missing information',
        description: 'Please select a file and enter certification details.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Upload the file and get the URL
      const fileUrl = await uploadCertificationFile(user.id, selectedFile, certification.name);
      
      // Create a new certification object with the file URL
      const newCertification: Certification = {
        ...certification,
        url: fileUrl,
        documentUrl: fileUrl, // Set documentUrl for Profile view compatibility
        status: 'pending',
        uploadedAt: new Date().toISOString(),
        date: certification.startYear, // Set date for Profile view compatibility
      };
      
      setCertifications(prev => [...prev, newCertification]);
      setSelectedFile(null);
      setShowCertificationForm(false);
      
      toast({
        title: 'Certification uploaded',
        description: 'Your certification has been uploaded successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error uploading certification',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
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
        description: 'Please upload at least one certification.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Save certifications with extended data (start/end years)
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
  
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-psyched-darkBlue mb-6">Upload Your Certifications</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium">Add Certification</label>
          
          {!showCertificationForm && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="space-y-2">
                <div className="flex justify-center">
                  <File className="h-12 w-12 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">
                  Upload your certification files (PDF, JPG, PNG)
                </p>
                <div>
                  <label className="cursor-pointer bg-psyched-lightBlue hover:bg-psyched-lightBlue/90 text-white py-2 px-4 rounded inline-flex items-center">
                    <Upload className="w-4 h-4 mr-2" />
                    {isUploading ? 'Uploading...' : 'Select File'}
                    <input 
                      type="file" 
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
          
          {showCertificationForm && selectedFile && (
            <CertificationForm 
              file={selectedFile}
              onAdd={handleAddCertification}
              onCancel={() => {
                setShowCertificationForm(false);
                setSelectedFile(null);
              }}
            />
          )}
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Your Certifications</h3>
          
          <CertificationList 
            certifications={certifications} 
            onRemove={handleRemoveCertification} 
          />
          
          {certifications.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No certifications added yet. Please upload your certifications.
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
