
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BriefcaseBusiness, GraduationCap, Scroll } from 'lucide-react';
import { Experience, Education } from '@/services/psychologistSignupService';
import { Certification } from '@/services/certificationService';

interface ProfileDetailsProps {
  experiences: Experience[];
  educations: Education[];
  certifications: Certification[];
}

const ProfileDetails = ({ experiences, educations, certifications }: ProfileDetailsProps) => {
  return (
    <div className="w-full md:w-2/3">
      <Tabs defaultValue="experience" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="experience" className="flex items-center gap-1">
            <BriefcaseBusiness className="h-4 w-4" /> Experience
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center gap-1">
            <GraduationCap className="h-4 w-4" /> Education
          </TabsTrigger>
          <TabsTrigger value="certifications" className="flex items-center gap-1">
            <Scroll className="h-4 w-4" /> Certifications
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="experience">
          <div className="space-y-4">
            {experiences.length > 0 ? (
              experiences.map((exp) => (
                <Card key={exp.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{exp.position}</CardTitle>
                        <CardDescription>{exp.organization}</CardDescription>
                      </div>
                      <Badge variant="outline">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </Badge>
                    </div>
                  </CardHeader>
                  {exp.description && (
                    <CardContent>
                      <p className="text-sm text-gray-600">{exp.description}</p>
                    </CardContent>
                  )}
                </Card>
              ))
            ) : (
              <div className="text-center p-8 border border-dashed rounded-lg">
                <p className="text-gray-500">No experience information added yet.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="education">
          <div className="space-y-4">
            {educations.length > 0 ? (
              educations.map((edu) => (
                <Card key={edu.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{edu.field}</CardTitle>
                        <CardDescription>{edu.institution}</CardDescription>
                      </div>
                      <Badge variant="outline">
                        {edu.startDate || edu.degree} - {edu.endDate}
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))
            ) : (
              <div className="text-center p-8 border border-dashed rounded-lg">
                <p className="text-gray-500">No education information added yet.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="certifications">
          <div className="space-y-4">
            {certifications.length > 0 ? (
              certifications.map((cert) => (
                <Card key={cert.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{cert.name}</CardTitle>
                        {cert.issuer && <CardDescription>{cert.issuer}</CardDescription>}
                      </div>
                      <div>
                        <Badge variant="outline">{cert.date || cert.startYear}</Badge>
                        {cert.expirationDate && <Badge variant="outline" className="ml-2">Expires: {cert.expirationDate}</Badge>}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {(cert.documentUrl || cert.url) && (
                      <Button variant="outline" size="sm" className="text-blue-600">
                        <a href={cert.documentUrl || cert.url} target="_blank" rel="noopener noreferrer">
                          View Certificate
                        </a>
                      </Button>
                    )}
                    <Badge className={`ml-2 ${cert.status === 'verified' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                      {cert.status === 'verified' ? 'Verified' : 'Pending Verification'}
                    </Badge>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center p-8 border border-dashed rounded-lg">
                <p className="text-gray-500">No certification information added yet.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileDetails;
