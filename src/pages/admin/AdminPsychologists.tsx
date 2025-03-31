
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Check, X, MapPin, Phone, Mail, Award, GraduationCap, Briefcase, Calendar, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { TabsContent } from '@/components/ui/tabs';
import { TabsWithSearch } from '@/components/admin/TabsWithSearch';
import { Separator } from '@/components/ui/separator';

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
const formatEducation = (educationData: any): React.ReactNode[] => {
  if (!educationData) return [<span key="no-edu">Not specified</span>];
  
  try {
    let education = educationData;
    
    // If it's a string, try to parse it as JSON
    if (typeof educationData === 'string') {
      education = safeJsonParse(educationData);
    }
    
    // If education is an array, format it
    if (Array.isArray(education) && education.length > 0) {
      return education.map((edu, index) => {
        const institution = edu.institution || edu.schoolName || '';
        const degree = edu.degree || '';
        const field = edu.field || edu.major || '';
        const startDate = edu.startDate || '';
        const endDate = edu.endDate || '';
        
        return (
          <div key={index} className="mb-2 last:mb-0">
            <p className="font-medium">{institution}</p>
            {degree && field && <p className="text-sm">{degree} in {field}</p>}
            {(startDate || endDate) && (
              <p className="text-xs text-gray-500">{startDate} to {endDate}</p>
            )}
          </div>
        );
      });
    }
    
    return [<span key="no-edu">Not specified</span>];
  } catch (err) {
    console.error('Error formatting education:', err, educationData);
    return [<span key="error-edu">Not specified</span>];
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
              <p className="text-xs text-gray-500">{startDate} to {endDate}</p>
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

// Format certifications display
const formatCertifications = (certificationsData: any): React.ReactNode[] => {
  if (!certificationsData) return [<span key="no-cert">Not specified</span>];
  
  try {
    let certifications = certificationsData;
    
    // If it's a string or array of URLs, convert to basic object format
    if (typeof certificationsData === 'string') {
      certifications = safeJsonParse(certificationsData);
    } else if (Array.isArray(certificationsData) && certificationsData.length > 0 && typeof certificationsData[0] === 'string') {
      // If it's just an array of URLs, convert to objects
      certifications = certificationsData.map(url => ({ name: 'Certification', url }));
    }
    
    // If certification_details exists and is more detailed, use that instead
    
    // If certifications is an array, format it
    if (Array.isArray(certifications) && certifications.length > 0) {
      return certifications.map((cert, index) => {
        // Handle both simple string entries and detailed objects
        if (typeof cert === 'string') {
          return (
            <div key={index} className="mb-2 last:mb-0">
              <p className="font-medium">Certification</p>
              <p className="text-sm text-gray-500">{cert}</p>
            </div>
          );
        }
        
        const name = cert.name || cert.certificationName || 'Certification';
        const issuer = cert.issuer || cert.issuingAuthority || '';
        const date = cert.date || cert.startYear || '';
        const expiry = cert.expirationDate || cert.endYear || '';
        
        return (
          <div key={index} className="mb-2 last:mb-0">
            <p className="font-medium">{name}</p>
            {issuer && <p className="text-sm">Issued by {issuer}</p>}
            {(date || expiry) && (
              <p className="text-xs text-gray-500">
                {date && `Valid from ${date}`} 
                {date && expiry && ' to '} 
                {expiry && expiry}
              </p>
            )}
          </div>
        );
      });
    }
    
    return [<span key="no-cert">Not specified</span>];
  } catch (err) {
    console.error('Error formatting certifications:', err, certificationsData);
    return [<span key="error-cert">Not specified</span>];
  }
};

// Format certification details display (more comprehensive format)
const formatCertificationDetails = (certificationDetails: any): React.ReactNode[] => {
  if (!certificationDetails) return [<span key="no-cert-details">Not specified</span>];
  
  try {
    let details = certificationDetails;
    
    // If it's a string, try to parse it as JSON
    if (typeof certificationDetails === 'string') {
      details = safeJsonParse(certificationDetails);
    }
    
    // If details is an array, format it (this is the more detailed format)
    if (Array.isArray(details) && details.length > 0) {
      return details.map((cert, index) => {
        const name = cert.name || 'Certification';
        const issuer = cert.issuer || cert.issuingAuthority || '';
        const startYear = cert.startYear || cert.date || '';
        const endYear = cert.endYear || cert.expirationDate || '';
        
        return (
          <div key={index} className="mb-2 last:mb-0">
            <p className="font-medium">{name}</p>
            {issuer && <p className="text-sm">Issued by {issuer}</p>}
            {(startYear || endYear) && (
              <p className="text-xs text-gray-500">
                {startYear && `From ${startYear}`} 
                {startYear && endYear && ' to '} 
                {endYear && endYear}
              </p>
            )}
            {cert.status && (
              <Badge variant={cert.status === 'verified' ? 'secondary' : 'outline'} className="mt-1">
                {cert.status === 'verified' ? 'Verified' : 'Pending verification'}
              </Badge>
            )}
          </div>
        );
      });
    }
    
    return [<span key="no-cert-details">Not specified</span>];
  } catch (err) {
    console.error('Error formatting certification details:', err, certificationDetails);
    return [<span key="error-cert-details">Not specified</span>];
  }
};

const AdminPsychologists = () => {
  const { profile } = useAuth();
  const [pendingPsychologists, setPendingPsychologists] = useState([]);
  const [approvedPsychologists, setApprovedPsychologists] = useState([]);
  const [rejectedPsychologists, setRejectedPsychologists] = useState([]);
  const [filteredPsychologists, setFilteredPsychologists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [filterBy, setFilterBy] = useState('');
  
  // Rejection dialog state
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [psychologistToReject, setPsychologistToReject] = useState({ id: '', name: '' });
  
  // Detailed view state
  const [detailViewOpen, setDetailViewOpen] = useState(false);
  const [selectedPsychologist, setSelectedPsychologist] = useState(null);
  
  useEffect(() => {
    fetchPsychologists();
    
    // Set up realtime subscription for updates
    const channel = supabase
      .channel('admin-psychologists-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'psychologists'
        }, 
        () => {
          fetchPsychologists();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  useEffect(() => {
    // Set filtered psychologists based on active tab
    switch (activeTab) {
      case 'pending':
        setFilteredPsychologists(pendingPsychologists);
        break;
      case 'approved':
        setFilteredPsychologists(approvedPsychologists);
        break;
      case 'rejected':
        setFilteredPsychologists(rejectedPsychologists);
        break;
      default:
        setFilteredPsychologists(pendingPsychologists);
    }
  }, [activeTab, pendingPsychologists, approvedPsychologists, rejectedPsychologists]);
  
  const fetchPsychologists = async () => {
    try {
      setLoading(true);
      
      // First, fetch all psychologists with extended profile data
      const { data: psychologists, error: psychError } = await supabase
        .from('psychologists')
        .select(`
          *,
          profiles:user_id (
            name, 
            email, 
            id
          )
        `);
        
      if (psychError) throw psychError;
      
      console.log("Fetched psychologists data:", psychologists);
      
      // Split psychologists by status
      const pending = psychologists.filter(p => p.status === 'pending') || [];
      const approved = psychologists.filter(p => p.status === 'approved') || [];
      const rejected = psychologists.filter(p => p.status === 'rejected') || [];
      
      setPendingPsychologists(pending);
      setApprovedPsychologists(approved);
      setRejectedPsychologists(rejected);
      setFilteredPsychologists(pending);
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
      
      // Refresh data
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
      
      // Refresh data
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
  
  const handleViewDetails = (psychologist) => {
    setSelectedPsychologist(psychologist);
    setDetailViewOpen(true);
  };
  
  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      // Reset to the current tab's full data
      switch (activeTab) {
        case 'pending':
          setFilteredPsychologists(pendingPsychologists);
          break;
        case 'approved':
          setFilteredPsychologists(approvedPsychologists);
          break;
        case 'rejected':
          setFilteredPsychologists(rejectedPsychologists);
          break;
      }
      return;
    }
    
    // Get the current tab's data
    let dataToFilter;
    switch (activeTab) {
      case 'pending':
        dataToFilter = pendingPsychologists;
        break;
      case 'approved':
        dataToFilter = approvedPsychologists;
        break;
      case 'rejected':
        dataToFilter = rejectedPsychologists;
        break;
      default:
        dataToFilter = pendingPsychologists;
    }
    
    // Filter based on search term
    const search = searchTerm.toLowerCase();
    const filtered = dataToFilter.filter(psych => 
      psych.profiles?.name?.toLowerCase().includes(search) ||
      psych.profiles?.email?.toLowerCase().includes(search) ||
      psych.city?.toLowerCase().includes(search) ||
      psych.state?.toLowerCase().includes(search) ||
      (psych.specialties && psych.specialties.some(s => s.toLowerCase().includes(search)))
    );
    
    setFilteredPsychologists(filtered);
  };
  
  const handleFilterChange = (value: string) => {
    setFilterBy(value);
    
    // Get the current tab's data
    let dataToFilter;
    switch (activeTab) {
      case 'pending':
        dataToFilter = pendingPsychologists;
        break;
      case 'approved':
        dataToFilter = approvedPsychologists;
        break;
      case 'rejected':
        dataToFilter = rejectedPsychologists;
        break;
      default:
        dataToFilter = pendingPsychologists;
    }
    
    // Apply filter based on selected value
    if (value === 'all' || !value) {
      setFilteredPsychologists(dataToFilter);
    } else if (value === 'state') {
      // Group by state, we can improve this later
      const filtered = dataToFilter.filter(p => p.state);
      setFilteredPsychologists(filtered);
    } else if (value === 'specialties') {
      // Has specialties defined
      const filtered = dataToFilter.filter(p => p.specialties && p.specialties.length > 0);
      setFilteredPsychologists(filtered);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  const getInitials = (name: string) => {
    if (!name) return "?";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Psychologist Approvals</h1>
          <p className="text-muted-foreground">Manage psychologist applications</p>
        </div>
      </div>
      
      <TabsWithSearch
        tabs={[
          { value: 'pending', label: 'Pending' },
          { value: 'approved', label: 'Approved' },
          { value: 'rejected', label: 'Rejected' }
        ]}
        filterOptions={[
          { value: 'all', label: 'All' },
          { value: 'state', label: 'By State' },
          { value: 'specialties', label: 'By Specialties' }
        ]}
        onSearch={handleSearch}
        onTabChange={setActiveTab}
        onFilterChange={handleFilterChange}
        searchPlaceholder="Search psychologists..."
        filterPlaceholder="Filter by"
      >
        <TabsContent value="pending" className="space-y-4">
          {renderPsychologistsList(pendingPsychologists, filteredPsychologists, loading, activeTab)}
        </TabsContent>
        
        <TabsContent value="approved" className="space-y-4">
          {renderPsychologistsList(approvedPsychologists, filteredPsychologists, loading, activeTab)}
        </TabsContent>
        
        <TabsContent value="rejected" className="space-y-4">
          {renderPsychologistsList(rejectedPsychologists, filteredPsychologists, loading, activeTab)}
        </TabsContent>
      </TabsWithSearch>
      
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
      
      {/* Detailed View Dialog */}
      <AlertDialog open={detailViewOpen} onOpenChange={setDetailViewOpen}>
        <AlertDialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedPsychologist && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-2">
                      <AvatarImage 
                        src={selectedPsychologist.profile_picture_url} 
                        alt={selectedPsychologist.profiles?.name || 'Psychologist'} 
                      />
                      <AvatarFallback>
                        {getInitials(selectedPsychologist.profiles?.name || 'PS')}
                      </AvatarFallback>
                    </Avatar>
                    <span>{selectedPsychologist.profiles?.name || 'Unnamed Psychologist'}</span>
                  </div>
                  <div className="ml-auto">
                    {getStatusBadge(selectedPsychologist.status)}
                  </div>
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Complete profile details
                </AlertDialogDescription>
              </AlertDialogHeader>
              
              <div className="py-4 space-y-6">
                {/* Basic Info Section */}
                <div>
                  <h3 className="text-lg font-medium mb-2">Contact Information</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{selectedPsychologist.profiles?.email || 'No email provided'}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{selectedPsychologist.phone_number || 'No phone provided'}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <span>
                        {selectedPsychologist.city && selectedPsychologist.state ? 
                          `${selectedPsychologist.city}, ${selectedPsychologist.state}` : 
                          'No location provided'}
                      </span>
                    </div>
                    {selectedPsychologist.zip_code && (
                      <div className="flex items-start">
                        <span className="text-sm">ZIP: {selectedPsychologist.zip_code}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                {/* Specialties & Experience */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center">
                      <Award className="h-4 w-4 mr-2 text-yellow-500" />
                      Specialties
                    </h3>
                    <div className="space-y-1">
                      {selectedPsychologist.specialties && selectedPsychologist.specialties.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {selectedPsychologist.specialties.map((specialty, i) => (
                            <Badge key={i} variant="outline" className="font-normal">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No specialties specified</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                      Experience
                    </h3>
                    <div className="space-y-1">
                      <p className="text-sm">
                        {selectedPsychologist.experience_years ? 
                          `${selectedPsychologist.experience_years} years of experience` : 
                          'Experience not specified'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Education Section */}
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <GraduationCap className="h-4 w-4 mr-2 text-green-500" />
                    Education
                  </h3>
                  <div className="rounded-md border p-3 bg-gray-50">
                    {formatEducation(selectedPsychologist.education)}
                  </div>
                </div>
                
                {/* Experience Section */}
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-indigo-500" />
                    Professional Experience
                  </h3>
                  <div className="rounded-md border p-3 bg-gray-50">
                    {formatExperience(selectedPsychologist.experience)}
                  </div>
                </div>
                
                {/* Certifications Section */}
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <Award className="h-4 w-4 mr-2 text-amber-500" />
                    Certifications
                  </h3>
                  <div className="rounded-md border p-3 bg-gray-50">
                    {selectedPsychologist.certification_details ? 
                      formatCertificationDetails(selectedPsychologist.certification_details) : 
                      formatCertifications(selectedPsychologist.certifications)}
                  </div>
                </div>
                
                <Separator />
                
                {/* Preferences Section */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium mb-1">Desired Locations</h4>
                    {selectedPsychologist.desired_locations && selectedPsychologist.desired_locations.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(selectedPsychologist.desired_locations) ? 
                          selectedPsychologist.desired_locations.map((loc, i) => (
                            <Badge key={i} variant="outline" className="font-normal">
                              {loc}
                            </Badge>
                          )) : 
                          <p className="text-sm text-gray-500">No locations specified</p>
                        }
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No locations specified</p>
                    )}
                    <p className="text-xs mt-1">
                      {selectedPsychologist.open_to_relocation ? 
                        "Open to relocation" : 
                        "Not open to relocation"}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Work Types</h4>
                    {selectedPsychologist.work_types && selectedPsychologist.work_types.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(selectedPsychologist.work_types) ? 
                          selectedPsychologist.work_types.map((type, i) => (
                            <Badge key={i} variant="outline" className="font-normal">
                              {type}
                            </Badge>
                          )) : 
                          <p className="text-sm text-gray-500">No work types specified</p>
                        }
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No work types specified</p>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Evaluation Types</h4>
                    {selectedPsychologist.evaluation_types && selectedPsychologist.evaluation_types.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(selectedPsychologist.evaluation_types) ? 
                          selectedPsychologist.evaluation_types.map((type, i) => (
                            <Badge key={i} variant="outline" className="font-normal">
                              {type}
                            </Badge>
                          )) : 
                          <p className="text-sm text-gray-500">No evaluation types specified</p>
                        }
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No evaluation types specified</p>
                    )}
                  </div>
                </div>
              </div>
              
              <AlertDialogFooter>
                {selectedPsychologist.status === 'pending' && (
                  <div className="flex w-full justify-between">
                    <Button 
                      variant="outline" 
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => {
                        setDetailViewOpen(false);
                        openRejectionDialog(selectedPsychologist.id, selectedPsychologist.profiles?.name || 'Unnamed Psychologist');
                      }}
                    >
                      <X className="mr-1 h-4 w-4" />
                      Reject
                    </Button>
                    <div className="flex gap-2">
                      <AlertDialogCancel>Close</AlertDialogCancel>
                      <Button 
                        onClick={() => {
                          setDetailViewOpen(false);
                          approvePsychologist(
                            selectedPsychologist.id, 
                            selectedPsychologist.profiles?.name || 'Unnamed Psychologist'
                          );
                        }}
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Approve Psychologist
                      </Button>
                    </div>
                  </div>
                )}
                {selectedPsychologist.status !== 'pending' && (
                  <AlertDialogCancel>Close</AlertDialogCancel>
                )}
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
  
  function renderPsychologistsList(sourceData, filteredData, isLoading, tab) {
    if (isLoading) {
      return (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-psyched-darkBlue"></div>
        </div>
      );
    }
    
    if (sourceData.length === 0) {
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center text-muted-foreground p-8">
              <Users className="mr-2 h-5 w-5" />
              <span>No {tab} psychologist approvals</span>
            </div>
          </CardContent>
        </Card>
      );
    }
    
    if (filteredData.length === 0 && tab === activeTab) {
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center text-muted-foreground p-8">
              <Users className="mr-2 h-5 w-5" />
              <span>No matching psychologists found</span>
            </div>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <>
        {filteredData.map(psych => (
          <Card key={psych.id} className="mb-4">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage 
                      src={psych.profile_picture_url} 
                      alt={psych.profiles?.name || 'Psychologist'} 
                    />
                    <AvatarFallback>
                      {getInitials(psych.profiles?.name || 'PS')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{psych.profiles?.name || 'Unnamed Psychologist'}</CardTitle>
                    <CardDescription>{psych.profiles?.email || 'No email provided'}</CardDescription>
                  </div>
                </div>
                {getStatusBadge(psych.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
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
                  <p className="text-sm font-medium">Experience</p>
                  <p className="text-sm text-muted-foreground">{psych.experience_years ? `${psych.experience_years} years` : 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Education</p>
                  <p className="text-sm text-muted-foreground truncate max-w-xs">
                    {typeof psych.education === 'string' && psych.education.length > 50 
                      ? psych.education.substring(0, 50) + '...' 
                      : Array.isArray(psych.education) && psych.education.length > 0 
                        ? `${psych.education.length} education entries` 
                        : 'Not specified'}
                  </p>
                </div>
              </div>
              
              {psych.specialties && psych.specialties.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-1">Specialties</p>
                  <div className="flex flex-wrap gap-1">
                    {psych.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-6 flex justify-between items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                  onClick={() => handleViewDetails(psych)}
                >
                  <FileText className="mr-1 h-4 w-4" />
                  View Full Profile
                </Button>
                
                {psych.status === 'pending' && (
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => openRejectionDialog(psych.id, psych.profiles?.name || 'Unnamed Psychologist')}
                    >
                      <X className="mr-1 h-4 w-4" />
                      Reject
                    </Button>
                    <Button onClick={() => approvePsychologist(psych.id, psych.profiles?.name || 'Unnamed Psychologist')}>
                      <Check className="mr-1 h-4 w-4" />
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </>
    );
  }
};

export default AdminPsychologists;
