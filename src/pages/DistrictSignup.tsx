
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import SignupProgress from '@/components/signup/SignupProgress';
import Navbar from '@/components/Navbar';
import BasicInformation from '@/components/district-signup/BasicInformation';
import BuildProfile from '@/components/district-signup/BuildProfile';
import ScheduleMeeting from '@/components/district-signup/ScheduleMeeting';
import GetPsyched from '@/components/district-signup/GetPsyched';
import { getDistrictSignupProgress } from '@/services/districtSignupService';

const DistrictSignup = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Define all steps in the signup process - reordered to put Build Profile before Schedule Meeting
  const steps = [
    "Basic Information",
    "Build Profile",
    "Schedule Meeting",
    "Get Psyched!"
  ];
  
  // Load initial signup progress
  useEffect(() => {
    const loadSignupProgress = async () => {
      if (!user) return;
      
      try {
        const progress = await getDistrictSignupProgress(user.id);
        setCurrentStep(progress);
      } catch (error) {
        console.error('Error loading signup progress:', error);
        // Default to step 1 if there's an error
        setCurrentStep(1);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isAuthenticated) {
      loadSignupProgress();
    } else {
      setIsLoading(false);
    }
  }, [user, isAuthenticated]);
  
  // If not authenticated, redirect to login
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to continue the signup process',
        variant: 'destructive',
      });
      navigate('/login?redirect=/district-signup');
    }
  }, [isAuthenticated, isLoading, navigate, toast]);
  
  // Handle step completion
  const handleComplete = (step: number) => {
    setCurrentStep(step + 1);
  };
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-psyched-darkBlue border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <>
      <Navbar />
      <div className="bg-psyched-cream min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <SignupProgress 
            currentStep={currentStep} 
            totalSteps={steps.length}
            steps={steps}
          />
          
          {currentStep === 1 && (
            <BasicInformation onComplete={() => handleComplete(1)} />
          )}
          
          {currentStep === 2 && (
            <BuildProfile onComplete={() => handleComplete(2)} />
          )}
          
          {currentStep === 3 && (
            <ScheduleMeeting onComplete={() => handleComplete(3)} />
          )}
          
          {currentStep === 4 && (
            <GetPsyched />
          )}
        </div>
      </div>
    </>
  );
};

export default DistrictSignup;
