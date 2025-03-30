
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

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
 * Uploads a certification file to storage
 */
export const uploadCertificationFile = async (
  userId: string, 
  file: File, 
  certificationName: string
): Promise<string> => {
  if (!userId || !file) {
    throw new Error('User ID and file are required');
  }
  
  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/${Date.now()}-${certificationName.replace(/\s+/g, '-').toLowerCase()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('certifications')
      .upload(filePath, file);
      
    if (error) throw error;
    
    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from('certifications')
      .getPublicUrl(filePath);
      
    return publicUrlData.publicUrl;
  } catch (error: any) {
    console.error('Failed to upload certification file:', error);
    throw new Error(`Failed to upload certification file: ${error.message || 'Unknown error'}`);
  }
};

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
      endYear: cert.endYear,
      // Add these fields to ensure compatibility with Profile view
      issuer: cert.issuer || null,
      date: cert.date || cert.startYear,
      expirationDate: cert.expirationDate || null,
      documentUrl: cert.documentUrl || cert.url || null
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
      // Type assertion to Certification[] since we know the structure matches
      return data.certification_details as unknown as Certification[];
    } else if (typeof data.certification_details === 'object') {
      // Type assertion to Certification[] since we know the structure matches
      return Object.values(data.certification_details) as unknown as Certification[];
    }
    
    return [];
  } catch (error: any) {
    console.error('Failed to get certifications:', error);
    throw new Error(`Failed to get certifications: ${error.message || 'Unknown error'}`);
  }
};
