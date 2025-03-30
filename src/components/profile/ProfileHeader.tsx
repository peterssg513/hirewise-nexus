
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, FileEdit } from 'lucide-react';

interface ProfileHeaderProps {
  profileData: any;
  onEditProfile: () => void;
}

const ProfileHeader = ({ profileData, onEditProfile }: ProfileHeaderProps) => {
  return (
    <div className="w-full md:w-1/3 bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col items-center text-center">
        <Avatar className="h-32 w-32 mb-4">
          {profileData.profile_picture_url ? (
            <AvatarImage src={profileData.profile_picture_url} alt={profileData.profiles?.name || 'User'} />
          ) : (
            <AvatarFallback className="text-2xl bg-psyched-lightBlue text-white">
              {profileData.profiles?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
            </AvatarFallback>
          )}
        </Avatar>
        <h2 className="text-2xl font-bold">{profileData.profiles?.name || 'Anonymous User'}</h2>
        <p className="text-gray-600 mb-3">{profileData.profiles?.email}</p>
        
        {profileData.status === 'approved' ? (
          <Badge className="bg-green-500">Verified Psychologist</Badge>
        ) : (
          <Badge variant="outline" className="border-yellow-500 text-yellow-700">
            Verification Pending
          </Badge>
        )}
        
        {profileData.city && profileData.state && (
          <div className="flex items-center gap-1 mt-3 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{profileData.city}, {profileData.state}</span>
          </div>
        )}
        
        <Button 
          className="mt-6 bg-psyched-darkBlue hover:bg-psyched-darkBlue/80"
          size="sm"
          onClick={onEditProfile}
        >
          <FileEdit className="h-4 w-4 mr-2" /> Edit Profile
        </Button>
      </div>
      
      <div className="mt-8">
        <h3 className="font-medium text-gray-900 mb-2">Work Preferences</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {profileData.work_types?.map((type: string) => (
            <Badge key={type} variant="outline" className="bg-blue-50">
              {type}
            </Badge>
          ))}
        </div>
        
        <h3 className="font-medium text-gray-900 mb-2">Evaluation Types</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {profileData.evaluation_types?.map((type: string) => (
            <Badge key={type} variant="outline" className="bg-purple-50">
              {type}
            </Badge>
          ))}
        </div>
        
        <h3 className="font-medium text-gray-900 mb-2">Desired Locations</h3>
        <div className="flex flex-wrap gap-2">
          {profileData.desired_locations?.map((location: string) => (
            <Badge key={location} variant="outline" className="bg-green-50">
              {location}
            </Badge>
          ))}
        </div>
        
        {profileData.open_to_relocation && (
          <Badge className="mt-2 bg-psyched-lightBlue">Open to Relocation</Badge>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
