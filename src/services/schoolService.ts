
import { supabase } from '@/integrations/supabase/client';

export interface School {
  id: string;
  district_id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  phone?: string;
  email?: string;
  website?: string;
  principal_name?: string;
  school_type?: string;
  grade_levels?: string[];
  student_count?: number;
  street?: string;
  zip_code?: string;
  enrollment_size?: number;
}

// Type for creating a school
export type CreateSchoolParams = Partial<School> & { 
  name: string; 
  district_id: string;
};

// Fetch schools for a district
export const fetchSchools = async (districtId: string): Promise<School[]> => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('district_id', districtId)
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data as School[];
  } catch (error) {
    console.error('Error fetching schools:', error);
    return [];
  }
};

// Create a new school
export const createSchool = async (schoolData: CreateSchoolParams): Promise<School> => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .insert([schoolData])
      .select()
      .single();
    
    if (error) throw error;
    return data as School;
  } catch (error) {
    console.error('Error creating school:', error);
    throw error;
  }
};

// Update a school
export const updateSchool = async (id: string, schoolData: Partial<School>): Promise<School> => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .update(schoolData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as School;
  } catch (error) {
    console.error('Error updating school:', error);
    throw error;
  }
};

// Delete a school
export const deleteSchool = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('schools')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting school:', error);
    throw error;
  }
};

// Fetch school by id - the main function that should be exported
export const fetchSchoolById = async (id: string): Promise<School | null> => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as School;
  } catch (error) {
    console.error('Error fetching school:', error);
    return null;
  }
};

// Get school by id - alias for backward compatibility
export const getSchoolById = async (id: string): Promise<School | null> => {
  return fetchSchoolById(id);
};
