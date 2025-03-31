
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { District } from '@/types/district';
import { fetchDistrictProfile } from '@/services/districtProfileService';
import { Loader2, Edit, Clock, CheckCircle, School, MapPin, Users, Phone, Mail, Plus, Briefcase, FileText, User } from 'lucide-react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { SchoolsList } from '@/components/district/SchoolsList';
import { JobsList } from '@/components/district/JobsList';
import { StudentsList } from '@/components/district/StudentsList';
import { EvaluationsList } from '@/components/district/EvaluationsList';
import { DistrictNavigation } from '@/components/district/DistrictNavigation';

const DistrictDashboard = () => {
  const { profile, user } = useAuth();
  const [district, setDistrict] = useState<District | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadDistrictProfile = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const districtData = await fetchDistrictProfile(user.id);
        setDistrict(districtData);
      } catch (error) {
        console.error('Failed to load district profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDistrictProfile();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-psyched-darkBlue" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Welcome, {profile?.name || 'District'}</h1>
      <p className="text-muted-foreground">Manage job postings, schools, students, and evaluations</p>
      
      {district && (
        <Card className="mb-6 overflow-hidden border-0 shadow-md">
          <div className="bg-gradient-to-r from-psyched-darkBlue to-psyched-lightBlue p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">District Profile</h2>
              <div className="flex items-center space-x-2">
                {district.status === 'approved' ? (
                  <span className="flex items-center text-green-100 text-sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approved
                  </span>
                ) : (
                  <span className="flex items-center text-yellow-100 text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    Pending Approval
                  </span>
                )}
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Basic Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <School className="h-5 w-5 text-psyched-darkBlue mt-0.5 mr-2" />
                    <div>
                      <p className="font-medium">{district.name}</p>
                      <p className="text-sm text-gray-500">District Name</p>
                    </div>
                  </div>
                  
                  {district.location && (
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-psyched-darkBlue mt-0.5 mr-2" />
                      <div>
                        <p className="font-medium">{district.location}</p>
                        <p className="text-sm text-gray-500">Location</p>
                      </div>
                    </div>
                  )}
                  
                  {district.district_size && (
                    <div className="flex items-start">
                      <Users className="h-5 w-5 text-psyched-darkBlue mt-0.5 mr-2" />
                      <div>
                        <p className="font-medium">{district.district_size.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Student Population</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-psyched-darkBlue mt-0.5 mr-2" />
                    <div>
                      <p className="font-medium">{district.contact_phone || 'Not provided'}</p>
                      <p className="text-sm text-gray-500">Phone</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-psyched-darkBlue mt-0.5 mr-2" />
                    <div>
                      <p className="font-medium">{district.contact_email || 'Not provided'}</p>
                      <p className="text-sm text-gray-500">Email</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {district.description && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-700 mb-2">About</h3>
                <p className="text-gray-600">{district.description}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      <DistrictNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <Tabs value={activeTab}>
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover:shadow-md transition-shadow border border-gray-100">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Job Postings</CardTitle>
                    <CardDescription>Manage positions</CardDescription>
                  </div>
                  <Briefcase className="h-5 w-5 text-psyched-darkBlue" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Active Postings</p>
              </CardContent>
              <div className="px-4 pb-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-psyched-darkBlue text-psyched-darkBlue hover:bg-psyched-darkBlue/10"
                  onClick={() => setActiveTab('jobs')}
                >
                  <Plus className="h-4 w-4 mr-1" /> Create Job
                </Button>
              </div>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow border border-gray-100">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Schools</CardTitle>
                    <CardDescription>Manage locations</CardDescription>
                  </div>
                  <School className="h-5 w-5 text-psyched-darkBlue" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Registered Schools</p>
              </CardContent>
              <div className="px-4 pb-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-psyched-darkBlue text-psyched-darkBlue hover:bg-psyched-darkBlue/10"
                  onClick={() => setActiveTab('schools')}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add School
                </Button>
              </div>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow border border-gray-100">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Evaluations</CardTitle>
                    <CardDescription>Request assessments</CardDescription>
                  </div>
                  <FileText className="h-5 w-5 text-psyched-darkBlue" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Pending Evaluations</p>
              </CardContent>
              <div className="px-4 pb-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-psyched-darkBlue text-psyched-darkBlue hover:bg-psyched-darkBlue/10"
                  onClick={() => setActiveTab('evaluations')}
                >
                  <Plus className="h-4 w-4 mr-1" /> Request Evaluation
                </Button>
              </div>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow border border-gray-100">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Students</CardTitle>
                    <CardDescription>Manage student records</CardDescription>
                  </div>
                  <User className="h-5 w-5 text-psyched-darkBlue" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Registered Students</p>
              </CardContent>
              <div className="px-4 pb-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-psyched-darkBlue text-psyched-darkBlue hover:bg-psyched-darkBlue/10"
                  onClick={() => setActiveTab('students')}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Student
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="jobs">
          {district && <JobsList districtId={district.id} />}
        </TabsContent>
        
        <TabsContent value="schools">
          {district && <SchoolsList districtId={district.id} />}
        </TabsContent>
        
        <TabsContent value="students">
          {district && <StudentsList districtId={district.id} />}
        </TabsContent>
        
        <TabsContent value="evaluations">
          {district && <EvaluationsList districtId={district.id} />}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DistrictDashboard;
