
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, FileEdit, Briefcase, ClipboardList, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfileHeaderProps {
  profileData: any;
  onEditProfile: () => void;
}

const ProfileHeader = ({ profileData, onEditProfile }: ProfileHeaderProps) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  console.log("ProfileHeader - Profile Picture URL:", profileData.profile_picture_url);
  console.log("ProfileHeader - Profile Data:", profileData);

  return (
    <motion.div 
      className="w-full md:w-1/3 bg-white rounded-lg shadow-sm p-6 border border-gray-100"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col items-center text-center">
        <motion.div variants={itemVariants}>
          <Avatar className="h-32 w-32 mb-4 ring-4 ring-psyched-cream shadow-md">
            {profileData.profile_picture_url ? (
              <AvatarImage 
                src={profileData.profile_picture_url} 
                alt={profileData.profiles?.name || 'User'} 
                className="object-cover"
              />
            ) : (
              <AvatarFallback className="text-2xl bg-psyched-lightBlue text-white">
                {profileData.profiles?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
              </AvatarFallback>
            )}
          </Avatar>
        </motion.div>
        
        <motion.h2 variants={itemVariants} className="text-2xl font-bold text-psyched-darkBlue">
          {profileData.profiles?.name || 'Anonymous User'}
        </motion.h2>
        
        <motion.p variants={itemVariants} className="text-gray-600 mb-3">
          {profileData.profiles?.email}
        </motion.p>
        
        <motion.div variants={itemVariants}>
          {profileData.status === 'approved' ? (
            <Badge className="bg-green-500 text-white hover:bg-green-600">Verified Psychologist</Badge>
          ) : (
            <Badge variant="outline" className="border-yellow-500 text-yellow-700 hover:bg-yellow-50">
              Verification Pending
            </Badge>
          )}
        </motion.div>
        
        {profileData.city && profileData.state && (
          <motion.div variants={itemVariants} className="flex items-center gap-1 mt-3 text-gray-600">
            <MapPin className="h-4 w-4 text-psyched-lightBlue" />
            <span>{profileData.city}, {profileData.state}</span>
          </motion.div>
        )}
        
        <motion.div variants={itemVariants}>
          <Button 
            className="mt-6 bg-psyched-darkBlue hover:bg-psyched-darkBlue/80 text-white transition-all duration-300 transform hover:scale-105"
            size="sm"
            onClick={onEditProfile}
          >
            <FileEdit className="h-4 w-4 mr-2" /> Edit Profile
          </Button>
        </motion.div>
      </div>
      
      <div className="mt-8 space-y-6">
        <motion.div variants={itemVariants} className="space-y-2">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-psyched-orange" />
            <h3 className="font-medium text-psyched-darkBlue">Work Preferences</h3>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {profileData.work_types?.map((type: string) => (
              <Badge key={type} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                {type}
              </Badge>
            ))}
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="space-y-2">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-psyched-lightBlue" />
            <h3 className="font-medium text-psyched-darkBlue">Evaluation Types</h3>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {profileData.evaluation_types?.map((type: string) => (
              <Badge key={type} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100">
                {type}
              </Badge>
            ))}
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-psyched-darkBlue" />
            <h3 className="font-medium text-psyched-darkBlue">Desired Locations</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {profileData.desired_locations?.map((location: string) => (
              <Badge key={location} variant="outline" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
                {location}
              </Badge>
            ))}
          </div>
        </motion.div>
        
        {profileData.open_to_relocation && (
          <motion.div variants={itemVariants} className="pt-2">
            <Badge className="bg-psyched-lightBlue text-white hover:bg-psyched-lightBlue/90">
              Open to Relocation
            </Badge>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ProfileHeader;
