
import { supabase } from '@/integrations/supabase/client';

export interface School {
  id: string;
  name: string;
  enrollment_size?: number;
  street?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  district_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSchoolParams {
  name: string;
  enrollment_size?: number;
  street?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  district_id: string;
}

/**
 * Fetches all schools for the current district
 */
export const fetchSchools = async (districtId: string): Promise<School[]> => {
  try {
    console.log("fetchSchools - Fetching schools for district ID:", districtId);
    
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('district_id', districtId)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error in fetchSchools:', error);
      throw error;
    }
    
    console.log("fetchSchools - Results:", data?.length || 0, "schools found");
    return data || [];
  } catch (error) {
    console.error('Error fetching schools:', error);
    throw error;
  }
};

/**
 * Fetch a single school by ID
 */
export const fetchSchoolById = async (schoolId: string): Promise<School | null> => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('id', schoolId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching school:', error);
    throw error;
  }
};

/**
 * Creates a new school
 */
export const createSchool = async (schoolData: CreateSchoolParams): Promise<School> => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .insert(schoolData)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating school:', error);
    throw error;
  }
};

/**
 * Updates an existing school
 */
export const updateSchool = async (schoolId: string, schoolData: Partial<School>): Promise<School> => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .update(schoolData)
      .eq('id', schoolId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating school:', error);
    throw error;
  }
};

/**
 * Deletes a school
 */
export const deleteSchool = async (schoolId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('schools')
      .delete()
      .eq('id', schoolId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting school:', error);
    throw error;
  }
};
