
import React from 'react';
import { Link } from 'react-router-dom';
import { MainNav } from './MainNav';
import { useAuth } from '@/contexts/AuthContext';

export const PublicNav = () => {
  const { profile } = useAuth();
  
  // If user is logged in as district, show district navigation
  if (profile?.role === 'district') {
    return (
      <MainNav
        items={[
          { label: 'Dashboard', href: '/district-dashboard' },
          { label: 'Jobs', href: '/district-dashboard/jobs' },
          { label: 'Schools', href: '/district-dashboard/schools' },
          { label: 'Students', href: '/district-dashboard/students' },
          { label: 'Evaluations', href: '/district-dashboard/evaluations' },
          { label: 'Settings', href: '/district-dashboard/settings' },
        ]}
      />
    );
  }
  
  // Default public navigation
  return (
    <MainNav
      items={[
        { label: 'Home', href: '/' },
        { label: 'For Districts', href: '/for-districts' },
        { label: 'For Psychologists', href: '/for-psychologists' },
      ]}
    />
  );
};
