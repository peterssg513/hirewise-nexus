
import { z } from 'zod';
import { jobFormSchema } from './schema';

export type JobFormValues = z.infer<typeof jobFormSchema>;
