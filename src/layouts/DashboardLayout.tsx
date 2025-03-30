
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, ClipboardCheck, Users, Settings, LogOut, 
  Menu, X, ChevronRight, BriefcaseBusiness, User, FileSpreadsheet,
  ChevronLeft, PanelLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { motion } from 'framer-motion';

interface NavButtonProps {
  children: React.ReactNode;
  tooltip: string;
  isActive?: boolean;
  onClick?: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ children, tooltip, isActive, onClick }) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-12 w-12",
              isActive && "bg-muted"
            )}
            onClick={onClick}
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
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
          const { supabase } = await import('@/integrations/supabase/client');
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
          <AvatarImage src={profilePicUrl || "/logo.png"} alt="Profile" />
          <AvatarFallback className="bg-psyched-darkBlue text-white">{getInitials()}</AvatarFallback>
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
            <Button
              variant="ghost"
              size={isSidebarExpanded ? "default" : "icon"}
              className={cn(
                "relative w-full justify-start gap-3 px-3",
                pathname === '/psychologist-dashboard' && "bg-psyched-darkBlue/10 text-psyched-darkBlue font-medium"
              )}
              onClick={() => navigate('/psychologist-dashboard')}
            >
              <LayoutDashboard className="h-5 w-5 text-psyched-darkBlue" />
              {isSidebarExpanded && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  Dashboard
                </motion.span>
              )}
            </Button>
            
            <Button
              variant="ghost"
              size={isSidebarExpanded ? "default" : "icon"}
              className={cn(
                "relative w-full justify-start gap-3 px-3",
                pathname === '/psychologist-dashboard/jobs' && "bg-psyched-darkBlue/10 text-psyched-darkBlue font-medium"
              )}
              onClick={() => navigate('/psychologist-dashboard/jobs')}
            >
              <BriefcaseBusiness className="h-5 w-5 text-psyched-darkBlue" />
              {isSidebarExpanded && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  Job Listings
                </motion.span>
              )}
            </Button>
            
            <Button
              variant="ghost"
              size={isSidebarExpanded ? "default" : "icon"}
              className={cn(
                "relative w-full justify-start gap-3 px-3",
                pathname === '/psychologist-dashboard/evaluations' && "bg-psyched-darkBlue/10 text-psyched-darkBlue font-medium"
              )}
              onClick={() => navigate('/psychologist-dashboard/evaluations')}
            >
              <FileSpreadsheet className="h-5 w-5 text-psyched-darkBlue" />
              {isSidebarExpanded && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  Evaluations
                </motion.span>
              )}
            </Button>
            
            <Button
              variant="ghost"
              size={isSidebarExpanded ? "default" : "icon"}
              className={cn(
                "relative w-full justify-start gap-3 px-3",
                pathname === '/psychologist-dashboard/applications' && "bg-psyched-darkBlue/10 text-psyched-darkBlue font-medium"
              )}
              onClick={() => navigate('/psychologist-dashboard/applications')}
            >
              <ClipboardCheck className="h-5 w-5 text-psyched-darkBlue" />
              {isSidebarExpanded && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  Applications
                </motion.span>
              )}
            </Button>
            
            <Button
              variant="ghost"
              size={isSidebarExpanded ? "default" : "icon"}
              className={cn(
                "relative w-full justify-start gap-3 px-3",
                pathname === '/psychologist-dashboard/profile' && "bg-psyched-darkBlue/10 text-psyched-darkBlue font-medium"
              )}
              onClick={() => navigate('/psychologist-dashboard/profile')}
            >
              <User className="h-5 w-5 text-psyched-darkBlue" />
              {isSidebarExpanded && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  Profile
                </motion.span>
              )}
            </Button>
          </>
        )}
        
        {role === 'district' && (
          <>
            <NavButton
              tooltip="Dashboard"
              isActive={pathname === '/district-dashboard'}
              onClick={() => navigate('/district-dashboard')}
            >
              <LayoutDashboard className="h-5 w-5" />
            </NavButton>
            
            <NavButton
              tooltip="Users"
              isActive={false}
            >
              <Users className="h-5 w-5" />
            </NavButton>
          </>
        )}
        
        {role === 'admin' && (
          <>
            <NavButton
              tooltip="Dashboard"
              isActive={pathname === '/admin-dashboard'}
              onClick={() => navigate('/admin-dashboard')}
            >
              <LayoutDashboard className="h-5 w-5" />
            </NavButton>
            
            <NavButton
              tooltip="Users"
              isActive={false}
            >
              <Users className="h-5 w-5" />
            </NavButton>
          </>
        )}
      </nav>
      
      <div className="mt-auto mb-6 w-full px-2">
        <Separator className="my-4" />
        <Button
          variant="ghost"
          size={isSidebarExpanded ? "default" : "icon"}
          className="relative w-full justify-start gap-3 px-3"
        >
          <Settings className="h-5 w-5 text-psyched-darkBlue" />
          {isSidebarExpanded && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="overflow-hidden whitespace-nowrap"
            >
              Settings
            </motion.span>
          )}
        </Button>
        
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
              <AvatarImage src={profilePicUrl || "/logo.png"} alt="Profile" />
              <AvatarFallback className="bg-psyched-darkBlue text-white">{getInitials()}</AvatarFallback>
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
                <Button variant="ghost" className="justify-start gap-2 my-1 hover:bg-psyched-darkBlue/10" onClick={() => navigate('/psychologist-dashboard')}>
                  <LayoutDashboard className="h-4 w-4 text-psyched-darkBlue" />
                  Dashboard
                </Button>
                <Button variant="ghost" className="justify-start gap-2 my-1 hover:bg-psyched-darkBlue/10" onClick={() => navigate('/psychologist-dashboard/jobs')}>
                  <BriefcaseBusiness className="h-4 w-4 text-psyched-darkBlue" />
                  Job Listings
                </Button>
                <Button variant="ghost" className="justify-start gap-2 my-1 hover:bg-psyched-darkBlue/10" onClick={() => navigate('/psychologist-dashboard/evaluations')}>
                  <FileSpreadsheet className="h-4 w-4 text-psyched-darkBlue" />
                  Evaluations
                </Button>
                <Button variant="ghost" className="justify-start gap-2 my-1 hover:bg-psyched-darkBlue/10" onClick={() => navigate('/psychologist-dashboard/applications')}>
                  <ClipboardCheck className="h-4 w-4 text-psyched-darkBlue" />
                  Applications
                </Button>
                <Button variant="ghost" className="justify-start gap-2 my-1 hover:bg-psyched-darkBlue/10" onClick={() => navigate('/psychologist-dashboard/profile')}>
                  <User className="h-4 w-4 text-psyched-darkBlue" />
                  Profile
                </Button>
              </>
            )}
            {role === 'district' && (
              <>
                <Button variant="ghost" className="justify-start gap-2" onClick={() => navigate('/district-dashboard')}>
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
                <Button variant="ghost" className="justify-start gap-2">
                  <Users className="h-4 w-4" />
                  Users
                </Button>
              </>
            )}
            {role === 'admin' && (
              <>
                <Button variant="ghost" className="justify-start gap-2" onClick={() => navigate('/admin-dashboard')}>
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
                <Button variant="ghost" className="justify-start gap-2">
                  <Users className="h-4 w-4" />
                  Users
                </Button>
              </>
            )}
          </nav>
          <Separator />
          <nav className="mt-auto p-2">
            <Button variant="ghost" className="justify-start gap-2 my-1 hover:bg-psyched-darkBlue/10">
              <Settings className="h-4 w-4 text-psyched-darkBlue" />
              Settings
            </Button>
            <Button variant="ghost" className="justify-start gap-2 my-1 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
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
