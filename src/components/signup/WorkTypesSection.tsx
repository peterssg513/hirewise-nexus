
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormControl,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';

interface WorkTypesSectionProps {
  form: UseFormReturn<any>;
}

const WORK_TYPES = ['Full Time', 'Part Time', 'Contract', 'PRN'];

const WorkTypesSection: React.FC<WorkTypesSectionProps> = ({ form }) => {
  return (
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
            {WORK_TYPES.map((item) => (
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
                                value.filter((val: string) => val !== item)
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
  );
};

export default WorkTypesSection;
