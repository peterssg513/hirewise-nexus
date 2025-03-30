
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FileEdit, Trash2, Plus, Award, GraduationCap, Briefcase, Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import EditProfileModal from './EditProfileModal';

interface ProfileDetailsProps {
  profileData: any;
  onProfileUpdate: () => void;
}

const ProfileDetails = ({ profileData, onProfileUpdate }: ProfileDetailsProps) => {
  const [showAddExperience, setShowAddExperience] = useState(false);
  const [showAddEducation, setShowAddEducation] = useState(false);
  const [showAddCertification, setShowAddCertification] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<any>(null);
  const [currentEducation, setCurrentEducation] = useState<any>(null);
  const [currentCertification, setCurrentCertification] = useState<any>(null);
  
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

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const handleEditExperience = (experience: any) => {
    setCurrentExperience(experience);
    setShowAddExperience(true);
  };

  const handleEditEducation = (education: any) => {
    setCurrentEducation(education);
    setShowAddEducation(true);
  };

  const handleEditCertification = (certification: any) => {
    setCurrentCertification(certification);
    setShowAddCertification(true);
  };

  const handleAddExperience = () => {
    setCurrentExperience(null);
    setShowAddExperience(true);
  };

  const handleAddEducation = () => {
    setCurrentEducation(null);
    setShowAddEducation(true);
  };

  const handleAddCertification = () => {
    setCurrentCertification(null);
    setShowAddCertification(true);
  };

  const handleModalClose = () => {
    setShowAddExperience(false);
    setShowAddEducation(false);
    setShowAddCertification(false);
    setCurrentExperience(null);
    setCurrentEducation(null);
    setCurrentCertification(null);
    onProfileUpdate();
  };

  return (
    <motion.div 
      className="w-full md:w-2/3 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm border border-gray-100">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-psyched-darkBlue">About Me</h3>
            </div>
            
            <div className="space-y-4">
              {profileData.bio ? (
                <p className="text-gray-700">{profileData.bio}</p>
              ) : (
                <p className="text-gray-500 italic">No bio information added yet.</p>
              )}
              
              {profileData.city && profileData.state && (
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin className="h-4 w-4 text-psyched-lightBlue" />
                  <span>{profileData.city}, {profileData.state}</span>
                </div>
              )}
              
              <div className="pt-2">
                <div className="flex flex-wrap gap-2">
                  {profileData.languages?.map((language: string, index: number) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {language}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm border border-gray-100">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Award className="h-5 w-5 text-psyched-orange mr-2" />
                <h3 className="text-xl font-semibold text-psyched-darkBlue">Certifications & Licenses</h3>
              </div>
              <Button onClick={handleAddCertification} variant="outline" className="group text-psyched-darkBlue border-psyched-darkBlue hover:bg-psyched-darkBlue hover:text-white gap-1">
                <Plus className="h-4 w-4 group-hover:text-white" />
                Add
              </Button>
            </div>
            
            {profileData.certifications && profileData.certifications.length > 0 ? (
              <div className="space-y-4">
                {profileData.certifications.map((cert: any, index: number) => (
                  <div key={index} className="relative group p-4 border border-gray-100 rounded-md hover:border-psyched-lightBlue hover:bg-blue-50/30 transition-colors">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEditCertification(cert)} className="h-8 w-8 rounded-full hover:bg-blue-100">
                        <FileEdit className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-red-100">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <h4 className="font-medium text-psyched-darkBlue">{cert.name}</h4>
                    <p className="text-sm text-gray-600">{cert.issuer}</p>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Issued: {formatDate(cert.issue_date)}</span>
                      {cert.expiry_date && (
                        <span className="ml-2">• Expires: {formatDate(cert.expiry_date)}</span>
                      )}
                    </div>
                    {cert.license_number && (
                      <p className="text-sm text-gray-600 mt-1">License: {cert.license_number}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No certifications added yet.</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm border border-gray-100">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <GraduationCap className="h-5 w-5 text-psyched-lightBlue mr-2" />
                <h3 className="text-xl font-semibold text-psyched-darkBlue">Education</h3>
              </div>
              <Button onClick={handleAddEducation} variant="outline" className="group text-psyched-darkBlue border-psyched-darkBlue hover:bg-psyched-darkBlue hover:text-white gap-1">
                <Plus className="h-4 w-4 group-hover:text-white" />
                Add
              </Button>
            </div>
            
            {profileData.education && profileData.education.length > 0 ? (
              <div className="space-y-4">
                {profileData.education.map((edu: any, index: number) => (
                  <div key={index} className="relative group p-4 border border-gray-100 rounded-md hover:border-psyched-lightBlue hover:bg-blue-50/30 transition-colors">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEditEducation(edu)} className="h-8 w-8 rounded-full hover:bg-blue-100">
                        <FileEdit className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-red-100">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <h4 className="font-medium text-psyched-darkBlue">{edu.degree}</h4>
                    <p className="text-sm text-gray-600">{edu.institution}</p>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{formatDate(edu.start_date)} - {formatDate(edu.end_date)}</span>
                    </div>
                    {edu.field_of_study && (
                      <p className="text-sm text-gray-600 mt-1">{edu.field_of_study}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No education history added yet.</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm border border-gray-100">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 text-psyched-yellow mr-2" />
                <h3 className="text-xl font-semibold text-psyched-darkBlue">Professional Experience</h3>
              </div>
              <Button onClick={handleAddExperience} variant="outline" className="group text-psyched-darkBlue border-psyched-darkBlue hover:bg-psyched-darkBlue hover:text-white gap-1">
                <Plus className="h-4 w-4 group-hover:text-white" />
                Add
              </Button>
            </div>
            
            {profileData.experience && profileData.experience.length > 0 ? (
              <div className="space-y-4">
                {profileData.experience.map((exp: any, index: number) => (
                  <div key={index} className="relative group p-4 border border-gray-100 rounded-md hover:border-psyched-lightBlue hover:bg-blue-50/30 transition-colors">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEditExperience(exp)} className="h-8 w-8 rounded-full hover:bg-blue-100">
                        <FileEdit className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-red-100">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <h4 className="font-medium text-psyched-darkBlue">{exp.title}</h4>
                    <p className="text-sm text-gray-600">{exp.company}</p>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{formatDate(exp.start_date)} - {formatDate(exp.end_date)}</span>
                    </div>
                    {exp.description && (
                      <p className="text-sm text-gray-600 mt-2">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No professional experience added yet.</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm border border-gray-100">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-psyched-darkBlue">Verification Status</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-3">
                  {profileData.status === "approved" ? (
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Award className="h-5 w-5 text-green-600" />
                    </div>
                  ) : profileData.status === "rejected" ? (
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      <Award className="h-5 w-5 text-red-500" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Award className="h-5 w-5 text-yellow-500" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-psyched-darkBlue">
                    {profileData.status === "approved" ? (
                      "Verified Psychologist"
                    ) : profileData.status === "rejected" ? (
                      "Verification Failed"
                    ) : (
                      "Verification Pending"
                    )}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {profileData.status === "approved" ? (
                      "Your credentials have been verified."
                    ) : profileData.status === "rejected" ? (
                      "Your verification was not approved. Please contact support."
                    ) : (
                      "Your verification is currently in process."
                    )}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {showAddExperience && (
        <EditProfileModal 
          open={showAddExperience}
          onClose={handleModalClose}
          type="experience"
          userId={profileData.user_id}
          data={currentExperience}
        />
      )}
      
      {showAddEducation && (
        <EditProfileModal 
          open={showAddEducation}
          onClose={handleModalClose}
          type="education"
          userId={profileData.user_id}
          data={currentEducation}
        />
      )}
      
      {showAddCertification && (
        <EditProfileModal 
          open={showAddCertification}
          onClose={handleModalClose}
          type="certification"
          userId={profileData.user_id}
          data={currentCertification}
        />
      )}
    </motion.div>
  );
};

export default ProfileDetails;
