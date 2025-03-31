
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchDistrictProfile } from '@/services/districtProfileService';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { StudentsList } from '@/components/district/students/StudentsList';

const DistrictStudents = () => {
  const [districtId, setDistrictId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    const loadDistrictData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const districtProfile = await fetchDistrictProfile(user.id);
        
        if (districtProfile) {
          setDistrictId(districtProfile.id);
        } else {
          toast({
            title: "Error loading district profile",
            description: "Could not find your district profile. Please contact support.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error fetching district data:', error);
        toast({
          title: "Error loading district data",
          description: "Failed to load district information. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadDistrictData();
  }, [user, toast]);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!districtId) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-xl font-bold mb-4">District Profile Not Found</h2>
        <p className="text-muted-foreground">
          We couldn't find your district profile. Please contact support for assistance.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">District Students</h1>
      </div>
      
      <StudentsList districtId={districtId} />
    </div>
  );
};

export default DistrictStudents;
