
import React from 'react';
import { Users } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message = "No pending psychologists found" }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-dashed">
      <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
        <Users className="h-6 w-6 text-gray-500" />
      </div>
      <h3 className="mt-4 text-lg font-medium">{message}</h3>
      <p className="mt-2 text-sm text-gray-500 text-center">
        Check back later for new submissions
      </p>
    </div>
  );
};

export default EmptyState;
