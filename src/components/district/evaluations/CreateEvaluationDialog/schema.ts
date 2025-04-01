
import * as z from 'zod';
import { EvaluationRequestStatus } from '@/services/evaluationRequestService';

export const evaluationFormSchema = z.object({
  legal_name: z.string().optional(),
  date_of_birth: z.string().optional(),
  age: z.string().optional(),
  grade: z.string().optional(),
  district_id: z.string(),
  school_id: z.string().optional(),
  student_id: z.string().optional(),
  general_education_teacher: z.string().optional(),
  special_education_teachers: z.string().optional(),
  parents: z.string().optional(),
  other_relevant_info: z.string().optional(),
  service_type: z.string().optional(),
  status: z.string().optional().refine(
    (val): val is EvaluationRequestStatus => 
      val === undefined || 
      ['pending', 'active', 'completed', 'canceled', 'rejected', 
       'Open', 'Offered', 'Accepted', 'Evaluation In Progress', 'Closed'].includes(val),
    { message: "Invalid status value" }
  ),
  state: z.string().optional(),
  payment_amount: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  timeframe: z.string().optional(),
  skills_required: z.array(z.string()).optional(),
});

export type EvaluationFormValues = z.infer<typeof evaluationFormSchema>;
