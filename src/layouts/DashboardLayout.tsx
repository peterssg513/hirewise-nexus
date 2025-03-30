
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, ClipboardCheck, Users, Settings, LogOut, 
  Menu, X, ChevronRight, BriefcaseBusiness, User, FileSpreadsheet,
  ChevronLeft, PanelLeft, Phone, Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

// Sidebar Navigation Button Component
const SidebarNavButton = ({ 
  icon, 
  label, 
  active, 
  onClick, 
  expanded
}: { 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean; 
  onClick?: () => void;
  expanded: boolean;
}) => {
  return (
    <Button
      variant="ghost"
      size={expanded ? "default" : "icon"}
      className={cn(
        "relative w-full justify-start gap-3 px-3",
        active && "bg-psyched-darkBlue/10 text-psyched-darkBlue font-medium"
      )}
      onClick={onClick}
    >
      {icon}
      {expanded && (
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="overflow-hidden whitespace-nowrap"
        >
          {label}
        </motion.span>
      )}
    </Button>
  );
};

// Mobile Navigation Button Component
const MobileNavButton = ({ 
  icon, 
  label, 
  onClick
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) => {
  return (
    <Button 
      variant="ghost" 
      className="justify-start gap-2 my-1 hover:bg-psyched-darkBlue/10" 
      onClick={onClick}
    >
      {icon}
      {label}
    </Button>
  );
};

const DashboardLayout = () => {
  const { logout, profile, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const pathname = location.pathname;
  const role = profile?.role;

  // Fetch profile picture if user is logged in
  useEffect(() => {
    const fetchProfilePic = async () => {
      if (user?.id && role === 'psychologist') {
        try {
          const { data, error } = await supabase
            .from('psychologists')
            .select('profile_picture_url')
            .eq('user_id', user.id)
            .single();
            
          console.log("Dashboard Layout - Profile Pic Data:", data);
            
          if (!error && data?.profile_picture_url) {
            setProfilePicUrl(data.profile_picture_url);
          }
        } catch (error) {
          console.error('Failed to fetch profile picture:', error);
        }
      }
    };
    
    fetchProfilePic();
  }, [user?.id, role]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const getInitials = () => {
    if (profile?.name) {
      return profile.name.split(' ').map(n => n[0]).join('');
    }
    return 'PH';
  };

  const renderSidebar = () => (
    <motion.aside 
      className={cn(
        "hidden md:flex flex-col items-center h-screen border-r bg-psyched-cream shadow-sm fixed top-0 left-0 z-10 transition-all duration-300",
        isSidebarExpanded ? "w-[200px]" : "w-[72px]"
      )}
      initial={{ width: 72 }}
      animate={{ width: isSidebarExpanded ? 200 : 72 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex items-center justify-center my-6 relative">
        <Avatar className="h-12 w-12 transition-all duration-300 hover:scale-105">
          {profilePicUrl ? (
            <AvatarImage 
              src={profilePicUrl} 
              alt={profile?.name || 'Profile'} 
              className="object-cover" 
            />
          ) : (
            <AvatarFallback className="bg-psyched-darkBlue text-white">
              {getInitials()}
            </AvatarFallback>
          )}
        </Avatar>
        
        {isSidebarExpanded && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="ml-3 text-sm font-medium text-psyched-darkBlue overflow-hidden whitespace-nowrap"
          >
            {profile?.name || 'Welcome'}
          </motion.div>
        )}
      </div>

      <Button 
        variant="ghost"
        size="icon"
        className="absolute right-[-12px] top-8 h-6 w-6 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-100"
        onClick={toggleSidebar}
      >
        {isSidebarExpanded ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
      </Button>

      <nav className="flex flex-col gap-2 items-center flex-grow w-full">
        {role === 'psychologist' && (
          <>
            <SidebarNavButton
              icon={<LayoutDashboard className="h-5 w-5 text-psyched-darkBlue" />}
              label="Dashboard"
              active={pathname === '/psychologist-dashboard'}
              onClick={() => navigate('/psychologist-dashboard')}
              expanded={isSidebarExpanded}
            />
            
            <SidebarNavButton
              icon={<BriefcaseBusiness className="h-5 w-5 text-psyched-darkBlue" />}
              label="Job Listings"
              active={pathname === '/psychologist-dashboard/jobs'}
              onClick={() => navigate('/psychologist-dashboard/jobs')}
              expanded={isSidebarExpanded}
            />
            
            <SidebarNavButton
              icon={<FileSpreadsheet className="h-5 w-5 text-psyched-darkBlue" />}
              label="Evaluations"
              active={pathname === '/psychologist-dashboard/evaluations'}
              onClick={() => navigate('/psychologist-dashboard/evaluations')}
              expanded={isSidebarExpanded}
            />
            
            <SidebarNavButton
              icon={<ClipboardCheck className="h-5 w-5 text-psyched-darkBlue" />}
              label="Applications"
              active={pathname === '/psychologist-dashboard/applications'}
              onClick={() => navigate('/psychologist-dashboard/applications')}
              expanded={isSidebarExpanded}
            />
            
            <SidebarNavButton
              icon={<User className="h-5 w-5 text-psyched-darkBlue" />}
              label="Profile"
              active={pathname === '/psychologist-dashboard/profile'}
              onClick={() => navigate('/psychologist-dashboard/profile')}
              expanded={isSidebarExpanded}
            />
          </>
        )}
        
        {role === 'district' && (
          <>
            <SidebarNavButton
              icon={<LayoutDashboard className="h-5 w-5 text-psyched-darkBlue" />}
              label="Dashboard"
              active={pathname === '/district-dashboard'}
              onClick={() => navigate('/district-dashboard')}
              expanded={isSidebarExpanded}
            />
            
            <SidebarNavButton
              icon={<Users className="h-5 w-5 text-psyched-darkBlue" />}
              label="Users"
              expanded={isSidebarExpanded}
            />
          </>
        )}
        
        {role === 'admin' && (
          <>
            <SidebarNavButton
              icon={<LayoutDashboard className="h-5 w-5 text-psyched-darkBlue" />}
              label="Dashboard"
              active={pathname === '/admin-dashboard'}
              onClick={() => navigate('/admin-dashboard')}
              expanded={isSidebarExpanded}
            />
            
            <SidebarNavButton
              icon={<Users className="h-5 w-5 text-psyched-darkBlue" />}
              label="Users"
              expanded={isSidebarExpanded}
            />
          </>
        )}
      </nav>
      
      <div className="mt-auto mb-6 w-full px-2">
        <Separator className="my-4" />
        <SidebarNavButton
          icon={<Settings className="h-5 w-5 text-psyched-darkBlue" />}
          label="Settings"
          active={pathname === '/psychologist-dashboard/settings'}
          onClick={() => navigate('/psychologist-dashboard/settings')}
          expanded={isSidebarExpanded}
        />
        
        <Button 
          variant="ghost" 
          size={isSidebarExpanded ? "default" : "icon"}
          className="relative w-full justify-start gap-3 px-3 text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {isSidebarExpanded && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="overflow-hidden whitespace-nowrap"
            >
              Logout
            </motion.span>
          )}
        </Button>
      </div>
    </motion.aside>
  );

  const renderMobileMenu = () => (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-10 bg-white/80 backdrop-blur-sm rounded-full shadow-md">
          <Menu className="h-5 w-5 text-psyched-darkBlue" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0 bg-psyched-cream">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4">
            <Avatar className="h-8 w-8">
              {profilePicUrl ? (
                <AvatarImage src={profilePicUrl} alt="Profile" className="object-cover" />
              ) : (
                <AvatarFallback className="bg-psyched-darkBlue text-white">{getInitials()}</AvatarFallback>
              )}
            </Avatar>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <X className="h-5 w-5" />
              </Button>
            </SheetTrigger>
          </div>
          <Separator />
          <nav className="flex flex-col p-2">
            {role === 'psychologist' && (
              <>
                <MobileNavButton
                  icon={<LayoutDashboard className="h-4 w-4 text-psyched-darkBlue" />}
                  label="Dashboard"
                  onClick={() => navigate('/psychologist-dashboard')}
                />
                <MobileNavButton
                  icon={<BriefcaseBusiness className="h-4 w-4 text-psyched-darkBlue" />}
                  label="Job Listings"
                  onClick={() => navigate('/psychologist-dashboard/jobs')}
                />
                <MobileNavButton
                  icon={<FileSpreadsheet className="h-4 w-4 text-psyched-darkBlue" />}
                  label="Evaluations"
                  onClick={() => navigate('/psychologist-dashboard/evaluations')}
                />
                <MobileNavButton
                  icon={<ClipboardCheck className="h-4 w-4 text-psyched-darkBlue" />}
                  label="Applications"
                  onClick={() => navigate('/psychologist-dashboard/applications')}
                />
                <MobileNavButton
                  icon={<User className="h-4 w-4 text-psyched-darkBlue" />}
                  label="Profile"
                  onClick={() => navigate('/psychologist-dashboard/profile')}
                />
              </>
            )}
            {role === 'district' && (
              <>
                <MobileNavButton
                  icon={<LayoutDashboard className="h-4 w-4 text-psyched-darkBlue" />}
                  label="Dashboard"
                  onClick={() => navigate('/district-dashboard')}
                />
                <MobileNavButton
                  icon={<Users className="h-4 w-4 text-psyched-darkBlue" />}
                  label="Users"
                />
              </>
            )}
            {role === 'admin' && (
              <>
                <MobileNavButton
                  icon={<LayoutDashboard className="h-4 w-4 text-psyched-darkBlue" />}
                  label="Dashboard"
                  onClick={() => navigate('/admin-dashboard')}
                />
                <MobileNavButton
                  icon={<Users className="h-4 w-4 text-psyched-darkBlue" />}
                  label="Users"
                />
              </>
            )}
          </nav>
          <Separator />
          <nav className="mt-auto p-2">
            <MobileNavButton
              icon={<Settings className="h-4 w-4 text-psyched-darkBlue" />}
              label="Settings"
              onClick={() => navigate('/psychologist-dashboard/settings')}
            />
            <Button 
              variant="ghost" 
              className="justify-start gap-2 my-1 text-red-500 hover:text-red-600 hover:bg-red-50" 
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="min-h-screen bg-psyched-cream">
      {renderMobileMenu()}
      {renderSidebar()}
      <div 
        className={cn(
          "transition-all duration-300",
          isSidebarExpanded ? "md:ml-[200px]" : "md:ml-[72px]"
        )}
      >
        <motion.div 
          className="p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardLayout;
