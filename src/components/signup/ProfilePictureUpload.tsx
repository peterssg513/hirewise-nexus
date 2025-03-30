
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Loader2 } from 'lucide-react';

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
  const [imagePreview, setImagePreview] = useState<string | null>(profilePictureUrl);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    
    try {
      setUploadingImage(true);
      
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `profile-picture-${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;
      
      // First create a local preview for immediate feedback
      setImagePreview(URL.createObjectURL(file));
      
      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('psychologist_files')
        .upload(filePath, file, { upsert: true });
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('psychologist_files')
        .getPublicUrl(filePath);
        
      if (!urlData?.publicUrl) {
        throw new Error('Failed to get public URL');
      }
      
      // Update the psychologist record with the profile picture URL
      const { error: updateError } = await supabase
        .from('psychologists')
        .update({ profile_picture_url: urlData.publicUrl })
        .eq('user_id', userId);
        
      if (updateError) throw updateError;
      
      // Update parent component
      onUploadComplete(urlData.publicUrl);
      
      toast({
        title: 'Image uploaded',
        description: 'Your profile picture has been uploaded successfully.',
      });
    } catch (error: any) {
      console.error('Profile picture upload error:', error);
      toast({
        title: 'Error uploading image',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      // Reset the preview on error
      setImagePreview(profilePictureUrl);
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="mb-8">
      <label className="block text-sm font-medium mb-2">Profile Picture</label>
      <div className="flex flex-col items-center">
        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 mb-4 bg-gray-100 relative">
          {imagePreview ? (
            <img 
              src={imagePreview} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>
        
        <label className="cursor-pointer bg-psyched-lightBlue hover:bg-psyched-lightBlue/90 text-white py-2 px-4 rounded flex items-center">
          <Upload className="w-4 h-4 mr-2" />
          {uploadingImage ? (
            <span className="flex items-center">
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Uploading...
            </span>
          ) : 'Upload Photo'}
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
