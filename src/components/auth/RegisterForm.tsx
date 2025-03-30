
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import RoleSelector from '@/components/RoleSelector';

type Role = 'psychologist' | 'district' | 'admin';

interface RegisterFormProps {
  onSubmit: (email: string, password: string, name: string, role: Role) => Promise<void>;
  initialRole?: Role | null;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, initialRole }) => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(initialRole || null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Update selected role if initialRole changes
  useEffect(() => {
    if (initialRole) {
      setSelectedRole(initialRole);
    }
  }, [initialRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRole) {
      toast({
        title: "Role required",
        description: "Please select your role to continue",
        variant: "destructive",
      });
      return;
    }
    
    if (!email || !password || !name) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }
    
    if (!agreeTerms) {
      toast({
        title: "Terms agreement required",
        description: "You must agree to the Terms of Service and Privacy Policy",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await onSubmit(email, password, name, selectedRole);
    } catch (error) {
      // Error is handled by parent component
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
            disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
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
        disabled={!selectedRole || !agreeTerms || isLoading}
      >
        {isLoading ? (
          <span className="flex items-center">
            <span className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></span>
            Creating Account...
          </span>
        ) : "Create Account"}
      </Button>
    </form>
  );
};

export default RegisterForm;
