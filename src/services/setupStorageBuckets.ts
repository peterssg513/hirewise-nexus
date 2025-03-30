
import { supabase } from '@/integrations/supabase/client';

/**
 * Setup storage buckets in Supabase
 */
export const setupStorageBuckets = async (): Promise<void> => {
  try {
    // Check if certifications bucket exists
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
      
    if (bucketsError) throw bucketsError;
    
    const certificationsBucketExists = buckets.some(b => b.name === 'certifications');
    
    if (!certificationsBucketExists) {
      // Create the certifications bucket
      const { error: createBucketError } = await supabase
        .storage
        .createBucket('certifications', {
          public: true,
          fileSizeLimit: 5242880, // 5MB
        });
        
      if (createBucketError) throw createBucketError;
      
      console.log('Created certifications storage bucket');
    }
  } catch (error) {
    console.error('Error setting up storage buckets:', error);
  }
};

// Call this during app initialization
setupStorageBuckets();
