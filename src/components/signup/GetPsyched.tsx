
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

interface GetPsychedProps {
  // No props needed for final step
}

const GetPsyched: React.FC<GetPsychedProps> = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCompleting, setIsCompleting] = useState(false);
  
  // Trigger confetti effect on component mount
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    
    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };
    
    const runConfetti = () => {
      const timeLeft = animationEnd - Date.now();
      
      if (timeLeft <= 0) return;
      
      const particleCount = 50 * (timeLeft / duration);
      
      // Random colors
      confetti({
        particleCount,
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        origin: { y: 0.6 },
        colors: ['#FFC107', '#FF9800', '#FF5722', '#F44336', '#3F51B5'],
      });
      
      // Random colors
      confetti({
        particleCount,
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        origin: { y: 0.6 },
        colors: ['#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A'],
      });
      
      requestAnimationFrame(runConfetti);
    };
    
    runConfetti();
  }, []);
  
  const handleComplete = async () => {
    if (!user) {
      toast({
        title: 'Authentication error',
        description: 'You must be logged in to continue',
        variant: 'destructive',
      });
      return;
    }
    
    setIsCompleting(true);
    
    try {
      // Mark the signup process as completed
      const { error } = await supabase
        .from('psychologists')
        .update({
          signup_completed: true,
        })
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      toast({
        title: 'Setup Complete!',
        description: 'Welcome to PsychedHire! You can now start exploring jobs.',
      });
      
      // Navigate to dashboard after short delay for user to see the success message
      setTimeout(() => {
        navigate('/psychologist-dashboard');
      }, 1500);
    } catch (error: any) {
      toast({
        title: 'Error completing setup',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      setIsCompleting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md text-center">
      <div className="py-8">
        <h2 className="text-3xl font-bold text-psyched-darkBlue mb-4">Get Psyched!</h2>
        
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-psyched-yellow rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <p className="text-lg mb-6">
          Congratulations! You've successfully set up your profile on PsychedHire.
        </p>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-8">
          <h3 className="font-semibold text-lg mb-2">What's Next?</h3>
          <ul className="text-left space-y-2">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>Browse available job opportunities</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>Apply to positions that match your skills and preferences</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>Track the status of your applications</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>Complete evaluations and submit reports</span>
            </li>
          </ul>
        </div>
        
        <Button 
          onClick={handleComplete} 
          className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90 text-white px-8 py-2 rounded-md text-lg"
          disabled={isCompleting}
        >
          {isCompleting ? 'Finalizing...' : 'Go to Dashboard'}
        </Button>
      </div>
    </div>
  );
};

export default GetPsyched;
