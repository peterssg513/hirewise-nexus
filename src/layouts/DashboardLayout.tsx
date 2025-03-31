import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { MainNav } from '@/components/nav/MainNav';
import { UserAccountNav } from '@/components/nav/UserAccountNav';
import { NavLogo } from '@/components/nav/NavLogo';
import NotificationsMenu from '@/components/nav/NotificationsMenu';

import { supabase } from '@/integrations/supabase/client';
import { setup as setupDatabaseUtils } from '@/services/databaseUtilsService';

const DashboardLayout = () => {
  const { user, isLoading, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
      return;
    }

    if (profile?.role) {
      setUserRole(profile.role);
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
        <header className="sticky top-0 z-40 border-b bg-background">
          <div className="container flex h-16 items-center justify-between py-4">
            <NavLogo />
            <div className="flex items-center gap-4">
              {/* Loading placeholder */}
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
            </div>
          </div>
        </header>
        <main className="container flex-1 py-6">
          <div className="h-[200px] rounded-md border border-dashed flex items-center justify-center text-muted-foreground">
            Loading...
          </div>
        </main>
      </div>
    );
  }

  // Completely refactored navigation items generation
  const getNavItems = () => {
    if (userRole === 'psychologist') {
      return [
        { label: 'Dashboard', href: '/psychologist-dashboard' },
        { label: 'Jobs', href: '/psychologist-dashboard/jobs' },
        { label: 'Applications', href: '/psychologist-dashboard/applications' },
        { label: 'Evaluations', href: '/psychologist-dashboard/evaluations' },
        { label: 'Profile', href: '/psychologist-dashboard/profile' }
      ];
    } else if (userRole === 'district') {
      return [
        { label: 'Dashboard', href: '/district-dashboard' },
        { label: 'Jobs', href: '/district-dashboard/jobs' },
        { label: 'Schools', href: '/district-dashboard/schools' },
        { label: 'Students', href: '/district-dashboard/students' },
        { label: 'Evaluations', href: '/district-dashboard/evaluations' }
      ];
    } else if (userRole === 'admin') {
      // Clear hash navigation structure for admin dashboard tabs
      return [
        { label: 'Dashboard', href: '/admin-dashboard' },
        { label: 'Districts', href: '/admin-dashboard', hash: 'districts' },
        { label: 'Psychologists', href: '/admin-dashboard', hash: 'psychologists' },
        { label: 'Jobs', href: '/admin-dashboard', hash: 'jobs' },
        { label: 'Evaluations', href: '/admin-dashboard', hash: 'evaluations' }
      ];
    }
    return [];
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center">
            <NavLogo />
            <MainNav items={getNavItems()} />
          </div>
          <div className="flex items-center gap-4">
            <NotificationsMenu />
            <UserAccountNav 
              profile={profile} 
              profilePicUrl={profilePicUrl} 
              onLogout={handleLogout} 
            />
          </div>
        </div>
      </header>
      <main className="container flex-1 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
