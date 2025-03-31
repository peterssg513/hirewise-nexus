
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { DataTable } from '@/components/admin/dashboard/DataTable';
import RejectionDialog from '@/components/admin/psychologists/RejectionDialog';
import EmptyState from '@/components/admin/psychologists/EmptyState';

const AdminPsychologists = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingPsychologists, setPendingPsychologists] = useState([]);
  const [approvedPsychologists, setApprovedPsychologists] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Rejection dialog state
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [psychologistToReject, setPsychologistToReject] = useState({ id: '', name: '' });

  useEffect(() => {
    fetchPsychologists();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('admin-psychologists-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'psychologists' }, 
        () => fetchPsychologists()
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  const fetchPsychologists = async () => {
    try {
      setLoading(true);
      
      // Fetch pending psychologists
      const { data: pendingData, error: pendingError } = await supabase
        .from('psychologists')
        .select(`
          id, 
          experience_years,
          specialties,
          certification_details,
          status,
          city,
          state,
          phone_number,
          profile_picture_url,
          created_at,
          profiles:user_id(email, name)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
        
      if (pendingError) throw pendingError;
      
      // Fetch approved psychologists
      const { data: approvedData, error: approvedError } = await supabase
        .from('psychologists')
        .select(`
          id, 
          experience_years,
          specialties,
          certification_details,
          status,
          city,
          state,
          phone_number,
          profile_picture_url,
          created_at,
          profiles:user_id(email, name)
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
        
      if (approvedError) throw approvedError;
      
      setPendingPsychologists(pendingData || []);
      setApprovedPsychologists(approvedData || []);
      
    } catch (error) {
      console.error('Error fetching psychologists:', error);
      toast({
        title: 'Failed to load psychologists',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const approvePsychologist = async (id, name) => {
    try {
      await supabase.rpc('approve_psychologist', { psychologist_id: id });
      
      // Get psychologist user_id for notification
      const { data: psychData } = await supabase
        .from('psychologists')
        .select('user_id')
        .eq('id', id)
        .single();
        
      // Create notification for the user
      if (psychData?.user_id) {
        await supabase.from('notifications').insert({
          user_id: psychData.user_id,
          message: `Your profile has been approved! You can now apply to jobs.`,
          type: 'psychologist_approved',
          related_id: id
        });
      }
      
      toast({
        title: 'Success',
        description: `Psychologist "${name}" approved successfully`
      });
      
      // Log this approval action
      await supabase.from('analytics_events').insert({
        event_type: 'psychologist_approved',
        user_id: profile?.id,
        event_data: { 
          entity_id: id,
          entity_name: name,
          timestamp: new Date().toISOString()
        }
      });
      
      // Refresh the lists
      fetchPsychologists();
      
    } catch (error) {
      console.error(`Error approving psychologist:`, error);
      toast({
        title: `Failed to approve psychologist`,
        variant: 'destructive'
      });
    }
  };

  const openRejectionDialog = (id, name) => {
    setPsychologistToReject({ id, name });
    setRejectionReason('');
    setRejectionDialogOpen(true);
  };

  const handleReject = async () => {
    try {
      const result = await supabase
        .from('psychologists')
        .update({ 
          status: 'rejected'
        })
        .eq('id', psychologistToReject.id);
      
      if (result.error) throw result.error;
      
      // Get psychologist user_id for notification
      const { data: psychData } = await supabase
        .from('psychologists')
        .select('user_id')
        .eq('id', psychologistToReject.id)
        .single();
        
      // Create notification for the user
      if (psychData?.user_id) {
        await supabase.from('notifications').insert({
          user_id: psychData.user_id,
          message: `Your profile was not approved. Reason: ${rejectionReason}`,
          type: 'psychologist_rejected',
          related_id: psychologistToReject.id
        });
      }
      
      toast({
        title: 'Psychologist rejected',
        description: `Psychologist profile has been rejected`
      });
      
      // Log this rejection action
      await supabase.from('analytics_events').insert({
        event_type: 'psychologist_rejected',
        user_id: profile?.id,
        event_data: { 
          entity_id: psychologistToReject.id,
          entity_name: psychologistToReject.name,
          reason: rejectionReason,
          timestamp: new Date().toISOString()
        }
      });
      
      // Refresh the list
      fetchPsychologists();
      
    } catch (error) {
      console.error(`Error rejecting psychologist:`, error);
      toast({
        title: `Failed to reject psychologist`,
        variant: 'destructive'
      });
    } finally {
      setRejectionDialogOpen(false);
    }
  };
  
  const psychologistColumns = [
    {
      key: 'name',
      header: 'Name',
      cell: (psych) => (
        <div className="font-medium">{psych.profiles?.name || 'Unnamed'}</div>
      )
    },
    {
      key: 'email',
      header: 'Email',
      cell: (psych) => (
        <div>{psych.profiles?.email || 'No email'}</div>
      )
    },
    {
      key: 'location',
      header: 'Location',
      cell: (psych) => (
        <div>{psych.city && psych.state ? `${psych.city}, ${psych.state}` : 'Not specified'}</div>
      )
    },
    {
      key: 'experience',
      header: 'Experience',
      cell: (psych) => (
        <div>{psych.experience_years ? `${psych.experience_years} years` : 'Not specified'}</div>
      )
    },
    {
      key: 'specialties',
      header: 'Specialties',
      cell: (psych) => (
        <div className="truncate max-w-xs" title={psych.specialties?.join(', ')}>
          {psych.specialties?.length ? psych.specialties.join(', ') : 'None specified'}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      cell: (psych) => (
        <Badge className={psych.status === 'pending' ? 'bg-yellow-500' : 'bg-green-500'}>
          {psych.status === 'pending' ? 'Pending' : 'Approved'}
        </Badge>
      )
    }
  ];
  
  const pendingPsychologistActions = (psych) => (
    <div className="flex gap-2 justify-end">
      <Button 
        variant="outline" 
        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 h-8 px-2"
        onClick={() => openRejectionDialog(psych.id, psych.profiles?.name || 'Unnamed')}
      >
        <X className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        className="border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700 h-8 px-2"
        onClick={() => approvePsychologist(psych.id, psych.profiles?.name || 'Unnamed')}
      >
        <Check className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        className="h-8 px-2"
        onClick={() => {
          // TODO: Implement view details functionality
          toast({
            title: 'View Details',
            description: `Viewing details for ${psych.profiles?.name || 'Unnamed'}`
          });
        }}
      >
        <Info className="h-4 w-4" />
      </Button>
    </div>
  );
  
  const approvedPsychologistActions = (psych) => (
    <div className="flex justify-end">
      <Button 
        variant="outline" 
        className="h-8 px-2"
        onClick={() => {
          // TODO: Implement view details functionality
          toast({
            title: 'View Details',
            description: `Viewing details for ${psych.profiles?.name || 'Unnamed'}`
          });
        }}
      >
        <Info className="h-4 w-4" />
      </Button>
    </div>
  );
  
  const emptyPendingState = (
    <Card>
      <CardContent className="pt-6 pb-6 flex items-center justify-center">
        <EmptyState message="No pending psychologists found" />
      </CardContent>
    </Card>
  );
  
  const emptyApprovedState = (
    <Card>
      <CardContent className="pt-6 pb-6 flex items-center justify-center">
        <EmptyState message="No approved psychologists found" />
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Psychologists</h1>
          <p className="text-muted-foreground">Manage psychologist applications and approved psychologists</p>
        </div>
      </div>
      
      <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="mt-6">
          <DataTable 
            columns={psychologistColumns} 
            data={pendingPsychologists}
            loading={loading}
            emptyState={emptyPendingState}
            actions={pendingPsychologistActions}
            searchPlaceholder="Search pending psychologists..."
          />
        </TabsContent>
        
        <TabsContent value="approved" className="mt-6">
          <DataTable 
            columns={psychologistColumns} 
            data={approvedPsychologists}
            loading={loading}
            emptyState={emptyApprovedState}
            actions={approvedPsychologistActions}
            searchPlaceholder="Search approved psychologists..."
          />
        </TabsContent>
      </Tabs>
      
      {/* Rejection Dialog */}
      <RejectionDialog 
        isOpen={rejectionDialogOpen}
        onOpenChange={setRejectionDialogOpen}
        psychologistName={psychologistToReject.name}
        rejectionReason={rejectionReason}
        onReasonChange={setRejectionReason}
        onConfirm={handleReject}
      />
    </div>
  );
};

export default AdminPsychologists;
