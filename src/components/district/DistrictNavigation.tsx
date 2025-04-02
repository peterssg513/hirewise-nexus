
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, School, FileText, Settings, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const DistrictNavigation = () => {
  const location = useLocation();
  const {
    profile
  } = useAuth();
  const [districtStatus, setDistrictStatus] = useState('approved');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkDistrictStatus = async () => {
      if (!profile?.id) return;
      try {
        setIsLoading(true);
        const {
          data,
          error
        } = await supabase.from('districts').select('status').eq('user_id', profile.id).single();
        if (error) throw error;
        setDistrictStatus(data?.status || 'approved');
      } catch (error) {
        console.error('Error fetching district status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkDistrictStatus();
  }, [profile?.id]);

  // If the district is not approved, show a pending approval message
  if (!isLoading && districtStatus === 'pending') {
    return <Card className="mb-6 border-yellow-400">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
            <h2 className="text-xl font-bold">Pending Approval</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Your district account is pending approval by an administrator. You'll receive a notification once your account has been approved.
          </p>
          <p className="text-sm text-muted-foreground">
            While your account is pending, you can update your district profile information, but you cannot create jobs or evaluation requests.
          </p>
        </CardContent>
      </Card>;
  }

  // If the district is rejected, show a rejected message
  if (!isLoading && districtStatus === 'rejected') {
    return <Card className="mb-6 border-red-400">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <h2 className="text-xl font-bold">Account Rejected</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Your district account has been rejected by an administrator. Please check your notifications for the reason and contact support for assistance.
          </p>
          <p className="text-sm text-muted-foreground">
            You can update your district profile information and reapply for approval.
          </p>
        </CardContent>
      </Card>;
  }
  
  return <div className="mb-6 overflow-x-auto flex gap-2 md:gap-4 pb-2">
      <Button variant={location.pathname.endsWith('/district-dashboard') || location.pathname.endsWith('/district-dashboard/jobs') ? "default" : "outline"} asChild className="whitespace-nowrap">
        <Link to="/district-dashboard">
          <Briefcase className="mr-2 h-4 w-4" /> Jobs
        </Link>
      </Button>
      
      <Button variant={location.pathname.includes('/district-dashboard/schools') ? "default" : "outline"} asChild className="whitespace-nowrap">
        <Link to="/district-dashboard/schools">
          <School className="mr-2 h-4 w-4" /> Schools
        </Link>
      </Button>
      
      <Button variant={location.pathname.includes('/district-dashboard/evaluations') ? "default" : "outline"} asChild className="whitespace-nowrap">
        <Link to="/district-dashboard/evaluations">
          <FileText className="mr-2 h-4 w-4" /> Evaluations
        </Link>
      </Button>
      
      <Button variant={location.pathname.includes('/district-dashboard/settings') ? "default" : "outline"} asChild className="whitespace-nowrap">
        <Link to="/district-dashboard/settings">
          <Settings className="mr-2 h-4 w-4" /> Settings
        </Link>
      </Button>
    </div>;
};

export default DistrictNavigation;
