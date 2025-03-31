
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { updateDistrictProfile } from '@/services/districtProfileService';
import { useAuth } from '@/contexts/AuthContext';
import { District } from '@/types/district';
import { 
  Building, 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  User, 
  School, 
  FileEdit 
} from 'lucide-react';

interface DistrictProfileProps {
  district: District;
  onProfileUpdated?: (updatedDistrict: District) => void;
  embedded?: boolean;
}

export const DistrictProfile: React.FC<DistrictProfileProps> = ({ 
  district, 
  onProfileUpdated,
  embedded = false 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(district);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      await updateDistrictProfile(user.id, formData);
      
      toast({
        title: "Profile updated",
        description: "Your district profile has been updated successfully.",
      });
      
      setIsEditing(false);
      
      if (onProfileUpdated) {
        onProfileUpdated(formData);
      }
    } catch (error) {
      console.error('Error updating district profile:', error);
      
      toast({
        title: "Error updating profile",
        description: "Failed to update your district profile. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(district);
    setIsEditing(false);
  };

  const cardClasses = embedded ? "border-0 shadow-none" : "";

  return (
    <div className="space-y-6">
      <Card className={cardClasses}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{embedded ? "District Information" : "District Profile"}</CardTitle>
            <CardDescription>
              {embedded ? "View and edit your district details" : "Manage your district information and contact details"}
            </CardDescription>
          </div>
          
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <FileEdit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button onClick={handleCancel} variant="outline">
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="name">District Name</label>
                {isEditing ? (
                  <Input
                    id="name"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    placeholder="Enter district name"
                  />
                ) : (
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{district.name || 'Not specified'}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="location">Location</label>
                {isEditing ? (
                  <Input
                    id="location"
                    name="location"
                    value={formData.location || ''}
                    onChange={handleChange}
                    placeholder="Enter district location"
                  />
                ) : (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{district.location || 'Not specified'}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="website">Website</label>
                {isEditing ? (
                  <Input
                    id="website"
                    name="website"
                    value={formData.website || ''}
                    onChange={handleChange}
                    placeholder="Enter district website"
                  />
                ) : (
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-gray-500" />
                    {district.website ? (
                      <a href={district.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {district.website}
                      </a>
                    ) : (
                      <span>Not specified</span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="district_size">District Size</label>
                {isEditing ? (
                  <Input
                    id="district_size"
                    name="district_size"
                    value={formData.district_size || ''}
                    onChange={handleChange}
                    placeholder="Enter district size"
                    type="number"
                  />
                ) : (
                  <div className="flex items-center">
                    <School className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{district.district_size || 'Not specified'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-medium mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="first_name">First Name</label>
                {isEditing ? (
                  <Input
                    id="first_name"
                    name="first_name"
                    value={formData.first_name || ''}
                    onChange={handleChange}
                    placeholder="Enter first name"
                  />
                ) : (
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{district.first_name || 'Not specified'}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="last_name">Last Name</label>
                {isEditing ? (
                  <Input
                    id="last_name"
                    name="last_name"
                    value={formData.last_name || ''}
                    onChange={handleChange}
                    placeholder="Enter last name"
                  />
                ) : (
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{district.last_name || 'Not specified'}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="contact_email">Contact Email</label>
                {isEditing ? (
                  <Input
                    id="contact_email"
                    name="contact_email"
                    value={formData.contact_email || ''}
                    onChange={handleChange}
                    placeholder="Enter contact email"
                  />
                ) : (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{district.contact_email || 'Not specified'}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="contact_phone">Contact Phone</label>
                {isEditing ? (
                  <Input
                    id="contact_phone"
                    name="contact_phone"
                    value={formData.contact_phone || ''}
                    onChange={handleChange}
                    placeholder="Enter contact phone"
                  />
                ) : (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{district.contact_phone || 'Not specified'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div>
            <h3 className="text-lg font-medium mb-4">Description</h3>
            <div className="space-y-2">
              {isEditing ? (
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  placeholder="Enter district description"
                  rows={4}
                />
              ) : (
                <p className="text-gray-700">
                  {district.description || 'No description available.'}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
