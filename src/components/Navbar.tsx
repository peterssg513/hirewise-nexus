
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, ChevronDown, MapPin } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from '@/integrations/supabase/client';

const Navbar = () => {
  const { isAuthenticated, profile, user, logout } = useAuth();
  const location = useLocation();
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch profile picture if user is logged in
  useEffect(() => {
    const fetchProfilePic = async () => {
      if (user?.id && profile?.role === 'psychologist') {
        try {
          const { data, error } = await supabase
            .from('psychologists')
            .select('profile_picture_url')
            .eq('user_id', user.id)
            .single();
          
          console.log("Navbar - Profile picture data:", data);
            
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

  const getDashboardLink = () => {
    if (!profile?.role) return '/login';
    return `/${profile.role}-dashboard`;
  };

  const getInitials = () => {
    if (profile?.name) {
      return profile.name.split(' ').map(n => n[0]).join('');
    }
    return 'U';
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-white'} border-b border-gray-200`}>
      <div className="psyched-container py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <motion.div 
                className="bg-psyched-yellow font-bold px-2 py-1 text-psyched-darkBlue mr-1 rounded"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Psyched
              </motion.div>
              <motion.div 
                className="text-psyched-darkBlue font-semibold"
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Hire!
              </motion.div>
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-6">
            {isAuthenticated && profile?.role === 'psychologist' ? (
              <>
                <Link 
                  to="/psychologist-dashboard" 
                  className={`font-medium relative ${location.pathname === '/psychologist-dashboard' ? 'text-psyched-lightBlue' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Dashboard
                  {location.pathname === '/psychologist-dashboard' && (
                    <motion.span 
                      className="absolute -bottom-1 left-0 w-full h-0.5 bg-psyched-lightBlue rounded-full"
                      layoutId="navbar-underline"
                    />
                  )}
                </Link>
                <Link 
                  to="/psychologist-dashboard/jobs" 
                  className={`font-medium relative ${location.pathname === '/psychologist-dashboard/jobs' ? 'text-psyched-lightBlue' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Jobs
                  {location.pathname === '/psychologist-dashboard/jobs' && (
                    <motion.span 
                      className="absolute -bottom-1 left-0 w-full h-0.5 bg-psyched-lightBlue rounded-full" 
                      layoutId="navbar-underline"
                    />
                  )}
                </Link>
                <Link 
                  to="/psychologist-dashboard/evaluations" 
                  className={`font-medium relative ${location.pathname.includes('/psychologist-dashboard/evaluations') ? 'text-psyched-lightBlue' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Evaluations
                  {location.pathname.includes('/psychologist-dashboard/evaluations') && (
                    <motion.span 
                      className="absolute -bottom-1 left-0 w-full h-0.5 bg-psyched-lightBlue rounded-full" 
                      layoutId="navbar-underline"
                    />
                  )}
                </Link>
                <Link 
                  to="/psychologist-dashboard/profile" 
                  className={`font-medium relative ${location.pathname === '/psychologist-dashboard/profile' ? 'text-psyched-lightBlue' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Profile
                  {location.pathname === '/psychologist-dashboard/profile' && (
                    <motion.span 
                      className="absolute -bottom-1 left-0 w-full h-0.5 bg-psyched-lightBlue rounded-full" 
                      layoutId="navbar-underline"
                    />
                  )}
                </Link>
              </>
            ) : (
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
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-9 w-9 ring-2 ring-psyched-cream">
                        <AvatarImage src={profilePicUrl || undefined} alt="Profile" />
                        <AvatarFallback className="bg-psyched-darkBlue text-white">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{profile?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {profile?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={getDashboardLink()}>Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/psychologist-dashboard/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-500" onClick={() => logout()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-psyched-darkBlue">
                    Log in
                  </Button>
                </Link>
                <Link to="/register">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button className="bg-psyched-darkBlue text-white hover:bg-psyched-darkBlue/90">
                      Sign up
                    </Button>
                  </motion.div>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
