
import { supabase } from '@/integrations/supabase/client';

export const STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
  'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
  'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
  'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
  'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
  'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
  'District of Columbia'
];

export const WORK_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Temporary',
  'Seasonal',
  'Internship',
  'Consultant',
  'Independent Contractor',
  'Per Diem'
];

export const WORK_LOCATIONS = [
  'On-site',
  'Remote',
  'Hybrid',
  'Multiple Schools',
  'District Office'
];

interface StateSalary {
  id: string;
  state: string;
  salary_amount: number;
  year: number;
}

export const fetchAverageSalaryByState = async (state: string): Promise<number | null> => {
  try {
    // Check for valid state name
    if (!STATES.includes(state)) {
      console.error(`Invalid state: ${state}`);
      return null;
    }

    // Using the from() method with a table that actually exists in your database
    const { data, error } = await supabase
      .from('state_salaries') // Using the actual table name that exists in your database
      .select('salary_amount')
      .eq('state_name', state)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching state salary:', error);
      return null;
    }

    return data?.salary_amount || null;
  } catch (error) {
    console.error('Exception fetching state salary:', error);
    return null;
  }
};
