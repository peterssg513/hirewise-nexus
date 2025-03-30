
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";

type Role = 'psychologist' | 'district' | 'admin' | null;

interface Profile {
  id: string;
  email: string;
  name: string | null;
  role: Role;
}

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
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch user profile data
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data as Profile;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Set up auth state listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, currentSession) => {
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            
            // Fetch profile if user is authenticated
            if (currentSession?.user) {
              setTimeout(async () => {
                const profileData = await fetchProfile(currentSession.user.id);
                setProfile(profileData);
              }, 0);
            } else {
              setProfile(null);
            }
          }
        );

        // THEN check for existing session
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user ?? null);
        
        if (data.session?.user) {
          const profileData = await fetchProfile(data.session.user.id);
          setProfile(profileData);
        }
        
        setIsLoading(false);
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error in initializeAuth:', error);
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Handle redirect after authentication changes
  useEffect(() => {
    // Only attempt navigation if we have loaded the profile and we're not on an auth page
    if (!isLoading && profile && !location.pathname.includes('/login') && !location.pathname.includes('/register') && !location.pathname.includes('/psychologist-signup')) {
      const role = profile.role;
      if (role && location.pathname === '/') {
        navigate(`/${role}-dashboard`);
      }
    }
  }, [profile, isLoading, navigate, location.pathname]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      if (data.user) {
        const profileData = await fetchProfile(data.user.id);
        setProfile(profileData);
        
        // Redirect based on role
        if (profileData?.role) {
          navigate(`/${profileData.role}-dashboard`);
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, role: Role) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });

      if (error) {
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: "Registration successful",
        description: "Please check your email for verification",
      });

      // If no email confirmation is required, we can redirect the user
      if (data.user && data.session) {
        const profileData = await fetchProfile(data.user.id);
        setProfile(profileData);
        
        if (profileData?.role) {
          navigate(`/${profileData.role}-dashboard`);
        }
      } else {
        // Otherwise, redirect to login page
        navigate('/login');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
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
