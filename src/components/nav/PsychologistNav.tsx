
import React from 'react';
import { NavLink } from '@/components/ui/nav-link';
import { Briefcase, FileText, ClipboardList, UserCircle, Settings } from 'lucide-react';

export const PsychologistNav = () => {
  return (
    <nav className="flex space-x-6">
      <NavLink to="/psychologist-dashboard">
        <span className="hidden md:flex items-center">
          <FileText className="mr-1 h-4 w-4" />
          Dashboard
        </span>
        <span className="md:hidden">
          <FileText className="h-5 w-5" />
        </span>
      </NavLink>
      <NavLink to="/psychologist-dashboard/jobs">
        <span className="hidden md:flex items-center">
          <Briefcase className="mr-1 h-4 w-4" />
          Jobs
        </span>
        <span className="md:hidden">
          <Briefcase className="h-5 w-5" />
        </span>
      </NavLink>
      <NavLink to="/psychologist-dashboard/evaluations">
        <span className="hidden md:flex items-center">
          <ClipboardList className="mr-1 h-4 w-4" />
          Evaluations
        </span>
        <span className="md:hidden">
          <ClipboardList className="h-5 w-5" />
        </span>
      </NavLink>
      <NavLink to="/psychologist-dashboard/applications">
        <span className="hidden md:flex items-center">
          <FileText className="mr-1 h-4 w-4" />
          Applications
        </span>
        <span className="md:hidden">
          <FileText className="h-5 w-5" />
        </span>
      </NavLink>
      <NavLink to="/psychologist-dashboard/profile">
        <span className="hidden md:flex items-center">
          <UserCircle className="mr-1 h-4 w-4" />
          Profile
        </span>
        <span className="md:hidden">
          <UserCircle className="h-5 w-5" />
        </span>
      </NavLink>
    </nav>
  );
};
