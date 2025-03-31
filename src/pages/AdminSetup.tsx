
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Shield } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const AdminSetup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAdmins, setHasAdmins] = useState(true); // Default to true for security
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkForExistingAdmins = async () => {
      try {
        // Check if any admin users exist in the system
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', 'admin')
          .limit(1);

        if (error) throw error;
        
        // If no admins exist, allow setup
        setHasAdmins(data && data.length > 0);
      } catch (err) {
        console.error('Error checking for existing admins:', err);
        // For security, if we can't determine, assume admins exist
        setHasAdmins(true);
      }
    };

    checkForExistingAdmins();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (hasAdmins) {
      setError('Admin accounts already exist. Use the admin authentication page.');
      return;
    }
    
    if (!name || !email || !password) {
      setError('Please fill out all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Create new admin user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: 'admin',
          },
        },
      });
      
      if (signUpError) throw signUpError;
      
      if (!data.user) {
        throw new Error('Failed to create admin account');
      }
      
      // Log the initial admin creation event
      await supabase.from('analytics_events').insert({
        event_type: 'initial_admin_created',
        user_id: data.user.id,
        event_data: { 
          email,
          name,
          timestamp: new Date().toISOString(),
          is_first_admin: true
        }
      });
      
      toast({
        title: 'Admin account created',
        description: `Successfully created admin account for ${email}. You can now log in.`,
      });
      
      // Navigate to login
      navigate('/admin-secret-auth');
      
    } catch (err: any) {
      console.error('Admin creation error:', err);
      setError(err.message || 'Failed to create admin account');
      
      toast({
        title: 'Admin creation failed',
        description: err.message || 'Please check the information and try again',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // If admins already exist, show a security message
  if (hasAdmins) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Admin Setup Unavailable</CardTitle>
            <CardDescription className="text-center">
              An administrator already exists in the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Access Denied</AlertTitle>
              <AlertDescription>
                This setup page is only available when no administrators exist in the system.
                Please log in using an existing admin account.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => navigate('/admin-secret-auth')}>
              Go to Admin Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md px-6">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-2">
              <Shield className="h-10 w-10 text-psyched-darkBlue" />
            </div>
            <CardTitle className="text-2xl text-center">Create First Admin</CardTitle>
            <CardDescription className="text-center">
              Set up the initial administrator account for PsychedHire
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Admin Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full mt-2">
                  {isLoading ? 'Creating...' : 'Create Admin Account'}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="px-8 text-center text-sm text-muted-foreground">
              This page is only available during initial setup when no admins exist.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminSetup;
