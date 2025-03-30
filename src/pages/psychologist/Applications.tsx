import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, BriefcaseBusiness, ClipboardCheck, FileSpreadsheet, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JobApplication {
  id: string;
  job_title: string;
  district_name: string;
  status: string;
  created_at: string;
  has_evaluation: boolean;
  evaluation_id?: string;
}

interface Evaluation {
  id: string;
  status: string;
  job_title: string;
  district_name: string;
  created_at: string;
}

const renderStatusBadge = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'approved':
      return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Approved</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return <Badge variant="outline" className="text-amber-600 border-amber-600">Pending</Badge>;
  }
};
