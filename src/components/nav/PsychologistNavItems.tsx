
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  ClipboardList,
  User,
  Settings,
} from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const PsychologistNavItems = () => {
  const location = useLocation();

  const navItems = [
    { 
      path: '/psychologist-dashboard', 
      label: 'Dashboard',
      icon: LayoutDashboard,
      exact: true 
    },
    { 
      path: '/psychologist-dashboard/jobs', 
      label: 'Jobs',
      icon: Briefcase 
    },
    { 
      path: '/psychologist-dashboard/evaluations', 
      label: 'Evaluations',
      icon: FileText 
    },
    { 
      path: '/psychologist-dashboard/applications', 
      label: 'Applications',
      icon: ClipboardList 
    },
    { 
      path: '/psychologist-dashboard/profile', 
      label: 'Profile',
      icon: User 
    },
    { 
      path: '/psychologist-dashboard/settings', 
      label: 'Settings',
      icon: Settings 
    },
  ];

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Psychologist</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton 
                asChild 
                isActive={isActive(item)}
                tooltip={item.label}
              >
                <Link to={item.path}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default PsychologistNavItems;
