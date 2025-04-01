
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EvaluationFormValues } from '../schema';
import { 
  SERVICE_TYPES, 
  EVALUATION_STATUS_OPTIONS, 
  fetchEvaluationPaymentRate 
} from '@/services/evaluationPaymentService';
import { STATES } from '@/services/stateSalaryService';
import { useToast } from '@/hooks/use-toast';

interface ServiceSectionProps {
  form: UseFormReturn<EvaluationFormValues>;
}

export const ServiceSection: React.FC<ServiceSectionProps> = ({ form }) => {
  const { toast } = useToast();

  const handleServiceTypeChange = async (serviceType: string) => {
    form.setValue('service_type', serviceType);
    const stateCode = form.getValues('state');
    
    if (stateCode && serviceType) {
      try {
        const paymentAmount = await fetchEvaluationPaymentRate(stateCode, serviceType);
        if (paymentAmount) {
          form.setValue('payment_amount', paymentAmount.toString());
        }
      } catch (error) {
        console.error('Failed to fetch payment rate:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch payment rate',
          variant: 'destructive'
        });
      }
    }
  };

  const handleStateChange = async (stateCode: string) => {
    form.setValue('state', stateCode);
    const serviceType = form.getValues('service_type');
    
    if (stateCode && serviceType) {
      try {
        const paymentAmount = await fetchEvaluationPaymentRate(stateCode, serviceType);
        if (paymentAmount) {
          form.setValue('payment_amount', paymentAmount.toString());
        }
      } catch (error) {
        console.error('Failed to fetch payment rate:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch payment rate',
          variant: 'destructive'
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Service Information</h3>
      
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Evaluation Status*</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <Select 
                onValueChange={handleStateChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {STATES.map((state) => (
                    <SelectItem key={state.code} value={state.code}>
                      {state.name}
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
          name="service_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Type</FormLabel>
              <Select 
                onValueChange={handleServiceTypeChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {SERVICE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
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
        name="payment_amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Payment Amount ($)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="Payment amount based on state and service type" 
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
