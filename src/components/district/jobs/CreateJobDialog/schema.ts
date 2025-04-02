
import { z } from 'zod';

export const jobFormSchema = z.object({
  title: z.string().min(2, {
    message: "Job title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  district_id: z.string(),
  school_id: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().default("USA"),
  work_location: z.string().optional(),
  work_type: z.string().optional(),
  qualifications: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  languages_required: z.array(z.string()).optional(),
});
