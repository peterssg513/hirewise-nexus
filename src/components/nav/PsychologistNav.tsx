
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export const PsychologistNav = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/psychologist-dashboard', label: 'Dashboard' },
    { path: '/psychologist-dashboard/jobs', label: 'Jobs' },
    { path: '/psychologist-dashboard/evaluations', label: 'Evaluations' },
    { path: '/psychologist-dashboard/profile', label: 'Profile' },
  ];

  return (
    <>
      {navItems.map((item) => (
        <Link 
          key={item.path}
          to={item.path} 
          className={`font-medium relative ${
            location.pathname === item.path 
              ? 'text-psyched-lightBlue' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {item.label}
          {(location.pathname === item.path || 
            (item.path.includes('/evaluations') && location.pathname.includes('/evaluations'))) && (
            <motion.span 
              className="absolute -bottom-1 left-0 w-full h-0.5 bg-psyched-lightBlue rounded-full"
              layoutId="navbar-underline"
            />
          )}
        </Link>
      ))}
    </>
  );
};
