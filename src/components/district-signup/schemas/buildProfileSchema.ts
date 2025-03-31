
import * as z from 'zod';

export const buildProfileSchema = z.object({
  name: z.string().min(2, {
    message: "District name must be at least 2 characters.",
  }),
  state: z.string().min(2, {
    message: "Please select a state.",
  }),
  district_size: z.coerce.number().min(1, {
    message: "Please select a district size.",
  }),
  website: z.string().url({
    message: "Please enter a valid website URL (include https://).",
  }).or(z.string().length(0)),
  first_name: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  last_name: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  job_title: z.string().min(2, {
    message: "Job title must be at least 2 characters.",
  }),
  contact_email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  contact_phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
});

export type BuildProfileFormValues = z.infer<typeof buildProfileSchema>;
