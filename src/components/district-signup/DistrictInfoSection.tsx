
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { US_STATES } from '@/lib/constants';
import { UseFormReturn } from 'react-hook-form';
import { BuildProfileFormValues } from './schemas/buildProfileSchema';

interface DistrictInfoSectionProps {
  form: UseFormReturn<BuildProfileFormValues>;
  districtSizeTiers: { value: number; label: string }[];
}

const DistrictInfoSection: React.FC<DistrictInfoSectionProps> = ({ form, districtSizeTiers }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">District Information</h3>
      
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>District Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter district name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {US_STATES.map((state) => (
                    <SelectItem key={state.value} value={state.value || "unknown"}>
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="district_size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>District Size</FormLabel>
              <Select 
                onValueChange={(value) => field.onChange(parseInt(value))} 
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select district size" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {districtSizeTiers.map((tier) => (
                    <SelectItem key={tier.value} value={tier.value.toString()}>
                      {tier.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="website"
        render={({ field }) => (
          <FormItem>
            <FormLabel>District Website</FormLabel>
            <FormControl>
              <Input placeholder="https://www.yourdistrict.edu" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DistrictInfoSection;
