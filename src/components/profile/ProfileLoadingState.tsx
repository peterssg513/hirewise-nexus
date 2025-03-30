
import React from 'react';
import { Loader2 } from 'lucide-react';

const ProfileLoadingState: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <Loader2 className="h-8 w-8 animate-spin text-psyched-darkBlue" />
    </div>
  );
};

export default ProfileLoadingState;
