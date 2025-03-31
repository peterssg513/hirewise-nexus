
-- Create or update notification trigger for district status changes
CREATE OR REPLACE FUNCTION public.district_status_notification() 
RETURNS TRIGGER 
LANGUAGE plpgsql 
AS $$
BEGIN
  -- Only trigger on status changes
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;
  
  -- Create notification based on new status
  IF NEW.status = 'approved' THEN
    INSERT INTO public.notifications (user_id, message, type, related_id)
    VALUES (
      NEW.user_id, 
      'Your district "' || NEW.name || '" has been approved! You can now create jobs and evaluation requests.',
      'district_approved',
      NEW.id
    );
  ELSIF NEW.status = 'rejected' THEN
    INSERT INTO public.notifications (user_id, message, type, related_id)
    VALUES (
      NEW.user_id, 
      'Your district "' || NEW.name || '" registration has been rejected. Please check your dashboard for details.',
      'district_rejected',
      NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS district_status_notification_trigger ON public.districts;
CREATE TRIGGER district_status_notification_trigger
AFTER UPDATE OF status ON public.districts
FOR EACH ROW
EXECUTE FUNCTION public.district_status_notification();
