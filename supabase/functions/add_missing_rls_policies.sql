
-- Function to add missing row level security policies
CREATE OR REPLACE FUNCTION public.add_missing_rls_policies()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if jobs table has RLS enabled
  IF NOT (SELECT rls_enabled FROM pg_tables WHERE schemaname = 'public' AND tablename = 'jobs') THEN
    -- Enable RLS on jobs table
    ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
  END IF;
  
  -- District jobs policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'jobs' 
    AND policyname = 'Districts can view their own jobs'
  ) THEN
    CREATE POLICY "Districts can view their own jobs" 
    ON public.jobs 
    FOR SELECT 
    USING (
      auth.uid() IN (
        SELECT d.user_id 
        FROM public.districts d 
        WHERE d.id = district_id
      )
    );
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'jobs' 
    AND policyname = 'Districts can insert their own jobs'
  ) THEN
    CREATE POLICY "Districts can insert their own jobs" 
    ON public.jobs 
    FOR INSERT 
    WITH CHECK (
      auth.uid() IN (
        SELECT d.user_id 
        FROM public.districts d 
        WHERE d.id = district_id
      )
    );
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'jobs' 
    AND policyname = 'Districts can update their own jobs'
  ) THEN
    CREATE POLICY "Districts can update their own jobs" 
    ON public.jobs 
    FOR UPDATE 
    USING (
      auth.uid() IN (
        SELECT d.user_id 
        FROM public.districts d 
        WHERE d.id = district_id
      )
    );
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'jobs' 
    AND policyname = 'Districts can delete their own jobs'
  ) THEN
    CREATE POLICY "Districts can delete their own jobs" 
    ON public.jobs 
    FOR DELETE 
    USING (
      auth.uid() IN (
        SELECT d.user_id 
        FROM public.districts d 
        WHERE d.id = district_id
      )
    );
  END IF;
  
  -- Psychologists can view active jobs
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'jobs' 
    AND policyname = 'Psychologists can view active jobs'
  ) THEN
    CREATE POLICY "Psychologists can view active jobs" 
    ON public.jobs 
    FOR SELECT 
    USING (
      status = 'active' AND
      auth.uid() IN (
        SELECT p.user_id 
        FROM public.psychologists p
      )
    );
  END IF;
  
  -- Admins can view all jobs
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'jobs' 
    AND policyname = 'Admins can view all jobs'
  ) THEN
    CREATE POLICY "Admins can view all jobs" 
    ON public.jobs 
    FOR ALL 
    USING (
      auth.uid() IN (
        SELECT p.id 
        FROM public.profiles p 
        WHERE p.role = 'admin'
      )
    );
  END IF;
  
  -- Check if evaluation_requests table has RLS enabled
  IF NOT (SELECT rls_enabled FROM pg_tables WHERE schemaname = 'public' AND tablename = 'evaluation_requests') THEN
    -- Enable RLS on evaluation_requests table
    ALTER TABLE public.evaluation_requests ENABLE ROW LEVEL SECURITY;
  END IF;
  
  -- District evaluation policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'evaluation_requests' 
    AND policyname = 'Districts can view their own evaluations'
  ) THEN
    CREATE POLICY "Districts can view their own evaluations" 
    ON public.evaluation_requests 
    FOR SELECT 
    USING (
      auth.uid() IN (
        SELECT d.user_id 
        FROM public.districts d 
        WHERE d.id = district_id
      )
    );
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'evaluation_requests' 
    AND policyname = 'Districts can insert their own evaluations'
  ) THEN
    CREATE POLICY "Districts can insert their own evaluations" 
    ON public.evaluation_requests 
    FOR INSERT 
    WITH CHECK (
      auth.uid() IN (
        SELECT d.user_id 
        FROM public.districts d 
        WHERE d.id = district_id
      )
    );
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'evaluation_requests' 
    AND policyname = 'Districts can update their own evaluations'
  ) THEN
    CREATE POLICY "Districts can update their own evaluations" 
    ON public.evaluation_requests 
    FOR UPDATE 
    USING (
      auth.uid() IN (
        SELECT d.user_id 
        FROM public.districts d 
        WHERE d.id = district_id
      )
    );
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'evaluation_requests' 
    AND policyname = 'Districts can delete their own evaluations'
  ) THEN
    CREATE POLICY "Districts can delete their own evaluations" 
    ON public.evaluation_requests 
    FOR DELETE 
    USING (
      auth.uid() IN (
        SELECT d.user_id 
        FROM public.districts d 
        WHERE d.id = district_id
      )
    );
  END IF;
  
  -- Admins can view all evaluations
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'evaluation_requests' 
    AND policyname = 'Admins can view all evaluations'
  ) THEN
    CREATE POLICY "Admins can view all evaluations" 
    ON public.evaluation_requests 
    FOR ALL 
    USING (
      auth.uid() IN (
        SELECT p.id 
        FROM public.profiles p 
        WHERE p.role = 'admin'
      )
    );
  END IF;
  
  -- Ensure realtime is enabled for all tables
  ALTER PUBLICATION supabase_realtime ADD TABLE public.districts, public.psychologists, public.jobs, public.evaluation_requests, public.applications, public.evaluations, public.notifications;
  
END;
$$;

-- Function to enable realtime for tables
CREATE OR REPLACE FUNCTION public.enable_realtime_for_tables()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Set full replica identity for realtime
  ALTER TABLE public.districts REPLICA IDENTITY FULL;
  ALTER TABLE public.psychologists REPLICA IDENTITY FULL;
  ALTER TABLE public.jobs REPLICA IDENTITY FULL;
  ALTER TABLE public.evaluation_requests REPLICA IDENTITY FULL;
  ALTER TABLE public.applications REPLICA IDENTITY FULL;
  ALTER TABLE public.evaluations REPLICA IDENTITY FULL;
  ALTER TABLE public.notifications REPLICA IDENTITY FULL;
  
  -- Add tables to realtime publication
  ALTER PUBLICATION supabase_realtime ADD TABLE public.districts, public.psychologists, public.jobs, public.evaluation_requests, public.applications, public.evaluations, public.notifications;
END;
$$;
