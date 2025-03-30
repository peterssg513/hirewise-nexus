
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormControl,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { UseFormReturn } from 'react-hook-form';

interface RelocationSectionProps {
  form: UseFormReturn<any>;
}

const RelocationSection: React.FC<RelocationSectionProps> = ({ form }) => {
  return (
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
  );
};

export default RelocationSection;
