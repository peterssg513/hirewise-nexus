
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Lock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const AdminAuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Sign in with email and password
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (signInError) throw signInError;
      
      if (!data.user || !data.session) {
        throw new Error('Authentication failed');
      }
      
      // Check if the user has admin role
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) throw profileError;
      
      if (profileData.role !== 'admin') {
        // If not admin, sign out immediately
        await supabase.auth.signOut();
        throw new Error('Unauthorized access');
      }
      
      // Log successful admin login for audit purposes
      await supabase.from('analytics_events').insert({
        event_type: 'admin_login',
        user_id: data.user.id,
        event_data: { 
          timestamp: new Date().toISOString(),
          ip_address: window.location.hostname // Basic info for audit
        }
      });
      
      toast({
        title: 'Authentication successful',
        description: 'Welcome to the admin dashboard',
      });
      
      navigate('/admin-dashboard');
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed');
      
      toast({
        title: 'Authentication failed',
        description: err.message || 'Please check your credentials and try again',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md px-6">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-2">
              <Lock className="h-10 w-10 text-psyched-darkBlue" />
            </div>
            <CardTitle className="text-2xl text-center">Admin Access</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the admin dashboard
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
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? 'Authenticating...' : 'Sign In'}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="px-8 text-center text-sm text-muted-foreground">
              This area is restricted to authorized administrators only.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminAuthPage;
