
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, GraduationCap, Award, Phone, Mail } from 'lucide-react';

interface ProfileDetailsProps {
  profileData: any;
}

const ProfileDetails = ({ profileData }: ProfileDetailsProps) => {
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
      {/* Contact Information */}
      <motion.div variants={cardVariants}>
        <Card className="shadow-sm hover:shadow transition-shadow duration-300 border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-psyched-darkBlue flex items-center gap-2">
              <Mail className="h-5 w-5 text-psyched-orange" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{profileData.profiles?.email}</p>
              </div>
              {profileData.phone_number && (
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium">{profileData.phone_number}</p>
                </div>
              )}
              {(profileData.city || profileData.state) && (
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">
                    {[profileData.city, profileData.state].filter(Boolean).join(', ')}
                    {profileData.zip_code && ` ${profileData.zip_code}`}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Experience */}
      {profileData.experience && profileData.experience.length > 0 && (
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
                {Array.isArray(profileData.experience) && profileData.experience.map((exp: any, index: number) => (
                  <div key={index} className="border-l-2 border-psyched-lightBlue pl-4 py-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-psyched-darkBlue">{exp.title}</h4>
                      <Badge variant="outline" className="bg-blue-50">
                        {exp.start_date} - {exp.end_date || 'Present'}
                      </Badge>
                    </div>
                    <p className="text-gray-600">{exp.company}</p>
                    <p className="text-sm text-gray-500 mt-1">{exp.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Education */}
      {profileData.education && profileData.education.length > 0 && (
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
                {Array.isArray(profileData.education) && profileData.education.map((edu: any, index: number) => (
                  <div key={index} className="border-l-2 border-psyched-yellow pl-4 py-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-psyched-darkBlue">{edu.degree}</h4>
                      <Badge variant="outline" className="bg-amber-50">
                        {edu.graduation_year}
                      </Badge>
                    </div>
                    <p className="text-gray-600">{edu.institution}</p>
                    <p className="text-sm text-gray-500 mt-1">{edu.field_of_study}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Certifications */}
      {profileData.certification_details && profileData.certification_details.length > 0 && (
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
                {Array.isArray(profileData.certification_details) && profileData.certification_details.map((cert: any, index: number) => (
                  <div key={index} className="border-l-2 border-green-500 pl-4 py-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-psyched-darkBlue">{cert.name}</h4>
                      {cert.expiration_date && (
                        <Badge variant="outline" className="bg-green-50">
                          Expires: {cert.expiration_date}
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600">{cert.issuing_authority}</p>
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
