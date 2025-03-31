
import { supabase } from '@/integrations/supabase/client';

export const STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
  { code: 'DC', name: 'District of Columbia' }
];

// Define a list of state names for backward compatibility
export const STATE_NAMES = STATES.map(state => state.name);

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
    const stateNames = STATES.map(s => s.name);
    if (!stateNames.includes(state)) {
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
