
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  School,
  UserCheck,
  FileText,
  Building,
  CheckSquare,
} from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const AdminNavItems = () => {
  const location = useLocation();

  const navItems = [
    { 
      path: '/admin-dashboard', 
      label: 'Dashboard',
      icon: LayoutDashboard,
      exact: true 
    },
    { 
      path: '/admin-dashboard/approvals', 
      label: 'Approvals',
      icon: CheckSquare
    },
    { 
      path: '/admin-dashboard/districts', 
      label: 'Districts',
      icon: Building 
    },
    { 
      path: '/admin-dashboard/psychologists', 
      label: 'Psychologists',
      icon: UserCheck 
    },
    { 
      path: '/admin-dashboard/schools', 
      label: 'Schools',
      icon: School 
    },
    { 
      path: '/admin-dashboard/jobs', 
      label: 'Jobs',
      icon: Briefcase 
    },
    { 
      path: '/admin-dashboard/evaluations', 
      label: 'Evaluations',
      icon: FileText 
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
      <SidebarGroupLabel>Administration</SidebarGroupLabel>
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

export default AdminNavItems;
