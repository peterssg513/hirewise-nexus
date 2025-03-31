
import { supabase } from '@/integrations/supabase/client';

export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  grade?: string;
  current_teacher?: string;
  school_id?: string;
  district_id?: string;
  parent_guardian1_name?: string;
  parent_guardian2_name?: string;
  parent_guardian1_phone?: string;
  parent_guardian1_email?: string;
  parent_guardian2_phone?: string;
  parent_guardian2_email?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateStudentParams {
  first_name: string;
  last_name: string;
  grade?: string;
  current_teacher?: string;
  school_id?: string;
  district_id: string;
  parent_guardian1_name?: string;
  parent_guardian2_name?: string;
  parent_guardian1_phone?: string;
  parent_guardian1_email?: string;
  parent_guardian2_phone?: string;
  parent_guardian2_email?: string;
}

/**
 * Fetches all students for a district
 */
export const fetchStudents = async (districtId: string): Promise<Student[]> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('district_id', districtId)
      .order('last_name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

/**
 * Fetches students for a specific school
 */
export const fetchStudentsBySchool = async (schoolId: string): Promise<Student[]> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('school_id', schoolId)
      .order('last_name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching students by school:', error);
    throw error;
  }
};

/**
 * Fetch a single student by ID
 */
export const fetchStudentById = async (studentId: string): Promise<Student | null> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', studentId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching student:', error);
    throw error;
  }
};

/**
 * Creates a new student
 */
export const createStudent = async (studentData: CreateStudentParams): Promise<Student> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .insert(studentData)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating student:', error);
    throw error;
  }
};

/**
 * Updates an existing student
 */
export const updateStudent = async (studentId: string, studentData: Partial<Student>): Promise<Student> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .update(studentData)
      .eq('id', studentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
};

/**
 * Deletes a student
 */
export const deleteStudent = async (studentId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', studentId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
};
