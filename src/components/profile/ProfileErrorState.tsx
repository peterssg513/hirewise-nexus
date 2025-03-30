
import React from 'react';
import { Button } from '@/components/ui/button';

interface ProfileErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ProfileErrorState: React.FC<ProfileErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Error Loading Profile</h2>
        <p className="text-gray-500 mb-4">{error}</p>
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      </div>
    </div>
  );
};

export default ProfileErrorState;
