
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2, Edit, MapPin, Phone, Mail, Award, Building, GraduationCap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Experience {
  id: string;
  position: string;
  organization: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expirationDate: string | null;
  documentUrl: string;
}

interface ProfileData {
  name: string;
  email: string;
  profile_picture_url: string | null;
  phone_number: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  specialties: string[] | null;
  status: string;
  work_types: string[] | null;
  evaluation_types: string[] | null;
  open_to_relocation: boolean;
  desired_locations: string[] | null;
}

const Profile = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('psychologists')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        // Parse JSON strings into objects
        const parsedData = {
          ...data,
          experience: data.experience ? JSON.parse(data.experience) : [],
          education: data.education ? JSON.parse(data.education) : [],
          certifications: data.certification_details || []
        };

        setProfileData(parsedData);
      } catch (error: any) {
        console.error('Error fetching profile data:', error);
        toast({
          title: 'Error loading profile',
          description: error.message || 'Failed to load profile data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [user, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-psyched-darkBlue" />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Profile data not found.</p>
        <Button onClick={() => navigate('/psychologist-signup')}>
          Complete Your Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-psyched-darkBlue">My Profile</h1>
          <p className="text-gray-600">View and manage your psychologist profile</p>
        </div>
        <Button 
          onClick={() => navigate('/psychologist-signup')}
          className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90"
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      {/* Profile Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Overview</CardTitle>
          <CardDescription>Your public profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              {profileData.profile_picture_url ? (
                <img 
                  src={profileData.profile_picture_url} 
                  alt={profileData.name || 'Profile picture'} 
                  className="w-32 h-32 rounded-full object-cover border-2 border-psyched-lightBlue"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <span className="text-3xl font-semibold">
                    {profile?.name?.charAt(0) || '?'}
                  </span>
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-grow space-y-4">
              <div>
                <h2 className="text-xl font-semibold">{profile?.name}</h2>
                <p className="text-gray-600">School Psychologist</p>
                
                <div className="flex items-center mt-2">
                  <div className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {profileData.status === 'approved' ? 'Verified' : 'Pending Verification'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>
                    {profileData.city && profileData.state
                      ? `${profileData.city}, ${profileData.state}`
                      : 'Location not specified'}
                  </span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>{profileData.phone_number || 'Phone not specified'}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>{profile?.email}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Experience Section */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Experience</CardTitle>
        </CardHeader>
        <CardContent>
          {profileData.experience && profileData.experience.length > 0 ? (
            <div className="space-y-6">
              {profileData.experience.map((exp, index) => (
                <div key={exp.id || index}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-gray-100 rounded-md">
                      <Building className="h-5 w-5 text-psyched-darkBlue" />
                    </div>
                    <div>
                      <h3 className="font-medium">{exp.position}</h3>
                      <p className="text-gray-600">{exp.organization}</p>
                      <p className="text-sm text-gray-500">
                        {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                      </p>
                      <p className="mt-2 text-sm">{exp.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No experience information added yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Education Section */}
      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent>
          {profileData.education && profileData.education.length > 0 ? (
            <div className="space-y-6">
              {profileData.education.map((edu, index) => (
                <div key={edu.id || index}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-gray-100 rounded-md">
                      <GraduationCap className="h-5 w-5 text-psyched-darkBlue" />
                    </div>
                    <div>
                      <h3 className="font-medium">{edu.degree} in {edu.field}</h3>
                      <p className="text-gray-600">{edu.institution}</p>
                      <p className="text-sm text-gray-500">
                        {edu.startDate} — {edu.endDate}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No education information added yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Certifications Section */}
      <Card>
        <CardHeader>
          <CardTitle>Certifications</CardTitle>
        </CardHeader>
        <CardContent>
          {profileData.certifications && profileData.certifications.length > 0 ? (
            <div className="space-y-6">
              {profileData.certifications.map((cert, index) => (
                <div key={cert.id || index}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-gray-100 rounded-md">
                      <Award className="h-5 w-5 text-psyched-darkBlue" />
                    </div>
                    <div>
                      <h3 className="font-medium">{cert.name}</h3>
                      <p className="text-gray-600">Issued by {cert.issuer}</p>
                      <p className="text-sm text-gray-500">
                        Issued: {cert.date}
                        {cert.expirationDate && ` • Expires: ${cert.expirationDate}`}
                      </p>
                      {cert.documentUrl && (
                        <Button variant="link" className="p-0 h-auto text-psyched-lightBlue">
                          <a href={cert.documentUrl} target="_blank" rel="noopener noreferrer">
                            View Certificate
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No certifications added yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Preferences Section */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences & Specialties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Specialties</h3>
              {profileData.specialties && profileData.specialties.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profileData.specialties.map((specialty, index) => (
                    <span key={index} className="px-3 py-1 rounded-full text-xs font-medium bg-psyched-cream text-psyched-darkBlue">
                      {specialty}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No specialties specified.</p>
              )}
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Work Types</h3>
              {profileData.work_types && profileData.work_types.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profileData.work_types.map((type, index) => (
                    <span key={index} className="px-3 py-1 rounded-full text-xs font-medium bg-psyched-cream text-psyched-darkBlue">
                      {type}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No work types specified.</p>
              )}
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Evaluation Types</h3>
              {profileData.evaluation_types && profileData.evaluation_types.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profileData.evaluation_types.map((type, index) => (
                    <span key={index} className="px-3 py-1 rounded-full text-xs font-medium bg-psyched-cream text-psyched-darkBlue">
                      {type}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No evaluation types specified.</p>
              )}
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Location Preferences</h3>
              <p className="text-gray-600 mb-1">
                {profileData.open_to_relocation ? 'Open to relocation' : 'Not open to relocation'}
              </p>
              
              {profileData.desired_locations && profileData.desired_locations.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profileData.desired_locations.map((location, index) => (
                    <span key={index} className="px-3 py-1 rounded-full text-xs font-medium bg-psyched-cream text-psyched-darkBlue">
                      {location}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No preferred locations specified.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
