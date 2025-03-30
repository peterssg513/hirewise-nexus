import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FileEdit, Trash2, Plus, Award, GraduationCap, Briefcase, Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import EditProfileModal from './EditProfileModal';
import { Experience, Education } from '@/services/psychologistSignupService';
import { Certification } from '@/services/certificationService';

interface ProfileDetailsProps {
  profileData: any;
  onProfileUpdate?: () => void;
  experiences: Experience[];
  educations: Education[];
  certifications: Certification[];
  onEditItem: (section: 'basic' | 'experience' | 'education' | 'certification', itemId?: string) => void;
  onDeleteItem: (section: 'experience' | 'education' | 'certification', itemId: string) => Promise<void>;
}

const ProfileDetails = ({ 
  profileData, 
  onProfileUpdate,
  experiences,
  educations,
  certifications,
  onEditItem,
  onDeleteItem 
}: ProfileDetailsProps) => {
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
    if (onProfileUpdate) {
      onProfileUpdate();
    }
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
              <Button onClick={() => onEditItem('certification')} variant="outline" className="group text-psyched-darkBlue border-psyched-darkBlue hover:bg-psyched-darkBlue hover:text-white gap-1">
                <Plus className="h-4 w-4 group-hover:text-white" />
                Add
              </Button>
            </div>
            
            {certifications && certifications.length > 0 ? (
              <div className="space-y-4">
                {certifications.map((cert: Certification, index: number) => (
                  <div key={cert.id || index} className="relative group p-4 border border-gray-100 rounded-md hover:border-psyched-lightBlue hover:bg-blue-50/30 transition-colors">
                    <div className="absolute top-2 right-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => onEditItem('certification', cert.id)} className="h-8 w-8 rounded-full hover:bg-blue-100">
                        <FileEdit className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDeleteItem('certification', cert.id)} className="h-8 w-8 rounded-full hover:bg-red-100">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <h4 className="font-medium text-psyched-darkBlue">{cert.name}</h4>
                    <p className="text-sm text-gray-600">{cert.issuingAuthority}</p>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Issued: {formatDate(cert.startYear)}</span>
                      {cert.expirationDate && (
                        <span className="ml-2">Expires: {formatDate(cert.expirationDate)}</span>
                      )}
                    </div>
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
              <Button onClick={() => onEditItem('education')} variant="outline" className="group text-psyched-darkBlue border-psyched-darkBlue hover:bg-psyched-darkBlue hover:text-white gap-1">
                <Plus className="h-4 w-4 group-hover:text-white" />
                Add
              </Button>
            </div>
            
            {educations && educations.length > 0 ? (
              <div className="space-y-4">
                {educations.map((edu: Education, index: number) => (
                  <div key={edu.id || index} className="relative group p-4 border border-gray-100 rounded-md hover:border-psyched-lightBlue hover:bg-blue-50/30 transition-colors">
                    <div className="absolute top-2 right-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => onEditItem('education', edu.id)} className="h-8 w-8 rounded-full hover:bg-blue-100">
                        <FileEdit className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDeleteItem('education', edu.id)} className="h-8 w-8 rounded-full hover:bg-red-100">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <h4 className="font-medium text-psyched-darkBlue">{edu.degree || edu.field}</h4>
                    <p className="text-sm text-gray-600">{edu.institution}</p>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</span>
                    </div>
                    {edu.field && (
                      <p className="text-sm text-gray-600 mt-1">{edu.field}</p>
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
              <Button onClick={() => onEditItem('experience')} variant="outline" className="group text-psyched-darkBlue border-psyched-darkBlue hover:bg-psyched-darkBlue hover:text-white gap-1">
                <Plus className="h-4 w-4 group-hover:text-white" />
                Add
              </Button>
            </div>
            
            {experiences && experiences.length > 0 ? (
              <div className="space-y-4">
                {experiences.map((exp: Experience, index: number) => (
                  <div key={exp.id || index} className="relative group p-4 border border-gray-100 rounded-md hover:border-psyched-lightBlue hover:bg-blue-50/30 transition-colors">
                    <div className="absolute top-2 right-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => onEditItem('experience', exp.id)} className="h-8 w-8 rounded-full hover:bg-blue-100">
                        <FileEdit className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDeleteItem('experience', exp.id)} className="h-8 w-8 rounded-full hover:bg-red-100">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <h4 className="font-medium text-psyched-darkBlue">{exp.position}</h4>
                    <p className="text-sm text-gray-600">{exp.organization}</p>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate || '')}</span>
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
          isOpen={showAddExperience}
          onClose={handleModalClose}
          onSave={async (data) => {
            handleModalClose();
          }}
          section="experience"
          itemId={currentExperience?.id || null}
          profileData={profileData}
          experienceData={currentExperience}
        />
      )}
      
      {showAddEducation && (
        <EditProfileModal 
          isOpen={showAddEducation}
          onClose={handleModalClose}
          onSave={async (data) => {
            handleModalClose();
          }}
          section="education"
          itemId={currentEducation?.id || null}
          profileData={profileData}
          educationData={currentEducation}
        />
      )}
      
      {showAddCertification && (
        <EditProfileModal 
          isOpen={showAddCertification}
          onClose={handleModalClose}
          onSave={async (data) => {
            handleModalClose();
          }}
          section="certification"
          itemId={currentCertification?.id || null}
          profileData={profileData}
          certificationData={currentCertification}
        />
      )}
    </motion.div>
  );
};

export default ProfileDetails;
