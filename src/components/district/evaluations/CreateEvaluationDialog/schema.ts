
import { z } from "zod";
import { GRADE_LEVELS } from "@/services/evaluationServiceConstants";

export const evaluationFormSchema = z.object({
  legal_name: z.string().min(1, "Student's legal name is required"),
  service_type: z.string().min(1, "Service type is required"),
  general_education_teacher: z.string().optional(),
  special_education_teachers: z.string().optional(),
  parents: z.string().optional(),
  grade: z.string().optional(),
  date_of_birth: z.string().optional(),
  age: z.union([z.string(), z.number()]).optional(),
  other_relevant_info: z.string().optional(),
  school_id: z.string().optional(),
  timeframe: z.string().optional(),
  skills_required: z.array(z.string()).optional(),
});

export type EvaluationFormValues = z.infer<typeof evaluationFormSchema>;
