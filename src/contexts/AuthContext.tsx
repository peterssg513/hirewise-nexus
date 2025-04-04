import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';

// AuthContext interface
interface AuthContextType {
  user: User | null;
  profile: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ user: User | null; error: Error | null }>;
  signup: (email: string, password: string, role: string, name?: string) => Promise<{ user: User | null; error: Error | null }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ user: null, error: null }),
  signup: async () => ({ user: null, error: null }),
  logout: async () => {},
  refreshProfile: async () => {},
});

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setProfile(null);
        }
        setIsLoading(false);
      }
    );

    // Initial load
    const loadInitialSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user || null);
      if (user) {
        await loadProfile(user.id);
      }
      setIsLoading(false);
    };
    loadInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        // toast.error('Failed to load profile', {
        //   description: error.message
        // });
        return;
      }
      setProfile(data);
    } catch (error: any) {
      console.error('Unexpected error loading profile:', error);
      // toast.error('Unexpected error loading profile', {
      //   description: error.message
      // });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      return { user: data.user, error: null };
    } catch (error: any) {
      console.error('Error logging in:', error);
      toast.error('Login failed', {
        description: error.message
      });
      return { user: null, error };
    }
  };

  const signup = async (email: string, password: string, role: string, name?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            name: name || email.split('@')[0],
          },
        },
      });

      if (error) throw error;

      toast.success('Account created', {
        description: 'Please check your email to verify your account'
      });
      
      return { user: data.user, error: null };
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error('Signup failed', {
        description: error.message
      });
      return { user: null, error };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    } catch (error: any) {
      console.error('Error logging out:', error);
      toast.error('Logout failed', {
        description: error.message
      });
    }
  };

  // Function to refresh the profile data
  const refreshProfile = async () => {
    if (user) {
      setIsLoading(true);
      await loadProfile(user.id);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        refreshProfile: loadProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
