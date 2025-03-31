
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Users, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

// Helper function to safely parse JSON strings
const safeJsonParse = (jsonString: string | null, defaultValue: any[] = []): any[] => {
  if (!jsonString) return defaultValue;
  try {
    const parsed = JSON.parse(jsonString);
    return Array.isArray(parsed) ? parsed : defaultValue;
  } catch (err) {
    console.error('Error parsing JSON data:', err);
    return defaultValue;
  }
};

// Helper function to format education display
const formatEducation = (educationData: any): string => {
  if (!educationData) return 'Not specified';
  
  try {
    let education = educationData;
    
    // If it's a string, try to parse it as JSON
    if (typeof educationData === 'string') {
      education = safeJsonParse(educationData);
    }
    
    // If education is an array, format it
    if (Array.isArray(education) && education.length > 0) {
      return education.map(edu => {
        const institution = edu.institution || edu.schoolName || '';
        const degree = edu.degree || '';
        const field = edu.field || edu.major || '';
        
        if (institution && (degree || field)) {
          return `${institution} - ${degree} ${field}`.trim();
        } else if (institution) {
          return institution;
        } else {
          return 'Unspecified education';
        }
      }).join(', ');
    }
    
    return 'Not specified';
  } catch (err) {
    console.error('Error formatting education:', err, educationData);
    return 'Not specified';
  }
};

// Helper function to format experience display
const formatExperience = (experienceData: any): React.ReactNode[] => {
  if (!experienceData) return [<span key="no-exp">Not specified</span>];
  
  try {
    let experiences = experienceData;
    
    // If it's a string, try to parse it as JSON
    if (typeof experienceData === 'string') {
      experiences = safeJsonParse(experienceData);
    }
    
    // If experiences is an array, format it
    if (Array.isArray(experiences) && experiences.length > 0) {
      return experiences.map((exp, index) => {
        const organization = exp.organization || exp.company || '';
        const position = exp.position || exp.title || '';
        const startDate = exp.startDate || '';
        const endDate = exp.current ? 'Present' : (exp.endDate || '');
        
        return (
          <div key={index} className="mb-2 last:mb-0">
            <p className="font-medium">{organization}{position ? ` - ${position}` : ''}</p>
            {(startDate || endDate) && (
              <p className="text-xs">{startDate} to {endDate}</p>
            )}
            {exp.description && <p className="mt-1 text-sm">{exp.description}</p>}
          </div>
        );
      });
    }
    
    return [<span key="no-exp">Not specified</span>];
  } catch (err) {
    console.error('Error formatting experience:', err, experienceData);
    return [<span key="error-exp">Not specified</span>];
  }
};

