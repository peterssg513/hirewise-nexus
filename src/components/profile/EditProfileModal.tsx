
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Experience, Education } from '@/services/psychologistSignupService';
import { Certification } from '@/services/certificationService';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  section: 'basic' | 'experience' | 'education' | 'certification' | null;
  itemId: string | null;
  profileData: any;
  experienceData?: Experience;
  educationData?: Education;
  certificationData?: Certification;
}

const EditProfileModal = ({
  isOpen,
  onClose,
  onSave,
  section,
  itemId,
  profileData,
  experienceData,
  educationData,
  certificationData,
}: EditProfileModalProps) => {
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Initialize form data based on section and whether editing existing item
    if (section === 'basic') {
      setFormData({
        bio: profileData?.bio || '',
        phone_number: profileData?.phone_number || '',
        city: profileData?.city || '',
        state: profileData?.state || '',
        zip_code: profileData?.zip_code || '',
      });
    } else if (section === 'experience' && experienceData) {
      setFormData({
        position: experienceData.position || '',
        organization: experienceData.organization || '',
        description: experienceData.description || '',
        startDate: experienceData.startDate || '',
        endDate: experienceData.endDate || '',
        current: experienceData.current || false,
      });
    } else if (section === 'experience') {
      setFormData({
        position: '',
        organization: '',
        description: '',
        startDate: '',
        endDate: '',
        current: false,
      });
    } else if (section === 'education' && educationData) {
      setFormData({
        institution: educationData.institution || '',
        field: educationData.field || '',
        degree: educationData.degree || '',
        startDate: educationData.startDate || '',
        endDate: educationData.endDate || '',
      });
    } else if (section === 'education') {
      setFormData({
        institution: '',
        field: '',
        degree: '',
        startDate: '',
        endDate: '',
      });
    } else if (section === 'certification' && certificationData) {
      setFormData({
        name: certificationData.name || '',
        issuingAuthority: certificationData.issuingAuthority || '',
        expirationDate: certificationData.expirationDate || '',
        startYear: certificationData.startYear || '',
        endYear: certificationData.endYear || '',
        description: certificationData.description || '',
        documentUrl: certificationData.documentUrl || '',
      });
    } else if (section === 'certification') {
      setFormData({
        name: '',
        issuingAuthority: '',
        expirationDate: '',
        startYear: '',
        endYear: '',
        description: '',
        documentUrl: '',
      });
    }
  }, [section, itemId, profileData, experienceData, educationData, certificationData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, current: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render form based on section
  const renderForm = () => {
    switch (section) {
      case 'basic':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio || ''}
                onChange={handleChange}
                placeholder="Tell us about yourself"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number || ''}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city || ''}
                  onChange={handleChange}
                  placeholder="Enter your city"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state || ''}
                  onChange={handleChange}
                  placeholder="Enter your state"
                />
              </div>
              <div>
                <Label htmlFor="zip_code">ZIP Code</Label>
                <Input
                  id="zip_code"
                  name="zip_code"
                  value={formData.zip_code || ''}
                  onChange={handleChange}
                  placeholder="Enter your ZIP code"
                />
              </div>
            </div>
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="position">Position/Title</Label>
              <Input
                id="position"
                name="position"
                value={formData.position || ''}
                onChange={handleChange}
                placeholder="Enter your job title"
                required
              />
            </div>
            <div>
              <Label htmlFor="organization">Organization/Company</Label>
              <Input
                id="organization"
                name="organization"
                value={formData.organization || ''}
                onChange={handleChange}
                placeholder="Enter organization name"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                placeholder="Describe your responsibilities and achievements"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  value={formData.startDate || ''}
                  onChange={handleChange}
                  placeholder="e.g., 2020"
                  required
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  value={formData.endDate || ''}
                  onChange={handleChange}
                  placeholder="e.g., 2023 or leave blank if current"
                  disabled={formData.current}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="current"
                checked={!!formData.current}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="current" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                This is my current position
              </Label>
            </div>
          </div>
        );

      case 'education':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="institution">Institution/School</Label>
              <Input
                id="institution"
                name="institution"
                value={formData.institution || ''}
                onChange={handleChange}
                placeholder="Enter school name"
                required
              />
            </div>
            <div>
              <Label htmlFor="degree">Degree</Label>
              <Input
                id="degree"
                name="degree"
                value={formData.degree || ''}
                onChange={handleChange}
                placeholder="e.g., Bachelor of Science"
                required
              />
            </div>
            <div>
              <Label htmlFor="field">Field of Study</Label>
              <Input
                id="field"
                name="field"
                value={formData.field || ''}
                onChange={handleChange}
                placeholder="e.g., Psychology"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  value={formData.startDate || ''}
                  onChange={handleChange}
                  placeholder="e.g., 2016"
                />
              </div>
              <div>
                <Label htmlFor="endDate">Completion Date</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  value={formData.endDate || ''}
                  onChange={handleChange}
                  placeholder="e.g., 2020"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 'certification':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Certification Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                placeholder="Enter certification name"
                required
              />
            </div>
            <div>
              <Label htmlFor="issuingAuthority">Issuing Authority</Label>
              <Input
                id="issuingAuthority"
                name="issuingAuthority"
                value={formData.issuingAuthority || ''}
                onChange={handleChange}
                placeholder="Enter issuing organization"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startYear">Issue Date</Label>
                <Input
                  id="startYear"
                  name="startYear"
                  value={formData.startYear || ''}
                  onChange={handleChange}
                  placeholder="e.g., 2020"
                />
              </div>
              <div>
                <Label htmlFor="expirationDate">Expiration Date</Label>
                <Input
                  id="expirationDate"
                  name="expirationDate"
                  value={formData.expirationDate || ''}
                  onChange={handleChange}
                  placeholder="e.g., 2025"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                placeholder="Provide details about this certification"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="documentUrl">Document URL (optional)</Label>
              <Input
                id="documentUrl"
                name="documentUrl"
                value={formData.documentUrl || ''}
                onChange={handleChange}
                placeholder="Link to your certification document"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Get dialog title based on section
  const getDialogTitle = () => {
    const action = itemId ? 'Edit' : 'Add';
    
    switch (section) {
      case 'basic':
        return 'Edit Profile Information';
      case 'experience':
        return `${action} Professional Experience`;
      case 'education':
        return `${action} Education`;
      case 'certification':
        return `${action} Certification`;
      default:
        return 'Edit Profile';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
            <DialogDescription>
              {itemId ? 'Update your information below.' : 'Fill in the details below to add new information.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {renderForm()}
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
