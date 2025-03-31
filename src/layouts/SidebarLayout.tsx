
import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import { NavLogo } from '@/components/nav/NavLogo';
import AdminNavItems from '@/components/nav/AdminNavItems';
import PsychologistNavItems from '@/components/nav/PsychologistNavItems';
import DistrictNavItems from '@/components/nav/DistrictNavItems';
import { UserAccountNav } from '@/components/nav/UserAccountNav';
import NotificationsMenu from '@/components/nav/NotificationsMenu';
import { setup as setupDatabaseUtils } from '@/services/databaseUtilsService';
import { supabase } from '@/integrations/supabase/client';

const SidebarLayout = () => {
  const { user, isLoading, profile, logout } = useAuth();
  const [profilePicUrl, setProfilePicUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
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
  }, [user, profile]);

  const renderNavContent = () => {
    if (!profile) return null;

    switch (profile.role) {
      case 'admin':
        return <AdminNavItems />;
      case 'psychologist':
        return <PsychologistNavItems />;
      case 'district':
        return <DistrictNavItems />;
      default:
        return null;
    }
  };

  // If still loading, show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="container flex-1 py-6">
          <div className="h-[200px] rounded-md border border-dashed flex items-center justify-center text-muted-foreground">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="p-4">
            <NavLogo />
          </SidebarHeader>
          <SidebarContent>
            {renderNavContent()}
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <div className="flex items-center justify-between">
              <UserAccountNav profile={profile} profilePicUrl={profilePicUrl} onLogout={logout} />
              <NotificationsMenu />
            </div>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <div className="container py-6">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default SidebarLayout;
