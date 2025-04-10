
import { supabase } from '@/integrations/supabase/client';

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  type: string;
  related_id?: string;
  created_at: string;
  read: boolean;
}

/**
 * Fetches notifications for the current user
 */
export const fetchUserNotifications = async (): Promise<Notification[]> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

/**
 * Marks a notification as read
 */
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) throw error;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

/**
 * Marks all notifications as read
 */
export const markAllNotificationsAsRead = async (): Promise<void> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      return;
    }
    
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userData.user.id)
      .eq('read', false);

    if (error) throw error;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

/**
 * Creates a notification for a specific user
 */
export const createNotification = async (
  userId: string,
  message: string,
  type: string,
  relatedId?: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        message,
        type,
        related_id: relatedId
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Deletes a notification
 */
export const deleteNotification = async (notificationId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

/**
 * Count unread notifications for the current user
 */
export const countUnreadNotifications = async (): Promise<number> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      return 0;
    }
    
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userData.user.id)
      .eq('read', false);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error counting unread notifications:', error);
    return 0;
  }
};
