
import { supabase } from '@/integrations/supabase/client';

export interface EvaluationPaymentRate {
  id: string;
  state_code: string;
  service_type: string;
  payment_amount: number;
  created_at: string;
  updated_at: string;
}

export const SERVICE_TYPES = [
  "Evaluation Only",
  "Initial Referral/Evaluation Planning Meeting",
  "Re-evaluation Review Meeting",
  "Manifestation Determination",
  "BIP Review",
  "Change of Placement"
];

export const EVALUATION_STATUS_OPTIONS = [
  "Open",
  "Offered",
  "Accepted",
  "Evaluation In Progress",
  "Closed"
];

export const GRADE_LEVELS = [
  "K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"
];

/**
 * Fetches the evaluation payment rate for a specific state and service type
 */
export const fetchEvaluationPaymentRate = async (stateCode: string, serviceType: string): Promise<number | null> => {
  try {
    // We need to cast the type to access the new table
    const { data, error } = await supabase
      .from('evaluation_payment_rates')
      .select('payment_amount')
      .eq('state_code', stateCode)
      .eq('service_type', serviceType)
      .single();

    if (error) throw error;
    return data ? data.payment_amount : null;
  } catch (error) {
    console.error('Error fetching evaluation payment rate:', error);
    return null;
  }
};

/**
 * Fetches all evaluation payment rates
 */
export const fetchAllEvaluationPaymentRates = async (): Promise<EvaluationPaymentRate[]> => {
  try {
    // We need to cast the type to access the new table
    const { data, error } = await supabase
      .from('evaluation_payment_rates')
      .select('*')
      .order('state_code', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching evaluation payment rates:', error);
    return [];
  }
};
