
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import NotificationsMenu from '@/components/nav/NotificationsMenu';
import { supabase } from '@/integrations/supabase/client';
import { setup as setupDatabaseUtils } from '@/services/databaseUtilsService';

const DashboardLayout = () => {
  const { user, isLoading, profile } = useAuth();
  const navigate = useNavigate();
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
      return;
    }
    
    // Set up database utils (RLS policies, etc.)
    setupDatabaseUtils().catch(error => {
      console.error('Error setting up database utils:', error);
    });

    // Fetch profile picture for psychologists
    const fetchProfilePicture = async () => {
      if (user?.id && profile?.role === 'psychologist') {
        try {
          const { data, error } = await supabase
            .from('psychologists')
            .select('profile_picture_url')
            .eq('user_id', user.id)
            .single();
          
          if (!error && data?.profile_picture_url) {
            setProfilePicUrl(data.profile_picture_url);
          }
        } catch (error) {
          console.error('Failed to fetch profile picture:', error);
        }
      }
    };
    
    fetchProfilePicture();
  }, [user, isLoading, navigate, profile]);

  // If still loading, show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 flex-1 py-6">
          <div className="h-[200px] rounded-md border border-dashed flex items-center justify-center text-muted-foreground">
            Loading...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-psyched-cream">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 flex-1 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
