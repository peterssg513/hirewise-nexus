import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, ClipboardCheck, Users, Settings, LogOut, 
  Menu, X, ChevronRight, BriefcaseBusiness, User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

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
  const { logout, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = location.pathname;
  const role = profile?.role;

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const renderSidebar = () => (
    <aside className="hidden md:flex flex-col items-center h-screen w-[72px] border-r bg-background p-2 pt-4 fixed top-0 left-0">
      <div className="mb-6">
        <Avatar className="h-12 w-12">
          <AvatarImage src="/logo.png" alt="PsychedHire" />
          <AvatarFallback className="bg-psyched-darkBlue text-white">PH</AvatarFallback>
        </Avatar>
      </div>

      <nav className="flex flex-col gap-4 items-center flex-grow">
        {role === 'psychologist' && (
          <>
            <NavButton
              tooltip="Dashboard"
              isActive={pathname === '/psychologist-dashboard'}
              onClick={() => navigate('/psychologist-dashboard')}
            >
              <LayoutDashboard className="h-5 w-5" />
            </NavButton>
            
            <NavButton
              tooltip="Job Listings"
              isActive={pathname === '/psychologist-dashboard/jobs'}
              onClick={() => navigate('/psychologist-dashboard/jobs')}
            >
              <BriefcaseBusiness className="h-5 w-5" />
            </NavButton>
            
            <NavButton
              tooltip="Applications"
              isActive={pathname === '/psychologist-dashboard/applications'}
              onClick={() => navigate('/psychologist-dashboard/applications')}
            >
              <ClipboardCheck className="h-5 w-5" />
            </NavButton>
            
            <NavButton
              tooltip="Profile"
              isActive={pathname === '/psychologist-dashboard/profile'}
              onClick={() => navigate('/psychologist-dashboard/profile')}
            >
              <User className="h-5 w-5" />
            </NavButton>
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
      
      <div className="mt-auto mb-2">
        <NavButton
          tooltip="Settings"
          isActive={false}
        >
          <Settings className="h-5 w-5" />
        </NavButton>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-12 w-12 mt-2 text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </aside>
  );

  const renderMobileMenu = () => (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/logo.png" alt="PsychedHire" />
              <AvatarFallback className="bg-psyched-darkBlue text-white">PH</AvatarFallback>
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
                <Button variant="ghost" className="justify-start gap-2" onClick={() => navigate('/psychologist-dashboard')}>
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
                <Button variant="ghost" className="justify-start gap-2" onClick={() => navigate('/psychologist-dashboard/jobs')}>
                  <BriefcaseBusiness className="h-4 w-4" />
                  Job Listings
                </Button>
                <Button variant="ghost" className="justify-start gap-2" onClick={() => navigate('/psychologist-dashboard/applications')}>
                  <ClipboardCheck className="h-4 w-4" />
                  Applications
                </Button>
                <Button variant="ghost" className="justify-start gap-2" onClick={() => navigate('/psychologist-dashboard/profile')}>
                  <User className="h-4 w-4" />
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
            <Button variant="ghost" className="justify-start gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button variant="ghost" className="justify-start gap-2 text-red-500 hover:text-red-600" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {renderMobileMenu()}
      {renderSidebar()}
      <div className="md:ml-[72px] p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
