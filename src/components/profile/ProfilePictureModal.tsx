
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Upload, X, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProfilePictureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (url: string) => Promise<void>;
  currentPictureUrl?: string | null;
  userId: string;
}

const ProfilePictureModal = ({
  isOpen,
  onClose,
  onSave,
  currentPictureUrl,
  userId
}: ProfilePictureModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPictureUrl || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setError(null);
    setSelectedFile(file);
    
    // Create preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(currentPictureUrl || null);
  };

  const uploadProfilePicture = async () => {
    if (!selectedFile || !userId) return;
    
    try {
      setUploading(true);
      setError(null);
      
      // Generate a unique file name
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;
      
      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, selectedFile);
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      // Save the URL
      await onSave(urlData.publicUrl);
      
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
      
      onClose();
    } catch (error: any) {
      console.error('Error uploading profile picture:', error);
      setError(error.message || 'Failed to upload profile picture');
      
      toast({
        title: "Error",
        description: "Failed to upload profile picture",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Profile Picture</DialogTitle>
          <DialogDescription>
            Upload a new profile picture. Recommended size: 400x400 pixels.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex flex-col items-center justify-center gap-4">
            {previewUrl ? (
              <div className="relative">
                <Avatar className="h-32 w-32 border-2 border-gray-200">
                  <AvatarImage src={previewUrl} alt="Profile preview" />
                  <AvatarFallback className="bg-psyched-lightBlue text-white text-2xl">
                    {userId.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                {selectedFile && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200"
                    onClick={clearSelection}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ) : (
              <div className="h-32 w-32 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                <Image className="h-12 w-12 text-gray-400" />
              </div>
            )}
            
            <div className="flex flex-col items-center gap-2 w-full">
              <Label 
                htmlFor="picture-upload" 
                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-center rounded-md cursor-pointer flex items-center justify-center gap-2 transition-colors"
              >
                <Upload className="h-4 w-4" />
                {selectedFile ? 'Change image' : 'Upload image'}
              </Label>
              <input
                type="file"
                id="picture-upload"
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
              />
              
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={uploading}>
            Cancel
          </Button>
          <Button 
            onClick={uploadProfilePicture} 
            disabled={!selectedFile || uploading}
            className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90"
          >
            {uploading ? 'Uploading...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfilePictureModal;
