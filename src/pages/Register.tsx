
import React, { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import RegisterForm from '@/components/auth/RegisterForm';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';

type Role = 'psychologist' | 'district' | 'admin';

const Register = () => {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role');
  
  const { toast } = useToast();
  const { signUp, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate(-1);
    }
  }, [isAuthenticated, navigate]);

  const handleRegisterSubmit = async (email: string, password: string, name: string, selectedRole: Role) => {
    try {
      await signUp(email, password, name, selectedRole);
      
      // For psychologists, redirect to the psychologist signup flow
      if (selectedRole === 'psychologist') {
        navigate('/psychologist-signup');
      }
      // For districts, redirect to the district signup flow
      else if (selectedRole === 'district') {
        navigate('/district-signup');
      }
    } catch (error) {
      // Error is already handled in the auth context
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
            
            <RegisterForm 
              onSubmit={handleRegisterSubmit} 
              initialRole={roleParam as Role | null}
            />
            
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
