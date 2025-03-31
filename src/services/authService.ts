
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { Role } from '@/hooks/useAuthState';

export const loginWithEmail = async (email: string, password: string) => {
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

  return data;
};

export const signUpWithEmail = async (email: string, password: string, name: string, role: Role) => {
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

  return data;
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Logout error:', error);
    throw error;
  }
};
