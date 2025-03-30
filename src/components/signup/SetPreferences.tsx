
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { X, Loader2 } from 'lucide-react';

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
  const [location, setLocation] = useState('');
  
  const form = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      workTypes: [],
      evaluationTypes: [],
      openToRelocation: false,
    },
  });

  const handleAddLocation = () => {
    if (location.trim() && !locations.includes(location.trim())) {
      setLocations([...locations, location.trim()]);
      setLocation('');
    }
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
            {/* Desired Locations */}
            <div>
              <h3 className="text-lg font-medium mb-2">Desired Locations</h3>
              <FormDescription className="text-sm text-gray-500 mb-4">
                Add cities, states, or regions where you'd like to work.
              </FormDescription>
              
              <div className="flex mb-2">
                <Input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., New York, NY"
                  className="flex-1 mr-2"
                />
                <Button 
                  type="button" 
                  onClick={handleAddLocation}
                  disabled={!location.trim()}
                >
                  Add
                </Button>
              </div>
              
              {locations.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {locations.map((loc, index) => (
                    <div 
                      key={index}
                      className="bg-gray-100 rounded-full px-3 py-1 flex items-center"
                    >
                      <span className="text-sm mr-1">{loc}</span>
                      <button 
                        type="button"
                        onClick={() => handleRemoveLocation(loc)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {locations.length === 0 && (
                <p className="text-sm text-orange-500 mt-2">
                  Please add at least one location
                </p>
              )}
            </div>
            
            {/* Work Types */}
            <FormField
              control={form.control}
              name="workTypes"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-lg font-medium">Work Type</FormLabel>
                    <FormDescription>
                      Select all work types you're interested in
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {['Full Time', 'Part Time', 'Contract', 'PRN'].map((item) => (
                      <FormField
                        key={item}
                        control={form.control}
                        name="workTypes"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item)}
                                  onCheckedChange={(checked) => {
                                    const value = field.value || [];
                                    if (checked) {
                                      field.onChange([...value, item]);
                                    } else {
                                      field.onChange(
                                        value.filter((val) => val !== item)
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />
            
            {/* Evaluation Types */}
            <FormField
              control={form.control}
              name="evaluationTypes"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-lg font-medium">Evaluation Types</FormLabel>
                    <FormDescription>
                      Select all evaluation types you're comfortable with
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {['Tele Only', 'In-Person Only', 'Hybrid: Tele/In-Person'].map((item) => (
                      <FormField
                        key={item}
                        control={form.control}
                        name="evaluationTypes"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item)}
                                  onCheckedChange={(checked) => {
                                    const value = field.value || [];
                                    if (checked) {
                                      field.onChange([...value, item]);
                                    } else {
                                      field.onChange(
                                        value.filter((val) => val !== item)
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />
            
            {/* Relocation */}
            <FormField
              control={form.control}
              name="openToRelocation"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Open to Relocation
                    </FormLabel>
                    <FormDescription>
                      Are you willing to relocate for the right opportunity?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-psyched-darkBlue hover:bg-psyched-darkBlue/90" 
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
