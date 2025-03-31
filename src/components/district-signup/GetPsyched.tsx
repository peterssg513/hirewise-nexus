
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { completeSignup } from '@/services/districtSignupService';
import { Loader2, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const GetPsyched = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isCompleting, setIsCompleting] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [hasCompletedAnimation, setHasCompletedAnimation] = useState(false);

  // Check if district is approved
  useEffect(() => {
    const checkApprovalStatus = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('districts')
          .select('status')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        
        setIsApproved(data.status === 'approved');
      } catch (error) {
        console.error('Error checking approval status:', error);
      }
    };

    checkApprovalStatus();
  }, [user]);

  // Handle completion of signup
  useEffect(() => {
    const markSignupComplete = async () => {
      if (!user) return;

      try {
        await completeSignup(user.id);
      } catch (error) {
        console.error('Error completing signup:', error);
      }
    };

    if (hasCompletedAnimation) {
      markSignupComplete();
    }
  }, [hasCompletedAnimation, user]);

  const handleGoToDashboard = () => {
    if (!isApproved) {
      toast({
        title: 'Pending Approval',
        description: 'Your district account is pending approval. You will receive an email when approved.',
        variant: 'default',
      });
      return;
    }

    setIsCompleting(true);
    
    // Navigate to dashboard with slight delay for better UX
    setTimeout(() => {
      navigate('/district-dashboard');
    }, 500);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.3,
        delayChildren: 0.3,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // After animation completes, mark the signup as complete
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasCompletedAnimation(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onAnimationComplete={() => setHasCompletedAnimation(true)}
    >
      <motion.div 
        className="flex justify-center mb-8"
        variants={itemVariants}
      >
        {isApproved ? (
          <CheckCircle className="h-24 w-24 text-green-500" />
        ) : (
          <Clock className="h-24 w-24 text-yellow-500" />
        )}
      </motion.div>
      
      <motion.h2 
        className="text-3xl font-bold text-psyched-darkBlue mb-4"
        variants={itemVariants}
      >
        {isApproved ? "You're all set!" : "Almost There!"}
      </motion.h2>
      
      <motion.p 
        className="text-lg text-gray-600 mb-8"
        variants={itemVariants}
      >
        {isApproved 
          ? "Your district account has been approved. You're ready to start using PsychedHire!"
          : "Your district information has been submitted and is pending approval from our team. You'll receive an email notification once your account is approved."}
      </motion.p>
      
      <motion.div variants={itemVariants}>
        <Button
          onClick={handleGoToDashboard}
          className="px-8 py-2 bg-psyched-yellow hover:bg-psyched-yellow/90 text-psyched-darkBlue font-semibold text-lg"
          disabled={isCompleting}
        >
          {isCompleting ? (
            <span className="flex items-center">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading...
            </span>
          ) : (
            isApproved ? "Go to Dashboard" : "Check Status"
          )}
        </Button>
      </motion.div>
      
      {!isApproved && (
        <motion.p 
          className="mt-6 text-sm text-gray-500"
          variants={itemVariants}
        >
          Approval usually takes 1-2 business days. If you have any questions, please contact our support team.
        </motion.p>
      )}
    </motion.div>
  );
};

export default GetPsyched;
