
import { supabase } from '@/integrations/supabase/client';

export interface Certification {
  id: string;
  name: string;
  url?: string;
  status?: 'pending' | 'verified';
  uploadedAt?: string;
  startYear: string;
  endYear: string;
  // Additional fields that might be used in Profile view
  issuer?: string;
  date?: string;
  expirationDate?: string;
  documentUrl?: string;
}

/**
 * Saves certifications for a psychologist
 */
export const saveCertifications = async (userId: string, certifications: Certification[]): Promise<void> => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  try {
    // Get the psychologist record
    const { data: psychologist, error: fetchError } = await supabase
      .from('psychologists')
      .select('certification_details, id')
      .eq('user_id', userId)
      .single();
      
    if (fetchError) throw fetchError;
    
    // Prepare certification_details data
    const certificationDetails = certifications.map(cert => ({
      id: cert.id,
      name: cert.name,
      url: cert.url || null,
      status: cert.status || 'pending',
      uploadedAt: cert.uploadedAt || new Date().toISOString(),
      startYear: cert.startYear,
      endYear: cert.endYear
    }));
    
    // Update psychologist record
    const { error: updateError } = await supabase
      .from('psychologists')
      .update({
        certification_details: certificationDetails,
        signup_progress: 4 // Move to preferences step
      })
      .eq('user_id', userId);
      
    if (updateError) throw updateError;
    
    // If there are certifications with URLs, also update the certifications array
    if (certifications.some(cert => cert.url)) {
      const certUrls = certifications
        .filter(cert => cert.url)
        .map(cert => cert.url as string);
        
      const { error: certsError } = await supabase
        .from('psychologists')
        .update({
          certifications: certUrls
        })
        .eq('user_id', userId);
        
      if (certsError) throw certsError;
    }
  } catch (error: any) {
    console.error('Failed to save certifications:', error);
    throw new Error(`Failed to save certifications: ${error.message || 'Unknown error'}`);
  }
};

/**
 * Retrieves certifications for a psychologist
 */
export const getCertifications = async (userId: string): Promise<Certification[]> => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  try {
    const { data, error } = await supabase
      .from('psychologists')
      .select('certification_details')
      .eq('user_id', userId)
      .single();
      
    if (error) throw error;
    
    if (!data.certification_details) return [];
    
    // Handle both array and object formats
    if (Array.isArray(data.certification_details)) {
      return data.certification_details as Certification[];
    } else if (typeof data.certification_details === 'object') {
      return Object.values(data.certification_details) as Certification[];
    }
    
    return [];
  } catch (error: any) {
    console.error('Failed to get certifications:', error);
    throw new Error(`Failed to get certifications: ${error.message || 'Unknown error'}`);
  }
};
