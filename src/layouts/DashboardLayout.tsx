
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { MainNav } from '@/components/nav/MainNav';
import { UserAccountNav } from '@/components/nav/UserAccountNav';
import { NavLogo } from '@/components/nav/NavLogo';
import NotificationsMenu from '@/components/nav/NotificationsMenu';

import { supabase } from '@/integrations/supabase/client';
import { setup as setupDatabaseUtils } from '@/services/databaseUtilsService';

const DashboardLayout = () => {
  const { user, loading, profile } = useAuth();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
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
  }, [user, loading, navigate, profile]);

  // If still loading, show loading state
  if (loading) {
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

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav />
          <div className="flex items-center gap-4">
            <NotificationsMenu />
            <UserAccountNav />
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
