
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, UserPlus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const AdminCreatePage = () => {
  const { profile } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if current user is admin
  if (profile?.role !== 'admin') {
    navigate('/admin-secret-auth');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !name) {
      setError('Please fill out all fields');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Create new user with admin role
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
      
      // Log admin creation event
      await supabase.from('analytics_events').insert({
        event_type: 'admin_created',
        user_id: profile.id,
        event_data: { 
          created_admin_id: data.user.id,
          created_admin_email: email,
          timestamp: new Date().toISOString()
        }
      });
      
      toast({
        title: 'Admin account created',
        description: `Successfully created admin account for ${email}`,
      });
      
      // Reset form
      setEmail('');
      setPassword('');
      setName('');
      
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

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center mb-2">
              <UserPlus className="h-10 w-10 text-psyched-darkBlue" />
            </div>
            <CardTitle className="text-2xl text-center">Create Admin Account</CardTitle>
            <CardDescription className="text-center">
              Create a new administrator account for the platform
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
                    placeholder="John Doe"
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
                    placeholder="new.admin@example.com"
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
                <Button type="submit" disabled={isLoading} className="w-full mt-2">
                  {isLoading ? 'Creating...' : 'Create Admin Account'}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate('/admin-dashboard')} className="w-full">
              Back to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminCreatePage;
