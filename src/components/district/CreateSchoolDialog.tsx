import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useForm, SubmitHandler } from "react-hook-form"
import { CreateSchoolParams, School, createSchool } from '@/services/schoolService';
import { useToast } from '@/hooks/use-toast';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { v4 as uuidv4 } from 'uuid';

interface CreateSchoolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  districtId: string;
  onSchoolCreated: (school: School) => void;
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

export const CreateSchoolDialog: React.FC<CreateSchoolDialogProps> = ({ open, onOpenChange, districtId, onSchoolCreated }) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: {
      name: "",
      enrollment_size: "",
      street: "",
      city: "",
      state: "",
      zip_code: "",
    },
  })

  const handleSubmit = async (data: SchoolFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Convert enrollment_size from string to number
      const schoolData: CreateSchoolParams = {
        ...data,
        enrollment_size: data.enrollment_size ? parseInt(data.enrollment_size as string, 10) : undefined,
        district_id: districtId
      };
      
      const newSchool = await createSchool(schoolData);
      onSchoolCreated(newSchool);
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error('Failed to create school:', error);
      toast({
        title: 'Error',
        description: 'Failed to create school. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add School</DialogTitle>
          <DialogDescription>
            Add a new school to the district.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" className="col-span-3" {...register("name")} />
              {errors.name && (
                <p className="col-span-4 text-sm text-red-500 mt-1 ml-auto">
                  {errors.name?.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="enrollment_size" className="text-right">
                Enrollment Size
              </Label>
              <Input
                id="enrollment_size"
                className="col-span-3"
                {...register("enrollment_size")}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="street" className="text-right">
                Street
              </Label>
              <Input id="street" className="col-span-3" {...register("street")} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="city" className="text-right">
                City
              </Label>
              <Input id="city" className="col-span-3" {...register("city")} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="state" className="text-right">
                State
              </Label>
              <Input id="state" className="col-span-3" {...register("state")} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="zip_code" className="text-right">
                Zip Code
              </Label>
              <Input id="zip_code" className="col-span-3" {...register("zip_code")} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create School"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
