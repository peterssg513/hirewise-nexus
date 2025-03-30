
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';

interface PhoneInputProps {
  form: UseFormReturn<any>;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="phoneNumber"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Phone Number</FormLabel>
          <FormControl>
            <Input {...field} placeholder="(555) 123-4567" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PhoneInput;
