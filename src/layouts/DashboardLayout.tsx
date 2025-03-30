
import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { 
  Calendar, FileText, Home, LogOut, Settings, User, 
  Briefcase, ListChecks, ClipboardList, Search, ArrowRight
} from 'lucide-react';

const DashboardLayout = () => {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const roleName = profile?.role ? {
    'psychologist': 'School Psychologist',
    'district': 'School District',
    'admin': 'Administrator'
  }[profile.role] : 'User';
  
  // Determine if route is active
  const isActive = (path: string) => {
    if (path === '/psychologist-dashboard' && location.pathname === '/psychologist-dashboard') {
      return true;
    }
    if (path !== '/psychologist-dashboard' && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };
  
  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen bg-psyched-cream">
        <Sidebar className="border-r bg-white">
          <SidebarHeader>
            <div className="flex items-center p-2">
              <div 
                className="bg-psyched-yellow font-bold px-2 py-1 text-psyched-darkBlue mr-1 cursor-pointer"
                onClick={() => navigate('/')}
              >
                Psyched
              </div>
              <div 
                className="text-psyched-darkBlue font-semibold cursor-pointer"
                onClick={() => navigate('/')}
              >
                Hire
              </div>
              <SidebarTrigger className="ml-auto" />
            </div>
            <div className="px-2 py-2">
              <div className="rounded-lg bg-gray-50 p-2">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-psyched-darkBlue/10 flex items-center justify-center text-psyched-darkBlue">
                    <User size={18} />
                  </div>
                  <div className="truncate">
                    <div className="text-sm font-medium truncate">
                      {profile?.name || 'Guest'}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {roleName}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {profile?.role === 'psychologist' && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      tooltip="Dashboard" 
                      active={isActive('/psychologist-dashboard')}
                      onClick={() => navigate('/psychologist-dashboard')}
                    >
                      <Home className="mr-2" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      tooltip="Profile" 
                      active={isActive('/psychologist-dashboard/profile')}
                      onClick={() => navigate('/psychologist-dashboard/profile')}
                    >
                      <User className="mr-2" />
                      <span>Profile</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      tooltip="Job Listings" 
                      active={isActive('/psychologist-dashboard/jobs')}
                      onClick={() => navigate('/psychologist-dashboard/jobs')}
                    >
                      <Briefcase className="mr-2" />
                      <span>Job Listings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      tooltip="My Applications" 
                      active={isActive('/psychologist-dashboard/applications')}
                      onClick={() => navigate('/psychologist-dashboard/applications')}
                    >
                      <ClipboardList className="mr-2" />
                      <span>Applications</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      tooltip="Evaluations" 
                      active={isActive('/psychologist-dashboard/evaluation')}
                    >
                      <ListChecks className="mr-2" />
                      <span>Evaluations</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
              
              {profile?.role === 'district' && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Dashboard">
                      <Home className="mr-2" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Job Postings">
                      <FileText className="mr-2" />
                      <span>Job Postings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Applications">
                      <FileText className="mr-2" />
                      <span>Applications</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Find Psychologists">
                      <Search className="mr-2" />
                      <span>Find Psychologists</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Evaluation Reports">
                      <Calendar className="mr-2" />
                      <span>Evaluation Reports</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
              
              {profile?.role === 'admin' && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Dashboard">
                      <Home className="mr-2" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Users">
                      <User className="mr-2" />
                      <span>Users</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Job Approvals">
                      <FileText className="mr-2" />
                      <span>Job Approvals</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Compliance">
                      <FileText className="mr-2" />
                      <span>Compliance</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
              
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings">
                  <Settings className="mr-2" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <div className="p-2">
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </Button>
            </div>
            
            <div className="p-2 text-center">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-xs text-muted-foreground"
                onClick={() => navigate('/')}
              >
                <span>PsychedHire</span>
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div className="psyched-container py-4 px-6 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
