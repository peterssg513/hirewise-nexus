
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, GraduationCap, Award, Phone, Mail } from 'lucide-react';
import { Experience, Education } from '@/services/psychologistSignupService';
import { Certification } from '@/services/certificationService';

export interface ProfileDetailsProps {
  experiences: Experience[];
  educations: Education[];
  certifications: Certification[];
  profileData?: any; // Optional profile data
}

const ProfileDetails = ({ experiences, educations, certifications, profileData }: ProfileDetailsProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <motion.div 
      className="w-full md:w-2/3 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Contact Details */}
      <motion.div variants={cardVariants}>
        <Card className="shadow-sm hover:shadow transition-shadow duration-300 border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-psyched-darkBlue flex items-center gap-2">
              <Mail className="h-5 w-5 text-psyched-lightBlue" />
              Contact Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profileData?.profiles?.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-psyched-lightBlue" />
                  <p className="text-gray-600">{profileData.profiles.email}</p>
                </div>
              )}
              {profileData?.phone_number && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-psyched-orange" />
                  <p className="text-gray-600">{profileData.phone_number}</p>
                </div>
              )}
              {profileData?.city && profileData?.state && (
                <div className="flex items-start gap-3">
                  <span className="i-lucide-map-pin h-5 w-5 text-psyched-darkBlue mt-0.5" />
                  <p className="text-gray-600">
                    {profileData.city}, {profileData.state} {profileData.zip_code || ''}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Experience */}
      {experiences && experiences.length > 0 && (
        <motion.div variants={cardVariants}>
          <Card className="shadow-sm hover:shadow transition-shadow duration-300 border-gray-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-psyched-darkBlue flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-psyched-orange" />
                Professional Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {experiences.map((exp, index) => (
                  <div key={exp.id || index} className="border-l-2 border-psyched-lightBlue pl-4 py-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-psyched-darkBlue">{exp.position}</h4>
                      <Badge variant="outline" className="bg-blue-50">
                        {exp.startDate} - {exp.endDate || 'Present'}
                      </Badge>
                    </div>
                    <p className="text-gray-600">{exp.organization}</p>
                    <p className="text-sm text-gray-500 mt-1">{exp.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Education */}
      {educations && educations.length > 0 && (
        <motion.div variants={cardVariants}>
          <Card className="shadow-sm hover:shadow transition-shadow duration-300 border-gray-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-psyched-darkBlue flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-psyched-lightBlue" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {educations.map((edu, index) => (
                  <div key={edu.id || index} className="border-l-2 border-psyched-yellow pl-4 py-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-psyched-darkBlue">{edu.degree}</h4>
                      <Badge variant="outline" className="bg-amber-50">
                        {edu.endDate}
                      </Badge>
                    </div>
                    <p className="text-gray-600">{edu.institution}</p>
                    <p className="text-sm text-gray-500 mt-1">{edu.field}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <motion.div variants={cardVariants}>
          <Card className="shadow-sm hover:shadow transition-shadow duration-300 border-gray-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-psyched-darkBlue flex items-center gap-2">
                <Award className="h-5 w-5 text-psyched-orange" />
                Certifications & Licenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <div key={cert.id || index} className="border-l-2 border-green-500 pl-4 py-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-psyched-darkBlue">{cert.name}</h4>
                      {cert.expirationDate && (
                        <Badge variant="outline" className="bg-green-50">
                          Expires: {cert.expirationDate}
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600">{cert.issuingAuthority || cert.issuer || ''}</p>
                    {cert.description && (
                      <p className="text-sm text-gray-500 mt-1">{cert.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProfileDetails;
