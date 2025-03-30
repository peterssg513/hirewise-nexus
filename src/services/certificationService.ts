
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
  if (!userId || !file || !certName) {
    throw new Error('Missing required parameters for certification upload');
  }
  
  const fileExt = file.name.split('.').pop();
  const timestamp = new Date().getTime();
  const filePath = `${userId}/certifications/${timestamp}_${certName.replace(/\s+/g, '-').toLowerCase()}.${fileExt}`;
  
  // Ensure storage bucket exists
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets?.find(bucket => bucket.name === 'psychologist_files')) {
      await supabase.storage.createBucket('psychologist_files', {
        public: true,
        fileSizeLimit: 5242880 // 5MB
      });
    }
  } catch (error) {
    console.error("Error checking/creating bucket:", error);
    // Continue anyway as the bucket might exist but the user may not have permission to list/create
  }
  
  try {
    const { error: uploadError } = await supabase.storage
      .from('psychologist_files')
      .upload(filePath, file);
      
    if (uploadError) {
      throw uploadError;
    }
    
    const { data: urlData } = supabase.storage
      .from('psychologist_files')
      .getPublicUrl(filePath);
      
    return urlData.publicUrl;
  } catch (error: any) {
    console.error('Certification upload error:', error);
    throw new Error(`Failed to upload certification: ${error.message}`);
  }
};

/**
 * Saves certification data to the psychologist profile
 */
export const saveCertifications = async (
  userId: string, 
  certifications: Certification[]
): Promise<void> => {
  if (!userId) {
    throw new Error('User ID is required to save certifications');
  }
  
  if (!Array.isArray(certifications) || certifications.length === 0) {
    throw new Error('At least one certification is required');
  }
  
  try {
    // Convert certifications to DTOs with just the necessary information
    const certificationDTOs: CertificationDTO[] = certifications.map(cert => ({
      url: cert.url,
      name: cert.name,
      startYear: cert.startYear,
      endYear: cert.endYear
    }));
    
    // Store the certifications as an array of strings (URLs) to match the expected type
    const certificationUrls: string[] = certifications.map(cert => cert.url);
    
    // Update the psychologist profile with both the certification URLs and detailed info
    const { error } = await supabase
      .from('psychologists')
      .update({
        certifications: certificationUrls, // Store just the URLs as a string array to match DB type
        certification_details: certificationDTOs, // Store detailed info as JSON in a separate field
        signup_progress: 4,
      })
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error saving certifications:', error);
      throw error;
    }
  } catch (error: any) {
    console.error('Failed to save certifications:', error);
    throw new Error(`Failed to save certifications: ${error.message}`);
  }
};

/**
 * Retrieves certifications for a psychologist
 */
export const getCertifications = async (userId: string): Promise<Certification[]> => {
  if (!userId) {
    throw new Error('User ID is required to retrieve certifications');
  }
  
  try {
    const { data, error } = await supabase
      .from('psychologists')
      .select('certifications, certification_details')
      .eq('user_id', userId)
      .single();
      
    if (error) {
      console.error('Error retrieving certifications:', error);
      throw error;
    }
    
    if (!data || !data.certification_details) {
      return [];
    }
    
    // Type guard to check if certification_details is an array
    if (!Array.isArray(data.certification_details)) {
      console.warn('certification_details is not an array:', data.certification_details);
      return [];
    }
    
    // Transform the certification details into the Certification interface
    return data.certification_details.map((cert: CertificationDTO, index: number) => ({
      id: `cert-${index}`,
      name: cert.name,
      url: cert.url,
      status: 'pending' as const,
      uploadedAt: new Date().toISOString(),
      startYear: cert.startYear,
      endYear: cert.endYear
    }));
  } catch (error: any) {
    console.error('Failed to retrieve certifications:', error);
    throw new Error(`Failed to retrieve certifications: ${error.message}`);
  }
};

/**
 * Verifies a certification
 */
export const verifyCertification = async (
  certificationId: string,
  psychologistId: string
): Promise<void> => {
  if (!certificationId || !psychologistId) {
    throw new Error('Certification ID and psychologist ID are required');
  }
  
  try {
    // First get the current certification details
    const { data, error } = await supabase
      .from('psychologists')
      .select('certification_details')
      .eq('id', psychologistId)
      .single();
      
    if (error) {
      console.error('Error retrieving certification details:', error);
      throw error;
    }
    
    if (!data || !data.certification_details) {
      throw new Error('No certification details found');
    }
    
    // Type guard to check if certification_details is an array
    if (!Array.isArray(data.certification_details)) {
      throw new Error('Certification details is not in the expected format');
    }
    
    // Update the status of the specific certification
    const updatedCertifications = data.certification_details.map(
      (cert: any, index: number) => {
        if (`cert-${index}` === certificationId) {
          return { ...cert, status: 'verified' };
        }
        return cert;
      }
    );
    
    // Save the updated certifications
    const { error: updateError } = await supabase
      .from('psychologists')
      .update({
        certification_details: updatedCertifications
      })
      .eq('id', psychologistId);
      
    if (updateError) {
      console.error('Error updating certification status:', updateError);
      throw updateError;
    }
  } catch (error: any) {
    console.error('Failed to verify certification:', error);
    throw new Error(`Failed to verify certification: ${error.message}`);
  }
};
