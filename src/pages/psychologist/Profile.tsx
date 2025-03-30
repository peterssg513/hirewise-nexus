
import React from 'react';
import { useProfileData } from '@/hooks/useProfileData';
import { useProfileEditor } from '@/hooks/useProfileEditor';
import ProfileLoadingState from '@/components/profile/ProfileLoadingState';
import ProfileErrorState from '@/components/profile/ProfileErrorState';
import ProfileNotFoundState from '@/components/profile/ProfileNotFoundState';
import ProfileContent from '@/components/profile/ProfileContent';
import EditProfileModal from '@/components/profile/EditProfileModal';

const Profile = () => {
  // Use the custom hooks for data fetching and profile editing
  const {
    profile,
    loading,
    error,
    experiences,
    educations,
    certifications,
    refreshProfile
  } = useProfileData();

  const [
    { isEditModalOpen, editSection, editItemId, loading: isEditing },
    {
      handleEditProfile,
      handleCloseEditModal,
      handleSaveProfile,
      handleProfilePictureUpdate,
      handleDeleteItem
    }
  ] = useProfileEditor({
    profile,
    experiences,
    educations,
    certifications,
    refreshProfile
  });

  // Show loading state
  if (loading) {
    return <ProfileLoadingState />;
  }

  // Show error state
  if (error) {
    return <ProfileErrorState error={error} onRetry={() => window.location.reload()} />;
  }

  // Show not found state
  if (!profile) {
    return <ProfileNotFoundState onRetry={() => window.location.reload()} />;
  }

  return (
    <>
      <ProfileContent
        profile={profile}
        experiences={experiences}
        educations={educations}
        certifications={certifications}
        onEditProfile={handleEditProfile}
        onProfilePictureUpdate={handleProfilePictureUpdate}
        onDeleteItem={handleDeleteItem}
      />

      {isEditModalOpen && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSave={handleSaveProfile}
          section={editSection}
          itemId={editItemId}
          profileData={profile}
          experienceData={editItemId ? experiences.find(exp => exp.id === editItemId) : undefined}
          educationData={editItemId ? educations.find(edu => edu.id === editItemId) : undefined}
          certificationData={editItemId ? certifications.find(cert => cert.id === editItemId) : undefined}
        />
      )}
    </>
  );
};

export default Profile;
