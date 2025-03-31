
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TabsWithSearch } from '@/components/admin/TabsWithSearch';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { School, Building2, Search } from 'lucide-react';

export default function AdminSchools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [filterBy, setFilterBy] = useState('');

  useEffect(() => {
    fetchSchools();
    
    const channel = supabase
      .channel('admin-schools-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'schools' }, 
        () => fetchSchools()
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('schools')
        .select(`
          *,
          districts(name)
        `)
        .order('name');
      
      if (error) throw error;
      
      setSchools(data || []);
    } catch (error) {
      console.error('Error fetching schools:', error);
      toast({
        title: 'Failed to load schools',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredSchools = schools.filter(school => {
    const searchMatch = 
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (school.city && school.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (school.state && school.state.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (school.districts?.name && school.districts.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (activeTab === 'all') return searchMatch;
    
    if (activeTab === 'large') {
      return searchMatch && school.enrollment_size && school.enrollment_size >= 1000;
    }
    
    if (activeTab === 'medium') {
      return searchMatch && school.enrollment_size && school.enrollment_size >= 300 && school.enrollment_size < 1000;
    }
    
    if (activeTab === 'small') {
      return searchMatch && school.enrollment_size && school.enrollment_size < 300;
    }
    
    return searchMatch;
  });

  const tabs = [
    { value: 'all', label: 'All Schools' },
    { value: 'large', label: 'Large (1000+)' },
    { value: 'medium', label: 'Medium (300-999)' },
    { value: 'small', label: 'Small (<300)' },
  ];

  const filterOptions = [
    { value: 'name_asc', label: 'Name (A-Z)' },
    { value: 'name_desc', label: 'Name (Z-A)' },
    { value: 'size_high', label: 'Size (High-Low)' },
    { value: 'size_low', label: 'Size (Low-High)' },
  ];

  const sortSchools = (schools) => {
    switch (filterBy) {
      case 'name_asc':
        return [...schools].sort((a, b) => a.name.localeCompare(b.name));
      case 'name_desc':
        return [...schools].sort((a, b) => b.name.localeCompare(a.name));
      case 'size_high':
        return [...schools].sort((a, b) => (b.enrollment_size || 0) - (a.enrollment_size || 0));
      case 'size_low':
        return [...schools].sort((a, b) => (a.enrollment_size || 0) - (b.enrollment_size || 0));
      default:
        return schools;
    }
  };

  const sortedSchools = sortSchools(filteredSchools);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Schools Management</h1>
        <p className="text-muted-foreground">View and manage all schools in the system</p>
      </div>

      <TabsWithSearch
        tabs={tabs}
        filterOptions={filterOptions}
        onSearch={setSearchTerm}
        onTabChange={setActiveTab}
        onFilterChange={setFilterBy}
        defaultTab="all"
        searchPlaceholder="Search schools..."
        filterPlaceholder="Sort by"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {loading ? (
            <p className="col-span-full text-center py-8">Loading schools...</p>
          ) : sortedSchools.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center text-center py-8">
              <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No Schools Found</h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? `No schools match your search "${searchTerm}"`
                  : 'No schools available in this category'}
              </p>
            </div>
          ) : (
            sortedSchools.map(school => (
              <Card key={school.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <School className="h-5 w-5 text-blue-500" />
                    {school.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium">District</p>
                      <p className="text-sm text-muted-foreground">{school.districts?.name || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">
                        {[
                          school.street,
                          school.city && school.state ? `${school.city}, ${school.state}` : (school.city || school.state),
                          school.zip_code
                        ].filter(Boolean).join(', ') || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Enrollment</p>
                      <div className="flex items-center">
                        <p className="text-sm text-muted-foreground mr-2">
                          {school.enrollment_size ? `${school.enrollment_size} students` : 'Not specified'}
                        </p>
                        {school.enrollment_size && (
                          <Badge variant={
                            school.enrollment_size >= 1000 ? 'default' : 
                            school.enrollment_size >= 300 ? 'secondary' : 
                            'outline'
                          }>
                            {school.enrollment_size >= 1000 ? 'Large' : 
                             school.enrollment_size >= 300 ? 'Medium' : 'Small'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </TabsWithSearch>
    </div>
  );
}
