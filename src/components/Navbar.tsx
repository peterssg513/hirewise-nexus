
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { NavLogo } from './nav/NavLogo';
import { MainNav } from './nav/MainNav';
import { UserAccountNav } from './nav/UserAccountNav';
import { AuthButtons } from './nav/AuthButtons';
import { PsychologistNav } from './nav/PsychologistNav';
import { PublicNav } from './nav/PublicNav';

const Navbar = () => {
  const { isAuthenticated, profile, user, logout } = useAuth();
  const location = useLocation();
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Skip rendering if we're on an admin dashboard page
  const isDashboardRoute = location.pathname.includes('dashboard');
  if (isDashboardRoute) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchProfilePic = async () => {
      if (user?.id && profile?.role === 'psychologist') {
        try {
          const { data, error } = await supabase
            .from('psychologists')
            .select('profile_picture_url')
            .eq('user_id', user.id)
            .single();
            
          if (!error && data?.profile_picture_url) {
            setProfilePicUrl(data.profile_picture_url);
          }
        } catch (error) {
          console.error('Failed to fetch profile picture:', error);
        }
      }
    };
    
    if (isAuthenticated) {
      fetchProfilePic();
    }
  }, [isAuthenticated, user?.id, profile?.role]);

  const renderNavLinks = () => {
    if (isAuthenticated) {
      if (profile?.role === 'psychologist') {
        return <PsychologistNav />;
      } else if (profile?.role === 'admin') {
        return null;
      } else {
        return <PublicNav />;
      }
    } else {
      return <PublicNav />;
    }
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-white'} border-b border-gray-200`}>
      <div className="psyched-container py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <NavLogo />
            {renderNavLinks()}
          </div>
          
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <UserAccountNav 
                  profile={profile} 
                  profilePicUrl={profilePicUrl} 
                  onLogout={logout} 
                />
              </div>
            ) : (
              <AuthButtons />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