const AdminPsychologists = () => {
  const { profile } = useAuth();
  const [pendingPsychologists, setPendingPsychologists] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Rejection dialog state
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [psychologistToReject, setPsychologistToReject] = useState({ id: '', name: '' });
  
  useEffect(() => {
    const fetchPendingPsychologists = async () => {
      try {
        setLoading(true);
        
        // First, get all pending psychologists with profile data in a single query
        const { data: pendingPsychologistsData, error } = await supabase
          .from('psychologists')
          .select(`
            *,
            profiles:user_id(
              id, 
              name, 
              email
            )
          `)
          .eq('status', 'pending');
          
        if (error) throw error;
        
        // Transform the data for easier use in the UI
        const transformedData = pendingPsychologistsData.map(psych => {
          return {
            ...psych,
            // Ensure profile data is properly structured
            profiles: {
              name: psych.profiles?.name || 'Unnamed Psychologist',
              email: psych.profiles?.email || 'No email provided',
              id: psych.profiles?.id
            }
          };
        });
        
        console.log('Transformed psychologist data:', transformedData);
        setPendingPsychologists(transformedData || []);
      } catch (error) {
        console.error('Error fetching pending psychologists:', error);
        toast({
          title: 'Failed to load psychologists',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPendingPsychologists();
    
    // Set up realtime subscription for updates
    const channel = supabase
      .channel('admin-psychologists-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'psychologists',
          filter: 'status=eq.pending'
        }, 
        () => {
          fetchPendingPsychologists();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  const approvePsychologist = async (id, name) => {
    try {
      const result = await supabase.rpc('approve_psychologist', { psychologist_id: id });
      
      if (result.error) throw result.error;
      
      // Get psychologist user_id for notification
      const { data: psychData } = await supabase
        .from('psychologists')
        .select('user_id, profiles:user_id(name)')
        .eq('id', id)
        .single();
        
      // Create notification for the user
      if (psychData?.user_id) {
        await supabase.from('notifications').insert({
          user_id: psychData.user_id,
          message: `Your psychologist profile has been approved! You can now apply for jobs and evaluations.`,
          type: 'psychologist_approved',
          related_id: id
        });
      }
      
      toast({
        title: 'Success',
        description: `Psychologist approved successfully`
      });
      
      // Update local state to reflect the approval
      setPendingPsychologists(pendingPsychologists.filter(p => p.id !== id));
      
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
          message: `Your psychologist profile was not approved. Reason: ${rejectionReason}`,
          type: 'psychologist_rejected',
          related_id: psychologistToReject.id
        });
      }
      
      toast({
        title: 'Rejected',
        description: `Psychologist has been rejected`
      });
      
      // Update local state to reflect the rejection
      setPendingPsychologists(pendingPsychologists.filter(p => p.id !== psychologistToReject.id));
      
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
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Psychologist Approvals</h1>
          <p className="text-muted-foreground">Manage psychologist applications</p>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-psyched-darkBlue"></div>
        </div>
      ) : pendingPsychologists.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center text-muted-foreground p-8">
              <Users className="mr-2 h-5 w-5" />
              <span>No pending psychologist approvals</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        pendingPsychologists.map(psych => (
          <Card key={psych.id} className="mb-4">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>{psych.profiles?.name || 'Unnamed Psychologist'}</CardTitle>
                <Badge className="bg-yellow-500">Pending</Badge>
              </div>
              <CardDescription>{psych.profiles?.email || 'No email provided'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Education</p>
                  <p className="text-sm text-muted-foreground">{formatEducation(psych.education)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Experience</p>
                  <p className="text-sm text-muted-foreground">{psych.experience_years ? `${psych.experience_years} years` : 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">
                    {psych.city && psych.state ? `${psych.city}, ${psych.state}` : 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">
                    {psych.phone_number || 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Specialties</p>
                  <p className="text-sm text-muted-foreground">
                    {psych.specialties?.length ? psych.specialties.join(', ') : 'None specified'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Certifications</p>
                  <p className="text-sm text-muted-foreground">
                    {psych.certifications?.length ? psych.certifications.join(', ') : 'None specified'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Work Types</p>
                  <p className="text-sm text-muted-foreground">
                    {psych.work_types?.length ? psych.work_types.join(', ') : 'None specified'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Evaluation Types</p>
                  <p className="text-sm text-muted-foreground">
                    {psych.evaluation_types?.length ? psych.evaluation_types.join(', ') : 'None specified'}
                  </p>
                </div>
              </div>
              
              {psych.experience && (
                <div className="mt-4">
                  <p className="text-sm font-medium">Experience Details</p>
                  <div className="text-sm text-muted-foreground mt-1 border rounded-md p-3 bg-gray-50">
                    {formatExperience(psych.experience)}
                  </div>
                </div>
              )}
              
              {psych.certification_details && Object.keys(typeof psych.certification_details === 'object' ? psych.certification_details : {}).length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium">Certification Details</p>
                  <div className="border rounded-md p-2 bg-gray-50 mt-1">
                    {Object.entries(typeof psych.certification_details === 'object' ? psych.certification_details : {}).map(([key, value], i) => (
                      <div key={i} className="mb-2">
                        <p className="text-xs font-medium">{key}</p>
                        <p className="text-sm">{typeof value === 'string' ? value : JSON.stringify(value)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-6 flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => openRejectionDialog(psych.id, psych.profiles?.name || 'Unnamed Psychologist')}
                >
                  <X className="mr-1 h-4 w-4" />
                  Reject
                </Button>
                <Button 
                  onClick={() => approvePsychologist(psych.id, psych.profiles?.name || 'Unnamed Psychologist')}
                >
                  <Check className="mr-1 h-4 w-4" />
                  Approve Psychologist
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
      
      {/* Rejection Dialog */}
      <AlertDialog open={rejectionDialogOpen} onOpenChange={setRejectionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Psychologist</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting "{psychologistToReject.name}". This will be shared with the user.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Textarea 
              placeholder="Enter rejection reason..." 
              value={rejectionReason} 
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPsychologists;
