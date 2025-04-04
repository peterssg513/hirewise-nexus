
import { supabase } from '@/integrations/supabase/client';

// Available service types for evaluations
export const SERVICE_TYPES = [
  "Initial Evaluation",
  "Three-Year Reevaluation",
  "Independent Educational Evaluation (IEE)",
  "Functional Behavioral Assessment (FBA)",
  "Psychoeducational Assessment",
  "Social-Emotional Assessment",
  "Cognitive Assessment",
  "Behavioral Consultation",
  "Gifted and Talented Evaluation",
  "Other"
];

// Evaluation status options
export const EVALUATION_STATUS_OPTIONS = [
  "Open",
  "Offered",
  "Accepted",
  "Evaluation In Progress", 
  "Closed"
];

/**
 * Fetches the payment rate for a specific service type in a state
 * 
 * @param stateCode - Two-letter state code
 * @param serviceType - Type of evaluation service
 * @returns Payment amount as a number or null if not found
 */
export const fetchEvaluationPaymentRate = async (stateCode: string, serviceType: string): Promise<number | null> => {
  if (!stateCode || !serviceType) return null;
  
  try {
    const { data, error } = await supabase
      .from('evaluation_payment_rates')
      .select('payment_amount')
      .eq('state_code', stateCode)
      .eq('service_type', serviceType)
      .single();
    
    if (error || !data) {
      // If no specific rate found, try to get a default rate for the state
      const { data: defaultData, error: defaultError } = await supabase
        .from('state_salaries')
        .select('salary_amount')
        .eq('state_code', stateCode)
        .single();
      
      if (defaultError || !defaultData) return null;
      
      // Return 75% of the standard salary as the evaluation rate
      return Math.round(defaultData.salary_amount * 0.075);
    }
    
    return data.payment_amount;
  } catch (error) {
    console.error('Error fetching evaluation payment rate:', error);
    return null;
  }
};

/**
 * Gets the recommended payment amount for an evaluation based on state and service type
 * 
 * @param stateCode - Two-letter state code
 * @param serviceType - Type of evaluation service
 * @returns Formatted payment amount string
 */
export const getRecommendedPaymentAmount = (stateCode: string, serviceType: string): string => {
  // Default payment ranges by service type (will be used as fallback)
  const defaultPayments: Record<string, number> = {
    "Initial Evaluation": 750,
    "Three-Year Reevaluation": 650,
    "Independent Educational Evaluation (IEE)": 900,
    "Functional Behavioral Assessment (FBA)": 550,
    "Psychoeducational Assessment": 800,
    "Social-Emotional Assessment": 600,
    "Cognitive Assessment": 500,
    "Behavioral Consultation": 450,
    "Gifted and Talented Evaluation": 600,
    "Other": 500
  };

  return `$${defaultPayments[serviceType as keyof typeof defaultPayments] || 500}`;
};
