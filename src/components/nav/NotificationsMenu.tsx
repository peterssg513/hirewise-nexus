
import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { markAllNotificationsAsRead, markNotificationAsRead, Notification, fetchUserNotifications } from '@/services/notificationService';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const NotificationsMenu = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const notifs = await fetchUserNotifications();
      console.log('Fetched notifications:', notifs);
      setNotifications(notifs || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: 'Failed to load notifications',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      
      // Subscribe to changes in notifications
      const channel = supabase
        .channel('notifications-changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          }, 
          (payload) => {
            console.log('Notification change detected:', payload);
            fetchNotifications();
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleNavigateToRelatedItem = (notification: Notification) => {
    if (!notification.related_id) return;
    
    // Mark as read
    handleMarkAsRead(notification.id);
    
    // Navigate based on notification type and user role
    const type = notification.type;
    console.log('Navigating based on notification type:', type, 'user role:', profile?.role);
    
    if (profile?.role === 'admin') {
      // Admin navigation rules
      if (type.includes('district')) {
        navigate('/admin-dashboard/districts');
      } else if (type.includes('psychologist')) {
        navigate('/admin-dashboard/psychologists');
      } else if (type.includes('job')) {
        navigate('/admin-dashboard/jobs');
      } else if (type.includes('evaluation')) {
        navigate('/admin-dashboard/evaluations');
      } else {
        navigate('/admin-dashboard');
      }
    } else if (profile?.role === 'district') {
      // District navigation rules
      if (type.includes('application')) {
        navigate('/district-dashboard/applications');
      } else if (type.includes('job')) {
        navigate('/district-dashboard/jobs');
      } else if (type.includes('evaluation')) {
        navigate('/district-dashboard/evaluations');
      } else {
        navigate('/district-dashboard');
      }
    } else if (profile?.role === 'psychologist') {
      // Psychologist navigation rules
      if (type.includes('application')) {
        navigate('/psychologist-dashboard/applications');
      } else if (type.includes('job')) {
        navigate('/psychologist-dashboard/jobs');
      } else if (type.includes('evaluation')) {
        navigate('/psychologist-dashboard/evaluations');
      } else if (type.includes('profile') || type.includes('certification')) {
        navigate('/psychologist-dashboard/profile');
      } else {
        navigate('/psychologist-dashboard');
      }
    }
    
    // Close the dropdown after navigation
    setIsOpen(false);
  };

  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          {unreadCount > 0 && (
            <Badge className="absolute -right-1 -top-1 min-h-[1.2rem] min-w-[1.2rem] p-0 flex items-center justify-center bg-destructive">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px]">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} className="text-xs">
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          notifications.map(notification => (
            <DropdownMenuItem 
              key={notification.id} 
              className={`flex flex-col items-start cursor-pointer p-3 ${!notification.read ? 'bg-muted/50' : ''}`}
              onClick={() => handleNavigateToRelatedItem(notification)}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-medium">
                  {notification.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(notification.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm mt-1">{notification.message}</p>
              {!notification.read && (
                <Badge className="mt-2" variant="outline">New</Badge>
              )}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsMenu;
