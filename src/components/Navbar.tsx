
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { NavLogo } from './nav/NavLogo';
import { PublicNav } from './nav/PublicNav';
import { AuthButtons } from './nav/AuthButtons';

const Navbar = () => {
  const { isAuthenticated, profile, logout } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  // Determine if we should render the navbar (only on landing pages)
  const shouldRenderPublicNav = 
    location.pathname === '/' || 
    location.pathname === '/for-psychologists' || 
    location.pathname === '/for-districts' ||
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/forgot-password' ||
    location.pathname === '/update-password' ||
    location.pathname === '/psychologist-signup' ||
    location.pathname === '/district-signup';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!shouldRenderPublicNav) {
    return null;
  }

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-white'} border-b border-gray-200`}>
      <div className="psyched-container py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <NavLogo />
            <div className="hidden md:flex space-x-6">
              <PublicNav />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <AuthButtons />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
