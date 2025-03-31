
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export const PublicNav = () => {
  const location = useLocation();
  
  return (
    <>
      <Link 
        to="/for-psychologists" 
        className={`font-medium relative ${location.pathname === '/for-psychologists' ? 'text-psyched-lightBlue' : 'text-gray-600 hover:text-gray-900'}`}
      >
        For School Psychologists
        {location.pathname === '/for-psychologists' && (
          <motion.span 
            className="absolute -bottom-1 left-0 w-full h-0.5 bg-psyched-lightBlue rounded-full" 
            layoutId="navbar-underline"
          />
        )}
      </Link>
      <Link 
        to="/for-districts" 
        className={`font-medium relative ${location.pathname === '/for-districts' ? 'text-psyched-orange' : 'text-gray-600 hover:text-gray-900'}`}
      >
        For Districts/Schools
        {location.pathname === '/for-districts' && (
          <motion.span 
            className="absolute -bottom-1 left-0 w-full h-0.5 bg-psyched-orange rounded-full" 
            layoutId="navbar-underline"
          />
        )}
      </Link>
    </>
  );
};
