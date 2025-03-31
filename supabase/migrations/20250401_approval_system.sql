
-- Create notification trigger for job approvals/rejections
CREATE OR REPLACE FUNCTION public.job_status_notification() 
RETURNS TRIGGER 
LANGUAGE plpgsql 
AS $$
DECLARE
  district_user_id UUID;
  district_name TEXT;
BEGIN
  -- Only trigger on status changes
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;
  
  -- Get district information
  SELECT d.user_id, d.name INTO district_user_id, district_name
  FROM public.districts d
  WHERE d.id = NEW.district_id;
  
  -- Create notification based on new status
  IF NEW.status = 'active' THEN
    INSERT INTO public.notifications (user_id, message, type, related_id)
    VALUES (
      district_user_id, 
      'Your job posting "' || NEW.title || '" has been approved and is now live!',
      'job_approved',
      NEW.id
    );
  ELSIF NEW.status = 'rejected' THEN
    INSERT INTO public.notifications (user_id, message, type, related_id)
    VALUES (
      district_user_id, 
      'Your job posting "' || NEW.title || '" has been rejected. Please check your dashboard for details.',
      'job_rejected',
      NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create job status notification trigger
DROP TRIGGER IF EXISTS job_status_notification_trigger ON public.jobs;
CREATE TRIGGER job_status_notification_trigger
AFTER UPDATE OF status ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.job_status_notification();

-- Create notification trigger for district status changes
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

-- Create district status notification trigger
DROP TRIGGER IF EXISTS district_status_notification_trigger ON public.districts;
CREATE TRIGGER district_status_notification_trigger
AFTER UPDATE OF status ON public.districts
FOR EACH ROW
EXECUTE FUNCTION public.district_status_notification();

-- Create notification trigger for psychologist status changes
CREATE OR REPLACE FUNCTION public.psychologist_status_notification() 
RETURNS TRIGGER 
LANGUAGE plpgsql 
AS $$
DECLARE
  user_name TEXT;
BEGIN
  -- Only trigger on status changes
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;
  
  -- Get user name
  SELECT name INTO user_name
  FROM public.profiles
  WHERE id = NEW.user_id;
  
  -- Create notification based on new status
  IF NEW.status = 'approved' THEN
    INSERT INTO public.notifications (user_id, message, type, related_id)
    VALUES (
      NEW.user_id, 
      'Your psychologist profile has been approved! You can now apply for jobs and evaluations.',
      'psychologist_approved',
      NEW.id
    );
  ELSIF NEW.status = 'rejected' THEN
    INSERT INTO public.notifications (user_id, message, type, related_id)
    VALUES (
      NEW.user_id, 
      'Your psychologist profile has been rejected. Please check your dashboard for details.',
      'psychologist_rejected',
      NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create psychologist status notification trigger
DROP TRIGGER IF EXISTS psychologist_status_notification_trigger ON public.psychologists;
CREATE TRIGGER psychologist_status_notification_trigger
AFTER UPDATE OF status ON public.psychologists
FOR EACH ROW
EXECUTE FUNCTION public.psychologist_status_notification();

-- Create notification trigger for evaluation status changes
CREATE OR REPLACE FUNCTION public.evaluation_status_notification() 
RETURNS TRIGGER 
LANGUAGE plpgsql 
AS $$
DECLARE
  district_user_id UUID;
  district_name TEXT;
BEGIN
  -- Only trigger on status changes
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;
  
  -- Get district information
  SELECT d.user_id, d.name INTO district_user_id, district_name
  FROM public.districts d
  WHERE d.id = NEW.district_id;
  
  -- Create notification based on new status
  IF NEW.status = 'active' THEN
    INSERT INTO public.notifications (user_id, message, type, related_id)
    VALUES (
      district_user_id, 
      'Evaluation request for "' || COALESCE(NEW.legal_name, 'Unnamed Student') || '" has been approved!',
      'evaluation_approved',
      NEW.id
    );
  ELSIF NEW.status = 'rejected' THEN
    INSERT INTO public.notifications (user_id, message, type, related_id)
    VALUES (
      district_user_id, 
      'Evaluation request for "' || COALESCE(NEW.legal_name, 'Unnamed Student') || '" has been rejected. Please check your dashboard for details.',
      'evaluation_rejected',
      NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create evaluation status notification trigger
DROP TRIGGER IF EXISTS evaluation_status_notification_trigger ON public.evaluation_requests;
CREATE TRIGGER evaluation_status_notification_trigger
AFTER UPDATE OF status ON public.evaluation_requests
FOR EACH ROW
EXECUTE FUNCTION public.evaluation_status_notification();
