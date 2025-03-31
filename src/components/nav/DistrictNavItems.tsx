
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Briefcase,
  School,
  Users,
  FileText,
  Settings,
  LayoutDashboard,
} from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const DistrictNavItems = () => {
  const location = useLocation();

  const navItems = [
    { 
      path: '/district-dashboard', 
      label: 'Dashboard',
      icon: LayoutDashboard,
      exact: true 
    },
    { 
      path: '/district-dashboard/jobs', 
      label: 'Jobs',
      icon: Briefcase 
    },
    { 
      path: '/district-dashboard/schools', 
      label: 'Schools',
      icon: School 
    },
    { 
      path: '/district-dashboard/students', 
      label: 'Students',
      icon: Users 
    },
    { 
      path: '/district-dashboard/evaluations', 
      label: 'Evaluations',
      icon: FileText 
    },
    { 
      path: '/district-dashboard/settings', 
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
      <SidebarGroupLabel>District</SidebarGroupLabel>
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

export default DistrictNavItems;
