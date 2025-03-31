
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { saveProfileData } from '@/services/districtSignupService';

interface BuildProfileProps {
  onComplete: () => void;
}

const BuildProfile: React.FC<BuildProfileProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: 'Authentication error',
        description: 'You must be logged in to continue',
        variant: 'destructive',
      });
      return;
    }

    if (!description) {
      toast({
        title: 'Description required',
        description: 'Please provide a description of your district',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await saveProfileData(user.id, {
        description,
        location
      });
      
      toast({
        title: 'Profile updated',
        description: 'Your district profile has been saved successfully',
      });
      
      onComplete();
    } catch (error: any) {
      toast({
        title: 'Error saving profile',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-psyched-darkBlue mb-2">Build Your District Profile</h2>
      <p className="text-gray-600 mb-6">
        Tell us about your district to help psychologists understand your needs better.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            District Description
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your district, student population, and specific needs..."
            className="min-h-[200px]"
          />
          <p className="text-xs text-gray-500 mt-1">
            Include information about your student population, special education needs, and district culture.
          </p>
        </div>
        
        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-2">
            Specific Location
          </label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Downtown Chicago, IL or Rural Western Montana"
          />
          <p className="text-xs text-gray-500 mt-1">
            Adding a more specific location helps psychologists understand your area better.
          </p>
        </div>
        
        <Button 
          type="submit"
          className="w-full bg-psyched-darkBlue hover:bg-psyched-darkBlue/90 text-white" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <span className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></span>
              Saving...
            </span>
          ) : "Complete Profile"}
        </Button>
      </form>
    </div>
  );
};

export default BuildProfile;
