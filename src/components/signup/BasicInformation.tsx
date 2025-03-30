
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { saveBasicInfo } from '@/services/psychologistSignupService';
import NameInputs from './contactInfo/NameInputs';
import PhoneInput from './contactInfo/PhoneInput';
import AddressInputs from './contactInfo/AddressInputs';

interface BasicInformationProps {
  onComplete: () => void;
}

const basicInfoSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  phoneNumber: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  state: z.string().min(2, {
    message: "Please select a state.",
  }),
  zipCode: z.string().min(5, {
    message: "Zip code must be at least 5 characters.",
  }),
});

type BasicInfoFormValues = z.infer<typeof basicInfoSchema>;

const BasicInformation: React.FC<BasicInformationProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<BasicInfoFormValues>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      firstName: profile?.name?.split(' ')[0] || '',
      lastName: profile?.name?.split(' ')[1] || '',
      phoneNumber: '',
      city: '',
      state: '',
      zipCode: '',
    },
  });

  const onSubmit = async (values: BasicInfoFormValues) => {
    if (!user) {
      toast({
        title: 'Authentication error',
        description: 'You must be logged in to continue',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Ensure all required fields are present and non-optional before calling saveBasicInfo
      const basicInfo = {
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
        city: values.city,
        state: values.state,
        zipCode: values.zipCode,
      };
      
      await saveBasicInfo(user.id, basicInfo);
      
      toast({
        title: 'Information saved',
        description: 'Your basic information has been saved successfully.',
      });
      
      onComplete();
    } catch (error: any) {
      toast({
        title: 'Error saving information',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-psyched-darkBlue mb-6">Basic Information</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <NameInputs form={form} />
          <PhoneInput form={form} />
          <AddressInputs form={form} />
          
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
            ) : "Continue to Profile Building"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default BasicInformation;
