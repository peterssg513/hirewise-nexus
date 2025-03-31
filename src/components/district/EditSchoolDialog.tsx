
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { School, updateSchool } from '@/services/schoolService';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { US_STATES } from '@/lib/constants';

interface EditSchoolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  school: School;
  onSchoolUpdated: (school: School) => void;
}

const formSchema = z.object({
  name: z.string().min(1, 'School name is required'),
  enrollment_size: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip_code: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const EditSchoolDialog: React.FC<EditSchoolDialogProps> = ({
  open,
  onOpenChange,
  school,
  onSchoolUpdated,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: school.name || '',
      enrollment_size: school.enrollment_size?.toString() || '',
      street: school.street || '',
      city: school.city || '',
      state: school.state || '',
      zip_code: school.zip_code || '',
    },
  });

  const { formState } = form;
  const { isSubmitting } = formState;

  useEffect(() => {
    if (school && open) {
      form.reset({
        name: school.name || '',
        enrollment_size: school.enrollment_size?.toString() || '',
        street: school.street || '',
        city: school.city || '',
        state: school.state || '',
        zip_code: school.zip_code || '',
      });
    }
  }, [school, open, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      const updatedSchool = await updateSchool(school.id, {
        name: values.name,
        enrollment_size: values.enrollment_size,
        street: values.street || undefined,
        city: values.city || undefined,
        state: values.state || undefined,
        zip_code: values.zip_code || undefined,
      });
      
      onSchoolUpdated(updatedSchool);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update school:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit School</DialogTitle>
          <DialogDescription>
            Update school information
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter school name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enrollment_size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enrollment Size</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Number of students" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Street address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {US_STATES.map((state) => (
                          <SelectItem key={state.value} value={state.value}>
                            {state.label}
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
              name="zip_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Zip code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
