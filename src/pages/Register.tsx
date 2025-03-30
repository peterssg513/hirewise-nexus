
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import RoleSelector from '@/components/RoleSelector';
import Navbar from '@/components/Navbar';

type Role = 'psychologist' | 'district' | 'admin';

const Register = () => {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role');
  
  const [selectedRole, setSelectedRole] = useState<Role | null>(
    roleParam as Role | null
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, we would handle registration here
    console.log({ selectedRole, email, password, name, agreeTerms });
    
    // For demo purposes, let's simulate a successful registration
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
              <h1 className="text-2xl font-bold text-psyched-darkBlue mb-2">Create Your Account</h1>
              <p className="text-gray-600">Join the PsychedHire community</p>
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
                  <Label htmlFor="name" className="block mb-1">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="w-full"
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
                  <Label htmlFor="password" className="block mb-1">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Must be at least 8 characters with 1 uppercase, 1 number, and 1 special character
                  </p>
                </div>
                
                <div className="flex items-center">
                  <Checkbox 
                    id="terms"
                    checked={agreeTerms}
                    onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                    className="mr-2"
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the 
                    <Link to="/terms" className="text-psyched-yellow hover:underline mx-1">
                      Terms of Service
                    </Link>
                    and
                    <Link to="/privacy" className="text-psyched-yellow hover:underline ml-1">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-psyched-darkBlue hover:bg-psyched-darkBlue/90"
                disabled={!selectedRole || !agreeTerms}
              >
                Create Account
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account? 
                <Link to="/login" className="ml-1 text-psyched-yellow font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
