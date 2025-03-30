
import { supabase } from '@/integrations/supabase/client';

export interface Certification {
  id: string;
  name: string;
  url: string;
  status: 'pending' | 'verified';
  uploadedAt: string;
}

/**
 * Uploads a certification file to Supabase storage
 */
export const uploadCertificationFile = async (
  userId: string,
  file: File,
  certName: string
): Promise<Certification> => {
  const fileExt = file.name.split('.').pop();
  const timestamp = new Date().getTime();
  const filePath = `${userId}/certifications/${timestamp}_${certName.replace(/\s+/g, '-').toLowerCase()}.${fileExt}`;
  
  const { error: uploadError, data } = await supabase.storage
    .from('psychologist_files')
    .upload(filePath, file);
    
  if (uploadError) throw uploadError;
  
  const { data: urlData } = supabase.storage
    .from('psychologist_files')
    .getPublicUrl(filePath);
    
  return {
    id: timestamp.toString(),
    name: certName,
    url: urlData.publicUrl,
    status: 'pending',
    uploadedAt: new Date().toISOString(),
  };
};

/**
 * Saves certification data to the psychologist profile
 */
export const saveCertifications = async (
  userId: string, 
  certifications: Certification[]
): Promise<void> => {
  // Extract the certification URLs as strings to store in the database
  // This matches the string[] type expected by the database
  const certificationUrls = certifications.map(cert => cert.url);
  
  const { error } = await supabase
    .from('psychologists')
    .update({
      certifications: certificationUrls,
      signup_progress: 4,
    })
    .eq('user_id', userId);
    
  if (error) throw error;
};
