
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { District } from '@/types/district';
import { fetchDistrictProfile } from '@/services/districtProfileService';
import { Loader2, Edit, Clock, CheckCircle, School, MapPin, Users, Phone, Mail } from 'lucide-react';

const DistrictDashboard = () => {
  const { profile, user } = useAuth();
  const [district, setDistrict] = useState<District | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      <p className="text-muted-foreground">Manage job postings and review applications</p>
      
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
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Job Postings</CardTitle>
            <CardDescription>Manage your job postings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Active Postings</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Applications</CardTitle>
            <CardDescription>Review incoming applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Pending Review</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Evaluation Reports</CardTitle>
            <CardDescription>Access submitted evaluation reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Available Reports</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DistrictDashboard;
