
import React from 'react';
import { Outlet } from 'react-router-dom';
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
import { Calendar, FileText, Home, LogOut, Settings, User } from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();

  const roleName = user?.role ? {
    'psychologist': 'School Psychologist',
    'district': 'School District',
    'admin': 'Administrator'
  }[user.role] : 'User';

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen bg-psyched-cream">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center p-2">
              <div className="bg-psyched-yellow font-bold px-2 py-1 text-psyched-darkBlue mr-1">
                Psyched
              </div>
              <div className="text-psyched-darkBlue font-semibold">
                Hire
              </div>
              <SidebarTrigger className="ml-auto" />
            </div>
            <div className="px-2 py-2">
              <div className="rounded-lg bg-sidebar-accent p-2">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-accent-foreground">
                    <User size={18} />
                  </div>
                  <div className="truncate">
                    <div className="text-sm font-medium truncate">
                      {user?.name || 'Guest'}
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
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Dashboard">
                  <Home className="mr-2" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {user?.role === 'psychologist' && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Job Listings">
                      <FileText className="mr-2" />
                      <span>Job Listings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="My Applications">
                      <FileText className="mr-2" />
                      <span>My Applications</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Evaluations">
                      <FileText className="mr-2" />
                      <span>Evaluations</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
              
              {user?.role === 'district' && (
                <>
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
                    <SidebarMenuButton tooltip="Evaluation Reports">
                      <Calendar className="mr-2" />
                      <span>Evaluation Reports</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
              
              {user?.role === 'admin' && (
                <>
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
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div className="psyched-container py-4">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
