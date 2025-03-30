
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { X } from 'lucide-react';

export interface Certification {
  id: string;
  name: string;
  url?: string;
  status?: 'pending' | 'verified';
  uploadedAt?: string;
  startYear: string;
  endYear: string;
}

interface CertificationFormProps {
  onAdd: (certification: Certification) => void;
  onCancel: () => void;
  initialData?: Certification;
  isEditing?: boolean;
}

const certificationSchema = z.object({
  name: z.string().min(2, {
    message: "Certification name must be at least 2 characters.",
  }),
  startYear: z.string().min(4, {
    message: "Please enter a valid year.",
  }),
  endYear: z.string().min(4, {
    message: "Please enter a valid year.",
  }),
});

type CertificationFormValues = z.infer<typeof certificationSchema>;

const CertificationForm: React.FC<CertificationFormProps> = ({
  onAdd,
  onCancel,
  initialData,
  isEditing = false
}) => {
  const form = useForm<CertificationFormValues>({
    resolver: zodResolver(certificationSchema),
    defaultValues: initialData || {
      name: '',
      startYear: '',
      endYear: '',
    },
  });

  const onSubmit = (values: CertificationFormValues) => {
    onAdd({
      id: initialData?.id || Date.now().toString(),
      name: values.name,
      startYear: values.startYear,
      endYear: values.endYear,
      url: initialData?.url,
      status: initialData?.status || 'pending',
      uploadedAt: initialData?.uploadedAt || new Date().toISOString(),
    });
    form.reset();
  };

  return (
    <div className="border p-4 rounded-md bg-gray-50 relative mb-4">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onCancel}
        className="absolute top-2 right-2"
      >
        <X className="h-4 w-4" />
      </Button>

      <h3 className="font-medium mb-4">
        {isEditing ? 'Edit Certification' : 'Add New Certification'}
      </h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certification Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Year</FormLabel>
                  <FormControl>
                    <Input type="number" min="1900" max="2099" step="1" placeholder="YYYY" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Year</FormLabel>
                  <FormControl>
                    <Input type="number" min="1900" max="2099" step="1" placeholder="YYYY" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90 text-white"
            >
              {isEditing ? 'Update' : 'Add'} Certification
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CertificationForm;
