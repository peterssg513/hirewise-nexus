
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

interface EvaluationTypesSectionProps {
  form: UseFormReturn<any>;
}

const EVALUATION_TYPES = ['Tele Only', 'In-Person Only', 'Hybrid: Tele/In-Person'];

const EvaluationTypesSection: React.FC<EvaluationTypesSectionProps> = ({ form }) => {
  return (
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
            {EVALUATION_TYPES.map((item) => (
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

export default EvaluationTypesSection;
