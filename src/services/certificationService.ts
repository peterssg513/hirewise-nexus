
import { supabase } from '@/integrations/supabase/client';

export interface Certification {
  id: string;
  name: string;
  url: string;
  status: 'pending' | 'verified';
  uploadedAt: string;
  startYear: string;
  endYear: string;
}

export type CertificationDTO = {
  url: string;
  name: string;
  startYear: string;
  endYear: string;
};

/**
 * Uploads a certification file to Supabase storage
 */
export const uploadCertificationFile = async (
  userId: string,
  file: File,
  certName: string
): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const timestamp = new Date().getTime();
  const filePath = `${userId}/certifications/${timestamp}_${certName.replace(/\s+/g, '-').toLowerCase()}.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from('psychologist_files')
    .upload(filePath, file);
    
  if (uploadError) throw uploadError;
  
  const { data: urlData } = supabase.storage
    .from('psychologist_files')
    .getPublicUrl(filePath);
    
  return urlData.publicUrl;
};

/**
 * Saves certification data to the psychologist profile
 */
export const saveCertifications = async (
  userId: string, 
  certifications: Certification[]
): Promise<void> => {
  // Convert certifications to DTOs with just the necessary information
  const certificationDTOs = certifications.map(cert => ({
    url: cert.url,
    name: cert.name,
    startYear: cert.startYear,
    endYear: cert.endYear
  }));
  
  // Convert the certification objects to JSON string to match the expected type
  const { error } = await supabase
    .from('psychologists')
    .update({
      certifications: JSON.stringify(certificationDTOs), // Convert to string to match the expected type
      signup_progress: 4,
    })
    .eq('user_id', userId);
    
  if (error) throw error;
};
