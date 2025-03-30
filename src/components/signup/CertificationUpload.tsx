import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { File, Upload, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { saveCertifications, uploadCertificationFile, Certification } from '@/services/certificationService';
import CertificationList from './CertificationList';

interface CertificationUploadProps {
  onComplete: () => void;
}

const CertificationUpload: React.FC<CertificationUploadProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [certificationName, setCertificationName] = useState('');
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Load existing certifications from local storage or database if needed
    // For now, let's assume they are fetched and set here
  }, []);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };
  
  const handleUpload = async () => {
    if (!user || !selectedFile || !certificationName.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please select a file and enter a certification name.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      const newCert = await uploadCertificationFile(user.id, selectedFile, certificationName);
      setCertifications(prevCerts => [...prevCerts, newCert]);
      setSelectedFile(null);
      setCertificationName('');
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
      // This will now update with just the URLs as strings, resolving the type error
      await saveCertifications(user.id, certifications);
      
      toast({
        title: 'Certifications saved',
        description: 'Your certifications have been uploaded successfully.',
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
          
          {selectedFile && (
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <File className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm font-medium truncate max-w-xs">
                    {selectedFile.name}
                  </span>
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                  className="text-red-500 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="mt-3">
                <label className="block text-sm font-medium mb-1">
                  Certification Name
                </label>
                <div className="flex space-x-2">
                  <Input
                    value={certificationName}
                    onChange={(e) => setCertificationName(e.target.value)}
                    placeholder="e.g., School Psychology Certification"
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    onClick={handleUpload}
                    className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90 text-white flex items-center"
                    disabled={isUploading || !certificationName.trim()}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="animate-spin mr-2 h-4 w-4" /> 
                        Uploading
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" /> 
                        Upload
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
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
