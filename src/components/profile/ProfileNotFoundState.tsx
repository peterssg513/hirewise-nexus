
import React from 'react';
import { Button } from '@/components/ui/button';

interface ProfileNotFoundStateProps {
  onRetry: () => void;
}

const ProfileNotFoundState: React.FC<ProfileNotFoundStateProps> = ({ onRetry }) => {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Profile Not Found</h2>
        <p className="text-gray-500 mb-4">Unable to retrieve your profile information.</p>
        <Button 
          className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90 text-white"
          onClick={onRetry}
        >
          Try Again
        </Button>
      </div>
    </div>
  );
};

export default ProfileNotFoundState;
