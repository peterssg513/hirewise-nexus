
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import RoleSelector from '@/components/RoleSelector';
import Navbar from '@/components/Navbar';

type Role = 'psychologist' | 'district' | 'admin';

const Login = () => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, we would handle authentication here
    console.log({ selectedRole, email, password, rememberMe });
    
    // For demo purposes, let's simulate a successful login
    // and redirect to the appropriate dashboard
    if (selectedRole) {
      navigate(`/${selectedRole}-dashboard`);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-psyched-cream py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-psyched-darkBlue mb-2">Welcome Back!</h1>
              <p className="text-gray-600">Sign in to access your account</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="role" className="block mb-3">Select Your Role</Label>
                  <RoleSelector 
                    selectedRole={selectedRole} 
                    onChange={setSelectedRole} 
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="block mb-1">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full"
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/forgot-password" className="text-sm text-psyched-lightBlue hover:underline">
                      Forgot Password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full"
                  />
                </div>
                
                <div className="flex items-center">
                  <Checkbox 
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    className="mr-2"
                  />
                  <Label htmlFor="remember" className="text-sm">Remember me</Label>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-psyched-darkBlue hover:bg-psyched-darkBlue/90"
                disabled={!selectedRole}
              >
                Log In
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                New to PsychedHire? 
                <Link to="/register" className="ml-1 text-psyched-yellow font-medium hover:underline">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
