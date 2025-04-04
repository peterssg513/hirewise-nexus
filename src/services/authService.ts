
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    toast.success('Sign in successful', {
      description: 'Welcome back!'
    });
    
    return data;
  } catch (error: any) {
    console.error('Sign in error:', error);
    
    toast.error('Sign in failed', {
      description: error.message || 'Please check your credentials and try again.'
    });
    
    return null;
  }
}

export async function signUp(email: string, password: string, userData: object) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    
    if (error) throw error;
    
    toast.success('Account created', {
      description: 'Your account has been created successfully!'
    });
    
    return data;
  } catch (error: any) {
    toast.error('Registration failed', {
      description: error.message || 'An error occurred during registration.'
    });
    
    return null;
  }
}

export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    
    if (error) throw error;
    
    toast.success('Password reset email sent', {
      description: 'Check your email for the reset link'
    });
    
    return true;
  } catch (error: any) {
    console.error('Password reset error:', error);
    
    toast.error('Password reset failed', {
      description: error.message || 'An error occurred while sending the reset link.'
    });
    
    return false;
  }
}

export async function updateUserPassword(password: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password,
    });
    
    if (error) throw error;
    
    toast.success('Password updated', {
      description: 'Your password has been updated successfully'
    });
    
    return true;
  } catch (error: any) {
    console.error('Password update error:', error);
    
    toast.error('Password update failed', {
      description: error.message || 'An error occurred while updating your password.'
    });
    
    return false;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
    
    toast.success('Signed out successfully');
    
    return true;
  } catch (error: any) {
    console.error('Sign out error:', error);
    
    toast.error('Sign out failed', {
      description: error.message || 'An error occurred while signing out.'
    });
    
    return false;
  }
}
