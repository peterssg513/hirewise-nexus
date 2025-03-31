import React, { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from '@/hooks/use-toast';
import { School, updateSchool } from '@/services/schoolService';

interface EditSchoolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  school: School;
  onSchoolUpdated: (school: School) => void;
}

const schoolFormSchema = z.object({
  name: z.string().min(2, {
    message: "School name must be at least 2 characters.",
  }),
  enrollment_size: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip_code: z.string().optional(),
})

type SchoolFormValues = z.infer<typeof schoolFormSchema>

export const EditSchoolDialog: React.FC<EditSchoolDialogProps> = ({ open, onOpenChange, school, onSchoolUpdated }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: {
      name: school.name,
      enrollment_size: school.enrollment_size ? school.enrollment_size.toString() : '',
      street: school.street || '',
      city: school.city || '',
      state: school.state || '',
      zip_code: school.zip_code || ''
    },
    mode: "onChange",
  })

  const handleSubmit = async (data: SchoolFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Convert enrollment_size from string to number
      const schoolData: Partial<School> = {
        ...data,
        enrollment_size: data.enrollment_size ? parseInt(data.enrollment_size as string, 10) : undefined
      };
      
      const updatedSchool = await updateSchool(school.id, schoolData);
      onSchoolUpdated(updatedSchool);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update school:', error);
      toast({
        title: 'Error',
        description: 'Failed to update school. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // And ensure the default value is properly handled
  useEffect(() => {
    if (school) {
      form.reset({
        name: school.name,
        enrollment_size: school.enrollment_size ? school.enrollment_size.toString() : '',
        street: school.street || '',
        city: school.city || '',
        state: school.state || '',
        zip_code: school.zip_code || ''
      });
    }
  }, [school, form.reset]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit School</AlertDialogTitle>
          <AlertDialogDescription>
            Make changes to the school here. Click save when you're done.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">School Name</Label>
            <Input id="name" placeholder="School Name" type="text" {...form.register("name")} />
            {form.formState.errors.name?.message && (
              <p className="text-sm text-red-500">{form.formState.errors.name?.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="enrollment_size">Enrollment Size</Label>
            <Input id="enrollment_size" placeholder="Enrollment Size" type="number" {...form.register("enrollment_size")} />
            {form.formState.errors.enrollment_size?.message && (
              <p className="text-sm text-red-500">{form.formState.errors.enrollment_size?.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="street">Street</Label>
            <Input id="street" placeholder="Street" type="text" {...form.register("street")} />
            {form.formState.errors.street?.message && (
              <p className="text-sm text-red-500">{form.formState.errors.street?.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" placeholder="City" type="text" {...form.register("city")} />
            {form.formState.errors.city?.message && (
              <p className="text-sm text-red-500">{form.formState.errors.city?.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="state">State</Label>
            <Input id="state" placeholder="State" type="text" {...form.register("state")} />
            {form.formState.errors.state?.message && (
              <p className="text-sm text-red-500">{form.formState.errors.state?.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="zip_code">Zip Code</Label>
            <Input id="zip_code" placeholder="Zip Code" type="text" {...form.register("zip_code")} />
            {form.formState.errors.zip_code?.message && (
              <p className="text-sm text-red-500">{form.formState.errors.zip_code?.message}</p>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
