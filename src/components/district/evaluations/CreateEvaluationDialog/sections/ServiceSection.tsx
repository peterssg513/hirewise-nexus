
import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  SERVICE_TYPES, 
  EVALUATION_STATUS_OPTIONS, 
  fetchEvaluationPaymentRate 
} from '@/services/evaluationPaymentService';
import { EvaluationFormValues } from '../schema';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';

interface ServiceSectionProps {
  form: UseFormReturn<EvaluationFormValues>;
}

export const ServiceSection: React.FC<ServiceSectionProps> = ({ form }) => {
  // Watch for changes in service_type and state to calculate payment_amount
  const serviceType = form.watch('service_type');
  const state = form.watch('state');
  
  const { data: paymentAmount } = useQuery({
    queryKey: ['evaluationPaymentRate', state, serviceType],
    queryFn: () => fetchEvaluationPaymentRate(state, serviceType || ''),
    enabled: !!state && !!serviceType,
  });
  
  // Auto-populate payment amount when state and service type are selected
  useEffect(() => {
    if (paymentAmount !== null && paymentAmount !== undefined) {
      form.setValue('payment_amount', paymentAmount.toString());
    }
  }, [paymentAmount, form]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Service Information</h3>
      
      <FormField
        control={form.control}
        name="service_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Service Type</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {SERVICE_TYPES.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
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
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value || 'Open'}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {EVALUATION_STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
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
        name="payment_amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Payment Amount ($)</FormLabel>
            <FormControl>
              <Input 
                type="text"
                placeholder="Auto-populated based on state and service type"
                {...field}
                readOnly
                className="bg-gray-50"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
