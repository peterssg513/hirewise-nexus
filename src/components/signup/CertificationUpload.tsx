
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Upload, 
  Loader2
} from 'lucide-react';
import CertificationList from './CertificationList';
import { 
  Certification, 
  uploadCertificationFile, 
  saveCertifications 
} from '@/services/certificationService';

interface CertificationUploadProps {
  onComplete: () => void;
}

const CertificationUpload: React.FC<CertificationUploadProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [certName, setCertName] = useState('');
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !certName.trim()) {
      if (!certName.trim()) {
        toast({
          title: 'Certification name required',
          description: 'Please enter a name for your certification before uploading.',
          variant: 'destructive',
        });
      }
      return;
    }
    
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a PDF, JPG, or PNG file.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setUploadingFile(true);
      
      const newCert = await uploadCertificationFile(user.id, file, certName);
      
      setCertifications([...certifications, newCert]);
      setCertName('');
      
      toast({
        title: 'Certification uploaded',
        description: 'Your certification has been uploaded and is pending verification.',
      });
    } catch (error: any) {
      toast({
        title: 'Error uploading certification',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setUploadingFile(false);
    }
  };
  
  const handleRemoveCertification = (id: string) => {
    setCertifications(certifications.filter(cert => cert.id !== id));
  };
  
  const handleSubmit = async () => {
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
        description: 'Please upload at least one certification to continue.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await saveCertifications(user.id, certifications);
      
      toast({
        title: 'Certifications saved',
        description: 'Your certifications have been saved and are pending verification.',
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
      <h2 className="text-2xl font-bold text-psyched-darkBlue mb-6">Upload Certifications</h2>
      
      <div className="mb-8">
        <p className="text-gray-600 mb-4">
          Please upload your professional certifications. Acceptable formats include PDF, JPG, and PNG.
          All certifications will be verified by our administrators.
        </p>
        
        <div className="p-4 bg-blue-50 rounded-md mb-6 flex items-start">
          <div className="text-blue-500 mr-3 mt-1">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
            </svg>
          </div>
          <div className="text-sm text-blue-700">
            Certification verification typically takes 1-2 business days. You can continue with the signup process while your certifications are being verified.
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Certification Name</label>
          <Input
            type="text"
            placeholder="e.g., School Psychology License, NCSP"
            value={certName}
            onChange={(e) => setCertName(e.target.value)}
            className="mb-3"
          />
          
          <label className="cursor-pointer bg-psyched-lightBlue hover:bg-psyched-lightBlue/90 text-white py-2 px-4 rounded flex items-center justify-center">
            <Upload className="w-4 h-4 mr-2" />
            {uploadingFile ? 'Uploading...' : 'Upload Certification'}
            <input 
              type="file" 
              className="hidden" 
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              disabled={uploadingFile || !certName.trim()}
            />
          </label>
        </div>
        
        <CertificationList 
          certifications={certifications} 
          onRemove={handleRemoveCertification} 
        />
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit} 
          className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </span>
          ) : "Continue to Preferences"}
        </Button>
      </div>
    </div>
  );
};

export default CertificationUpload;
