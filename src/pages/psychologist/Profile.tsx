import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Edit, MapPin, Briefcase, GraduationCap, Award, Save, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useIsMobile } from '@/hooks/use-mobile';

interface PsychologistProfile {
  id: string;
  user_id: string;
  firstName?: string;
  lastName?: string;
  phone_number?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  address?: string;
  profile_picture_url?: string;
  experience_years?: number;
  education?: string;
  certifications?: string[];
  specialties?: string[];
  work_types?: string[];
  evaluation_types?: string[];
  open_to_relocation?: boolean;
  desired_locations?: string[];
}

const basicInfoSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "Please select a state"),
  zipCode: z.string().min(5, "Zip code must be at least 5 characters"),
  address: z.string().optional(),
});

const professionalInfoSchema = z.object({
  experience_years: z.number().min(0, "Experience years must be a valid number").optional(),
  education: z.string().optional(),
  specialties: z.array(z.string()).optional(),
});

type BasicInfoFormValues = z.infer<typeof basicInfoSchema>;
type ProfessionalInfoFormValues = z.infer<typeof professionalInfoSchema>;

const PsychologistProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const [editingBasic, setEditingBasic] = useState(false);
  const [editingProfessional, setEditingProfessional] = useState(false);
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ['psychologist-profile'],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('psychologists')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single();
      
      if (userError) throw userError;
      
      let firstName = '', lastName = '';
      if (userData?.name) {
        const nameParts = userData.name.split(' ');
        firstName = nameParts[0] || '';
        lastName = nameParts.slice(1).join(' ') || '';
      }
      
      return {
        ...data,
        firstName,
        lastName
      } as PsychologistProfile;
    },
    enabled: !!user,
  });
  
  const basicForm = useForm<BasicInfoFormValues>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      phoneNumber: profile?.phone_number || '',
      city: profile?.city || '',
      state: profile?.state || '',
      zipCode: profile?.zip_code || '',
      address: profile?.address || '',
    },
  });
  
  const professionalForm = useForm<ProfessionalInfoFormValues>({
    resolver: zodResolver(professionalInfoSchema),
    defaultValues: {
      experience_years: profile?.experience_years || 0,
      education: profile?.education || '',
      specialties: profile?.specialties || [],
    },
  });
  
  React.useEffect(() => {
    if (profile) {
      basicForm.reset({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phoneNumber: profile.phone_number || '',
        city: profile.city || '',
        state: profile.state || '',
        zipCode: profile.zip_code || '',
        address: profile.address || '',
      });
      
      professionalForm.reset({
        experience_years: profile.experience_years || 0,
        education: profile.education || '',
        specialties: profile.specialties || [],
      });
    }
  }, [profile, basicForm, professionalForm]);
  
  const updateBasicInfo = useMutation({
    mutationFn: async (values: BasicInfoFormValues) => {
      if (!user || !profile) throw new Error("User not authenticated");
      
      const { error: nameError } = await supabase
        .from('profiles')
        .update({ name: `${values.firstName} ${values.lastName}` })
        .eq('id', user.id);
      
      if (nameError) throw nameError;
      
      const { error } = await supabase
        .from('psychologists')
        .update({
          phone_number: values.phoneNumber,
          city: values.city,
          state: values.state,
          zip_code: values.zipCode,
          address: values.address,
        })
        .eq('id', profile.id);
      
      if (error) throw error;
      
      return { ...profile, ...values };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['psychologist-profile'] });
      toast({
        title: "Profile updated",
        description: "Your basic information has been updated successfully.",
      });
      setEditingBasic(false);
    },
    onError: (error) => {
      toast({
        title: "Error updating profile",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    },
  });
  
  const updateProfessionalInfo = useMutation({
    mutationFn: async (values: ProfessionalInfoFormValues) => {
      if (!user || !profile) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from('psychologists')
        .update({
          experience_years: values.experience_years,
          education: values.education,
          specialties: values.specialties,
        })
        .eq('id', profile.id);
      
      if (error) throw error;
      
      return { ...profile, ...values };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['psychologist-profile'] });
      toast({
        title: "Profile updated",
        description: "Your professional information has been updated successfully.",
      });
      setEditingProfessional(false);
    },
    onError: (error) => {
      toast({
        title: "Error updating profile",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    },
  });
  
  const onBasicSubmit = (values: BasicInfoFormValues) => {
    updateBasicInfo.mutate(values);
  };
  
  const onProfessionalSubmit = (values: ProfessionalInfoFormValues) => {
    updateProfessionalInfo.mutate(values);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-psyched-darkBlue"></div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-bold text-red-500">Profile not found</h2>
        <p className="text-muted-foreground mt-2">Unable to load your profile information</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Your Profile</h1>
        <p className="text-muted-foreground">View and update your profile information</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="basicInfo">Basic Information</TabsTrigger>
            <TabsTrigger value="professionalInfo">Professional Details</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Personal Info</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center pt-2">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    {profile.profile_picture_url ? (
                      <img 
                        src={profile.profile_picture_url} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-gray-500" />
                    )}
                  </div>
                  <h3 className="text-lg font-medium">{profile.firstName} {profile.lastName}</h3>
                  <p className="text-sm text-muted-foreground mt-1">School Psychologist</p>
                  
                  <div className="w-full mt-6 space-y-3">
                    {profile.phone_number && (
                      <div className="flex items-center">
                        <span className="text-muted-foreground mr-2 w-20 text-right text-sm">Phone:</span>
                        <span>{profile.phone_number}</span>
                      </div>
                    )}
                    {(profile.city || profile.state) && (
                      <div className="flex items-center">
                        <span className="text-muted-foreground mr-2 w-20 text-right text-sm">Location:</span>
                        <div className="flex items-center">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
                          <span>{[profile.city, profile.state].filter(Boolean).join(', ')}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Professional Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Briefcase className="w-4 h-4 mr-2" />
                      <span>Experience</span>
                    </div>
                    <p className="text-sm pl-6">
                      {profile.experience_years ? `${profile.experience_years} years of experience` : 'Not specified'}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <GraduationCap className="w-4 h-4 mr-2" />
                      <span>Education</span>
                    </div>
                    <p className="text-sm pl-6 whitespace-pre-line">
                      {profile.education || 'Not specified'}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Award className="w-4 h-4 mr-2" />
                      <span>Specialties</span>
                    </div>
                    <div className="pl-6">
                      {profile.specialties && profile.specialties.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {profile.specialties.map(specialty => (
                            <Badge key={specialty} variant="secondary">{specialty}</Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No specialties listed</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-3">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Professional Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Work Types</h3>
                      {profile.work_types && profile.work_types.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {profile.work_types.map(type => (
                            <Badge key={type} variant="outline">{type}</Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No work types specified</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Evaluation Types</h3>
                      {profile.evaluation_types && profile.evaluation_types.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {profile.evaluation_types.map(type => (
                            <Badge key={type} variant="outline">{type}</Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No evaluation types specified</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Location Preferences</h3>
                      <div>
                        <Badge variant={profile.open_to_relocation ? "default" : "outline"}>
                          {profile.open_to_relocation ? "Open to Relocation" : "Not Open to Relocation"}
                        </Badge>
                      </div>
                      {profile.open_to_relocation && profile.desired_locations && profile.desired_locations.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {profile.desired_locations.map(location => (
                            <Badge key={location} variant="secondary">{location}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="basicInfo">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingBasic(!editingBasic)}
                  >
                    {editingBasic ? "Cancel" : <><Edit className="w-4 h-4 mr-2" /> Edit</>}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...basicForm}>
                  <form onSubmit={basicForm.handleSubmit(onBasicSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={basicForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                disabled={!editingBasic} 
                                placeholder="Your first name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={basicForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                disabled={!editingBasic}
                                placeholder="Your last name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={basicForm.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                disabled={!editingBasic}
                                placeholder="Your phone number"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={basicForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                disabled={!editingBasic}
                                placeholder="Your street address"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={basicForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                disabled={!editingBasic}
                                placeholder="Your city"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={basicForm.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  disabled={!editingBasic}
                                  placeholder="Your state"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={basicForm.control}
                          name="zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Zip Code</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  disabled={!editingBasic}
                                  placeholder="Your zip code"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    {editingBasic && (
                      <div className="flex justify-end">
                        <Button 
                          type="submit" 
                          className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90"
                          disabled={updateBasicInfo.isPending || !basicForm.formState.isDirty}
                        >
                          {updateBasicInfo.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="professionalInfo">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Professional Information</CardTitle>
                    <CardDescription>Update your experience and qualifications</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingProfessional(!editingProfessional)}
                  >
                    {editingProfessional ? "Cancel" : <><Edit className="w-4 h-4 mr-2" /> Edit</>}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...professionalForm}>
                  <form onSubmit={professionalForm.handleSubmit(onProfessionalSubmit)} className="space-y-6">
                    <FormField
                      control={professionalForm.control}
                      name="experience_years"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Years of Experience</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              disabled={!editingProfessional}
                              placeholder="Your years of experience"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={professionalForm.control}
                      name="education"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Education</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              disabled={!editingProfessional}
                              placeholder="Your educational background"
                              rows={4}
                            />
                          </FormControl>
                          <FormDescription>
                            List your degrees, institutions, and graduation years
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={professionalForm.control}
                      name="specialties"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specialties</FormLabel>
                          <FormControl>
                            <Textarea 
                              value={field.value?.join(', ') || ''}
                              onChange={(e) => {
                                const values = e.target.value
                                  .split(',')
                                  .map(val => val.trim())
                                  .filter(Boolean);
                                field.onChange(values);
                              }}
                              disabled={!editingProfessional}
                              placeholder="Your areas of specialization"
                              rows={3}
                            />
                          </FormControl>
                          <FormDescription>
                            Enter your specialties separated by commas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {editingProfessional && (
                      <div className="flex justify-end">
                        <Button 
                          type="submit" 
                          className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90"
                          disabled={updateProfessionalInfo.isPending || !professionalForm.formState.isDirty}
                        >
                          {updateProfessionalInfo.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Work Preferences</CardTitle>
                <CardDescription>Your selected work and evaluation preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Work Types</h3>
                  {profile.work_types && profile.work_types.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.work_types.map(type => (
                        <Badge key={type} variant="secondary">{type}</Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No work types specified</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Evaluation Types</h3>
                  {profile.evaluation_types && profile.evaluation_types.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.evaluation_types.map(type => (
                        <Badge key={type} variant="secondary">{type}</Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No evaluation types specified</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Relocation Preferences</h3>
                  <div>
                    <Badge variant={profile.open_to_relocation ? "default" : "outline"}>
                      {profile.open_to_relocation ? "Open to Relocation" : "Not Open to Relocation"}
                    </Badge>
                  </div>
                  
                  {profile.open_to_relocation && profile.desired_locations && profile.desired_locations.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium mb-1">Preferred Locations:</p>
                      <div className="flex flex-wrap gap-2">
                        {profile.desired_locations.map(location => (
                          <Badge key={location} variant="outline">{location}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="pt-4">
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Update Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PsychologistProfile;
