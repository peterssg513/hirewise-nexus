
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import LocationSearch from './LocationSearch';
import WorkTypesSection from './WorkTypesSection';
import EvaluationTypesSection from './EvaluationTypesSection';
import RelocationSection from './RelocationSection';

interface SetPreferencesProps {
  onComplete: () => void;
}

const preferencesSchema = z.object({
  workTypes: z.array(z.string()).min(1, {
    message: "Please select at least one work type",
  }),
  evaluationTypes: z.array(z.string()).min(1, {
    message: "Please select at least one evaluation type",
  }),
  openToRelocation: z.boolean(),
});

type PreferencesFormValues = z.infer<typeof preferencesSchema>;

const SetPreferences: React.FC<SetPreferencesProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locations, setLocations] = useState<string[]>([]);
  
  const form = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      workTypes: [],
      evaluationTypes: [],
      openToRelocation: false,
    },
  });

  const handleAddLocation = (location: string) => {
    setLocations(prev => [...prev, location]);
  };

  const handleRemoveLocation = (locationToRemove: string) => {
    setLocations(locations.filter(loc => loc !== locationToRemove));
  };

  const onSubmit = async (values: PreferencesFormValues) => {
    if (!user) {
      toast({
        title: 'Authentication error',
        description: 'You must be logged in to continue',
        variant: 'destructive',
      });
      return;
    }

    if (locations.length === 0) {
      toast({
        title: 'Location required',
        description: 'Please add at least one desired location',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Update psychologist preferences
      const { error } = await supabase
        .from('psychologists')
        .update({
          desired_locations: locations,
          work_types: values.workTypes,
          evaluation_types: values.evaluationTypes,
          open_to_relocation: values.openToRelocation,
          signup_progress: 5, // Move to final step
        })
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      toast({
        title: 'Preferences saved',
        description: 'Your preferences have been saved successfully.',
      });
      
      onComplete();
    } catch (error: any) {
      toast({
        title: 'Error saving preferences',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-psyched-darkBlue mb-6">Set Your Preferences</h2>
      
      <div className="mb-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Desired Locations with Google Places */}
            <div>
              <h3 className="text-lg font-medium mb-2">Desired Locations</h3>
              <p className="text-sm text-gray-500 mb-4">
                Add cities, states, or regions where you'd like to work.
              </p>
              
              <LocationSearch 
                locations={locations}
                onAddLocation={handleAddLocation}
                onRemoveLocation={handleRemoveLocation}
              />
            </div>
            
            {/* Work Types */}
            <WorkTypesSection form={form} />
            
            {/* Evaluation Types */}
            <EvaluationTypesSection form={form} />
            
            {/* Relocation */}
            <RelocationSection form={form} />
            
            <Button 
              type="submit" 
              className="w-full bg-psyched-darkBlue hover:bg-psyched-darkBlue/90 text-white" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </span>
              ) : "Continue to Final Step"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SetPreferences;
