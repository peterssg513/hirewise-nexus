
import React from 'react';
import { cn } from '@/lib/utils';

interface SignupProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

const SignupProgress: React.FC<SignupProgressProps> = ({ 
  currentStep, 
  totalSteps,
  steps
}) => {
  const percentComplete = ((currentStep - 1) / (totalSteps - 1)) * 100;
  
  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={cn(
              "relative flex flex-col items-center",
              { "text-psyched-darkBlue font-medium": index + 1 <= currentStep },
              { "text-gray-400": index + 1 > currentStep }
            )}
          >
            <div 
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center mb-1 z-10",
                { "bg-psyched-yellow text-white": index + 1 === currentStep },
                { "bg-psyched-darkBlue text-white": index + 1 < currentStep },
                { "bg-gray-200 text-gray-500": index + 1 > currentStep }
              )}
            >
              {index + 1 < currentStep ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <span className="text-xs text-center w-20 md:w-24">{step}</span>
          </div>
        ))}
      </div>
      
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-psyched-darkBlue rounded-full transition-all duration-300"
          style={{ width: `${percentComplete}%` }}
        />
      </div>
    </div>
  );
};

export default SignupProgress;
