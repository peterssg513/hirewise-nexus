
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SignupProgress from '@/components/signup/SignupProgress';
import BasicInformation from '@/components/signup/BasicInformation';
import BuildProfile from '@/components/signup/BuildProfile';
import CertificationUpload from '@/components/signup/CertificationUpload';
import SetPreferences from '@/components/signup/SetPreferences';
import GetPsyched from '@/components/signup/GetPsyched';

const steps = [
  'Basic Information',
  'Build Profile',
  'Upload Certifications',
  'Set Preferences',
  'Get Psyched!'
];

const PsychologistSignup = () => {
  const { isAuthenticated, user, profile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadSignupProgress = async () => {
      if (!isAuthenticated || !user || profile?.role !== 'psychologist') {
        return;
      }
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('psychologists')
          .select('signup_progress, signup_completed')
          .eq('user_id', user.id)
          .single();
          
        if (error) throw error;
        
        // If signup is already completed, redirect to dashboard
        if (data.signup_completed) {
          navigate('/psychologist-dashboard');
          return;
        }
        
        // Set the current step based on the progress stored in the database
        if (data.signup_progress) {
          setCurrentStep(data.signup_progress);
        }
      } catch (error: any) {
        console.error('Error loading signup progress:', error);
        toast({
          title: 'Error loading signup progress',
          description: error.message || 'An unexpected error occurred',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSignupProgress();
  }, [isAuthenticated, user, profile, navigate, toast]);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login?role=psychologist');
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  // Redirect if not a psychologist
  useEffect(() => {
    if (!isLoading && isAuthenticated && profile?.role !== 'psychologist') {
      toast({
        title: 'Access denied',
        description: 'This signup process is only for psychologists',
        variant: 'destructive',
      });
      navigate('/');
    }
  }, [isAuthenticated, profile, isLoading, navigate, toast]);
  
  const handleStepComplete = (nextStep: number) => {
    setCurrentStep(nextStep);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInformation onComplete={() => handleStepComplete(2)} />;
      case 2:
        return <BuildProfile onComplete={() => handleStepComplete(3)} />;
      case 3:
        return <CertificationUpload onComplete={() => handleStepComplete(4)} />;
      case 4:
        return <SetPreferences onComplete={() => handleStepComplete(5)} />;
      case 5:
        return <GetPsyched />;
      default:
        return <BasicInformation onComplete={() => handleStepComplete(2)} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-psyched-darkBlue"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-psyched-darkBlue mb-2">
              Complete Your Psychologist Profile
            </h1>
            <p className="text-gray-600">
              Let's set up your profile to help you find the perfect match
            </p>
          </div>
          
          <SignupProgress 
            currentStep={currentStep} 
            totalSteps={steps.length}
            steps={steps}
          />
          
          {renderCurrentStep()}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PsychologistSignup;
