
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MapPin, BriefcaseBusiness, GraduationCap, Scroll, FileEdit } from 'lucide-react';
import { Certification } from '@/services/certificationService';
import { Experience, Education } from '@/services/psychologistSignupService';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Helper function to safely parse JSON data
  const safeJsonParse = (jsonString: string | null, defaultValue: any[] = []): any[] => {
    if (!jsonString) return defaultValue;
    try {
      const parsed = JSON.parse(jsonString);
      return Array.isArray(parsed) ? parsed : defaultValue;
    } catch (err) {
      console.error('Error parsing JSON data:', err);
      return defaultValue;
    }
  };

  // Map between different property names
  const mapExperienceProperties = (exp: any): Experience => {
    return {
      id: exp.id,
      position: exp.position || exp.jobTitle || '',
      organization: exp.organization || exp.placeOfEmployment || '',
      description: exp.description || '',
      startDate: exp.startDate || exp.yearStarted || '',
      endDate: exp.endDate || exp.yearWorked || '',
      current: exp.current || false
    };
  };

  // Map between different education property names
  const mapEducationProperties = (edu: any): Education => {
    return {
      id: edu.id,
      institution: edu.institution || edu.schoolName || '',
      field: edu.field || edu.major || '',
      degree: edu.degree || '',
      startDate: edu.startDate || '',
      endDate: edu.endDate || ''
    };
  };
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        setError("User not authenticated");
        return;
      }
      
      try {
        console.log("Fetching profile for user:", user.id);
        
        const { data, error } = await supabase
          .from('psychologists')
          .select(`
            *,
            profiles:user_id(
              name,
              email
            )
          `)
          .eq('user_id', user.id)
          .single();
          
        if (error) {
          console.error('Error fetching psychologist profile:', error);
          setError("Error fetching profile data");
          toast({
            title: 'Error',
            description: 'Failed to fetch profile data. Please try again.',
            variant: 'destructive',
          });
          return;
        }
        
        console.log("Profile data retrieved:", data);
        setProfile(data);
        
        // Parse experience data
        try {
          if (data.experience) {
            const expData = safeJsonParse(data.experience);
            setExperiences(expData.map(mapExperienceProperties));
          } else {
            setExperiences([]);
          }
        } catch (err) {
          console.error('Error parsing experience data:', err);
          setExperiences([]);
        }
        
        // Parse education data
        try {
          if (data.education) {
            const eduData = safeJsonParse(data.education);
            setEducations(eduData.map(mapEducationProperties));
          } else {
            setEducations([]);
          }
        } catch (err) {
          console.error('Error parsing education data:', err);
          setEducations([]);
        }
        
        // Parse certification data
        try {
          if (data.certification_details) {
            let certData: any[] = [];
            
            if (Array.isArray(data.certification_details)) {
              certData = data.certification_details as any[];
            } else if (typeof data.certification_details === 'object') {
              certData = Object.values(data.certification_details as object);
            }
            
            setCertifications(certData as unknown as Certification[]);
          }
        } catch (err) {
          console.error('Error parsing certification data:', err);
          setCertifications([]);
        }
      } catch (err) {
        console.error('Error in fetchProfile:', err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user, toast]);
  
  const handleEditProfile = () => {
    // For now, navigate to signup flow
    navigate('/psychologist-signup');
    toast({
      title: 'Edit Profile',
      description: 'You can update your profile information here.',
    });
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-psyched-darkBlue" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Error Loading Profile</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Profile Not Found</h2>
          <p className="text-gray-500 mb-4">Unable to retrieve your profile information.</p>
          <Button 
            className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90 text-white"
            onClick={() => navigate('/psychologist-signup')}
          >
            Complete Your Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-1/3 bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-32 w-32 mb-4">
              {profile.profile_picture_url ? (
                <AvatarImage src={profile.profile_picture_url} alt={profile.profiles?.name || 'User'} />
              ) : (
                <AvatarFallback className="text-2xl bg-psyched-lightBlue text-white">
                  {profile.profiles?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                </AvatarFallback>
              )}
            </Avatar>
            <h2 className="text-2xl font-bold">{profile.profiles?.name || 'Anonymous User'}</h2>
            <p className="text-gray-600 mb-3">{profile.profiles?.email}</p>
            
            {profile.status === 'approved' ? (
              <Badge className="bg-green-500">Verified Psychologist</Badge>
            ) : (
              <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                Verification Pending
              </Badge>
            )}
            
            {profile.city && profile.state && (
              <div className="flex items-center gap-1 mt-3 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{profile.city}, {profile.state}</span>
              </div>
            )}
            
            <Button 
              className="mt-6 bg-psyched-darkBlue hover:bg-psyched-darkBlue/80"
              size="sm"
              onClick={handleEditProfile}
            >
              <FileEdit className="h-4 w-4 mr-2" /> Edit Profile
            </Button>
          </div>
          
          <div className="mt-8">
            <h3 className="font-medium text-gray-900 mb-2">Work Preferences</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {profile.work_types?.map((type: string) => (
                <Badge key={type} variant="outline" className="bg-blue-50">
                  {type}
                </Badge>
              ))}
            </div>
            
            <h3 className="font-medium text-gray-900 mb-2">Evaluation Types</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {profile.evaluation_types?.map((type: string) => (
                <Badge key={type} variant="outline" className="bg-purple-50">
                  {type}
                </Badge>
              ))}
            </div>
            
            <h3 className="font-medium text-gray-900 mb-2">Desired Locations</h3>
            <div className="flex flex-wrap gap-2">
              {profile.desired_locations?.map((location: string) => (
                <Badge key={location} variant="outline" className="bg-green-50">
                  {location}
                </Badge>
              ))}
            </div>
            
            {profile.open_to_relocation && (
              <Badge className="mt-2 bg-psyched-lightBlue">Open to Relocation</Badge>
            )}
          </div>
        </div>
        
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
      </div>
    </div>
  );
};

export default Profile;
