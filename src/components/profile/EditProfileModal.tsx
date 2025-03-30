
import React, { useState } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  section: 'basic' | 'experience' | 'education' | 'certification' | null;
  itemId: string | null;
  profileData: any;
  experienceData?: any;
  educationData?: any;
  certificationData?: any;
}

// Type definitions to help with form data
type BasicFormData = {
  name: string;
  email: string;
  phone_number: string;
  city: string;
  state: string;
  zip_code: string;
  bio: string;
};

type ExperienceFormData = {
  position: string;
  organization: string;
  startDate: string;
  endDate: string;
  description: string;
  current: boolean;
};

type EducationFormData = {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
};

type CertificationFormData = {
  name: string;
  issuingAuthority: string;
  startYear: string;
  expirationDate: string;
  description: string;
  documentUrl: string;
};

type FormDataType = BasicFormData | ExperienceFormData | EducationFormData | CertificationFormData;

const EditProfileModal = ({
  isOpen,
  onClose,
  onSave,
  section,
  itemId,
  profileData,
  experienceData,
  educationData,
  certificationData
}: EditProfileModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormDataType>(() => {
    // Initialize form data based on section and itemId
    if (section === 'basic') {
      return {
        name: profileData.name || '',
        email: profileData.email || '',
        phone_number: profileData.phone_number || '',
        city: profileData.city || '',
        state: profileData.state || '',
        zip_code: profileData.zip_code || '',
        bio: profileData.bio || ''
      } as BasicFormData;
    } else if (section === 'experience' && experienceData) {
      return {
        position: experienceData.position || '',
        organization: experienceData.organization || '',
        startDate: experienceData.startDate || '',
        endDate: experienceData.endDate || '',
        description: experienceData.description || '',
        current: experienceData.current || false
      } as ExperienceFormData;
    } else if (section === 'education' && educationData) {
      return {
        institution: educationData.institution || '',
        degree: educationData.degree || '',
        field: educationData.field || '',
        startDate: educationData.startDate || '',
        endDate: educationData.endDate || ''
      } as EducationFormData;
    } else if (section === 'certification' && certificationData) {
      return {
        name: certificationData.name || '',
        issuingAuthority: certificationData.issuingAuthority || '',
        startYear: certificationData.startYear || '',
        expirationDate: certificationData.expirationDate || '',
        description: certificationData.description || '',
        documentUrl: certificationData.documentUrl || ''
      } as CertificationFormData;
    } else if (section === 'experience') {
      return {
        position: '',
        organization: '',
        startDate: '',
        endDate: '',
        description: '',
        current: false
      } as ExperienceFormData;
    } else if (section === 'education') {
      return {
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: ''
      } as EducationFormData;
    } else if (section === 'certification') {
      return {
        name: '',
        issuingAuthority: '',
        startYear: '',
        expirationDate: '',
        description: '',
        documentUrl: ''
      } as CertificationFormData;
    }
    
    // Default empty basic data
    return {
      name: '',
      email: '',
      phone_number: '',
      city: '',
      state: '',
      zip_code: '',
      bio: ''
    } as BasicFormData;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    if (section === 'experience') {
      setFormData(prev => ({ 
        ...prev as ExperienceFormData, 
        current: checked 
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTitle = () => {
    switch (section) {
      case 'basic':
        return 'Edit Contact Information';
      case 'experience':
        return itemId ? 'Edit Experience' : 'Add Experience';
      case 'education':
        return itemId ? 'Edit Education' : 'Add Education';
      case 'certification':
        return itemId ? 'Edit Certification' : 'Add Certification';
      default:
        return 'Edit Profile';
    }
  };

  const renderForm = () => {
    switch (section) {
      case 'basic':
        return (
          <>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your email address"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  placeholder="Your phone number"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="State"
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="zip_code">Zip Code</Label>
                <Input
                  id="zip_code"
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleInputChange}
                  placeholder="Zip code"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="bio">About Me</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself"
                  rows={5}
                />
              </div>
            </div>
          </>
        );
      
      case 'experience':
        return (
          <>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  placeholder="Job title"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  placeholder="Company or organization name"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    disabled={formData.current}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="current" 
                  checked={formData.current} 
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="current">I currently work here</Label>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your responsibilities and accomplishments"
                  rows={3}
                />
              </div>
            </div>
          </>
        );
      
      case 'education':
        return (
          <>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="institution">Institution</Label>
                <Input
                  id="institution"
                  name="institution"
                  value={formData.institution}
                  onChange={handleInputChange}
                  placeholder="School or university name"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="degree">Degree</Label>
                <Input
                  id="degree"
                  name="degree"
                  value={formData.degree}
                  onChange={handleInputChange}
                  placeholder="e.g., Bachelor's, Master's, Ph.D."
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="field">Field of Study</Label>
                <Input
                  id="field"
                  name="field"
                  value={formData.field}
                  onChange={handleInputChange}
                  placeholder="e.g., Psychology, Education"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </>
        );
      
      case 'certification':
        return (
          <>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Certification Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Name of certification or license"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="issuingAuthority">Issuing Authority</Label>
                <Input
                  id="issuingAuthority"
                  name="issuingAuthority"
                  value={formData.issuingAuthority}
                  onChange={handleInputChange}
                  placeholder="Organization that issued the certification"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startYear">Issue Date</Label>
                  <Input
                    id="startYear"
                    name="startYear"
                    type="date"
                    value={formData.startYear}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="expirationDate">Expiration Date</Label>
                  <Input
                    id="expirationDate"
                    name="expirationDate"
                    type="date"
                    value={formData.expirationDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="documentUrl">License Number or URL</Label>
                <Input
                  id="documentUrl"
                  name="documentUrl"
                  value={formData.documentUrl}
                  onChange={handleInputChange}
                  placeholder="License number or URL to the document"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide additional details about this certification"
                  rows={3}
                />
              </div>
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{renderTitle()}</DialogTitle>
          <DialogDescription>
            Update your profile information. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          {renderForm()}
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );

  // Helper functions
  function renderTitle() {
    switch (section) {
      case 'basic':
        return 'Edit Contact Information';
      case 'experience':
        return itemId ? 'Edit Experience' : 'Add Experience';
      case 'education':
        return itemId ? 'Edit Education' : 'Add Education';
      case 'certification':
        return itemId ? 'Edit Certification' : 'Add Certification';
      default:
        return 'Edit Profile';
    }
  }

  function renderForm() {
    switch (section) {
      case 'basic':
        return (
          <>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={(formData as BasicFormData).name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={(formData as BasicFormData).email}
                  onChange={handleInputChange}
                  placeholder="Your email address"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  value={(formData as BasicFormData).phone_number}
                  onChange={handleInputChange}
                  placeholder="Your phone number"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={(formData as BasicFormData).city}
                    onChange={handleInputChange}
                    placeholder="City"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={(formData as BasicFormData).state}
                    onChange={handleInputChange}
                    placeholder="State"
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="zip_code">Zip Code</Label>
                <Input
                  id="zip_code"
                  name="zip_code"
                  value={(formData as BasicFormData).zip_code}
                  onChange={handleInputChange}
                  placeholder="Zip code"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="bio">About Me</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={(formData as BasicFormData).bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself"
                  rows={5}
                />
              </div>
            </div>
          </>
        );
      
      case 'experience':
        return (
          <>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  name="position"
                  value={(formData as ExperienceFormData).position}
                  onChange={handleInputChange}
                  placeholder="Job title"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  name="organization"
                  value={(formData as ExperienceFormData).organization}
                  onChange={handleInputChange}
                  placeholder="Company or organization name"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={(formData as ExperienceFormData).startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={(formData as ExperienceFormData).endDate}
                    onChange={handleInputChange}
                    disabled={(formData as ExperienceFormData).current}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="current" 
                  checked={(formData as ExperienceFormData).current} 
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="current">I currently work here</Label>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={(formData as ExperienceFormData).description}
                  onChange={handleInputChange}
                  placeholder="Describe your responsibilities and accomplishments"
                  rows={3}
                />
              </div>
            </div>
          </>
        );
      
      case 'education':
        return (
          <>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="institution">Institution</Label>
                <Input
                  id="institution"
                  name="institution"
                  value={(formData as EducationFormData).institution}
                  onChange={handleInputChange}
                  placeholder="School or university name"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="degree">Degree</Label>
                <Input
                  id="degree"
                  name="degree"
                  value={(formData as EducationFormData).degree}
                  onChange={handleInputChange}
                  placeholder="e.g., Bachelor's, Master's, Ph.D."
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="field">Field of Study</Label>
                <Input
                  id="field"
                  name="field"
                  value={(formData as EducationFormData).field}
                  onChange={handleInputChange}
                  placeholder="e.g., Psychology, Education"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={(formData as EducationFormData).startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={(formData as EducationFormData).endDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </>
        );
      
      case 'certification':
        return (
          <>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Certification Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={(formData as CertificationFormData).name}
                  onChange={handleInputChange}
                  placeholder="Name of certification or license"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="issuingAuthority">Issuing Authority</Label>
                <Input
                  id="issuingAuthority"
                  name="issuingAuthority"
                  value={(formData as CertificationFormData).issuingAuthority}
                  onChange={handleInputChange}
                  placeholder="Organization that issued the certification"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startYear">Issue Date</Label>
                  <Input
                    id="startYear"
                    name="startYear"
                    type="date"
                    value={(formData as CertificationFormData).startYear}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="expirationDate">Expiration Date</Label>
                  <Input
                    id="expirationDate"
                    name="expirationDate"
                    type="date"
                    value={(formData as CertificationFormData).expirationDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="documentUrl">License Number or URL</Label>
                <Input
                  id="documentUrl"
                  name="documentUrl"
                  value={(formData as CertificationFormData).documentUrl}
                  onChange={handleInputChange}
                  placeholder="License number or URL to the document"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={(formData as CertificationFormData).description}
                  onChange={handleInputChange}
                  placeholder="Provide additional details about this certification"
                  rows={3}
                />
              </div>
            </div>
          </>
        );
      
      default:
        return null;
    }
  }
};

export default EditProfileModal;
