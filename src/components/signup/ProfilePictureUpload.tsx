
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload } from 'lucide-react';

interface ProfilePictureUploadProps {
  profilePictureUrl: string | null;
  userId: string;
  onUploadComplete: (url: string) => void;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({ 
  profilePictureUrl, 
  userId,
  onUploadComplete 
}) => {
  const { toast } = useToast();
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    
    try {
      setUploadingImage(true);
      
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/profile-picture.${fileExt}`;
      
      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('psychologist_files')
        .upload(filePath, file, { upsert: true });
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('psychologist_files')
        .getPublicUrl(filePath);
        
      onUploadComplete(urlData.publicUrl);
      
      toast({
        title: 'Image uploaded',
        description: 'Your profile picture has been uploaded successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error uploading image',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="mb-8">
      <label className="block text-sm font-medium mb-2">Profile Picture</label>
      <div className="flex flex-col items-center">
        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 mb-4">
          {profilePictureUrl ? (
            <img 
              src={profilePictureUrl} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>
        
        <label className="cursor-pointer bg-psyched-lightBlue hover:bg-psyched-lightBlue/90 text-white py-2 px-4 rounded flex items-center">
          <Upload className="w-4 h-4 mr-2" />
          {uploadingImage ? 'Uploading...' : 'Upload Photo'}
          <input 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploadingImage}
          />
        </label>
      </div>
    </div>
  );
};

export default ProfilePictureUpload;
