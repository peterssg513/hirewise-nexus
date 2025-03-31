
import React, { createContext, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthState, Profile, Role } from '@/hooks/useAuthState';
import { loginWithEmail, signUpWithEmail, logoutUser } from '@/services/authService';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role: Role) => Promise<void>;
  logout: () => Promise<void>;
  session: Session | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, session, isLoading, setProfile } = useAuthState();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle redirect after authentication changes
  useEffect(() => {
    // Only attempt navigation if we have loaded the profile and we're not on an auth page
    if (!isLoading && profile && !location.pathname.includes('/login') && !location.pathname.includes('/register') && !location.pathname.includes('/psychologist-signup') && !location.pathname.includes('/admin-secret-auth')) {
      const role = profile.role;
      if (role && location.pathname === '/') {
        if (role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate(`/${role}-dashboard`);
        }
      }
    }
  }, [profile, isLoading, navigate, location.pathname]);

  const login = async (email: string, password: string) => {
    try {
      const data = await loginWithEmail(email, password);
      
      if (data.user && profile) {
        // Redirect based on role
        if (profile.role) {
          if (profile.role === 'admin') {
            navigate('/admin-dashboard');
          } else {
            navigate(`/${profile.role}-dashboard`);
          }
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string, role: Role) => {
    try {
      const data = await signUpWithEmail(email, password, name, role);

      // If no email confirmation is required, we can redirect the user
      if (data.user && data.session) {
        // Wait for profile to be updated via auth state change
        
        if (role === 'psychologist') {
          navigate('/psychologist-signup');
        } else if (role === 'district') {
          navigate('/district-signup');
        } else if (role === 'admin') {
          navigate('/admin-dashboard');
        }
      } else {
        // Otherwise, redirect to login page
        navigate('/login');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile,
      session,
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      signUp,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
