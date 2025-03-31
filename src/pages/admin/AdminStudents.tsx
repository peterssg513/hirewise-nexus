
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsWithSearch } from '@/components/admin/TabsWithSearch';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { GraduationCap, UserRound, Search } from 'lucide-react';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [filterBy, setFilterBy] = useState('');

  useEffect(() => {
    fetchStudents();
    
    const channel = supabase
      .channel('admin-students-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'students' }, 
        () => fetchStudents()
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          districts(name),
          schools(name)
        `)
        .order('last_name');
      
      if (error) throw error;
      
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: 'Failed to load students',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
    
    const searchMatch = 
      fullName.includes(searchTerm.toLowerCase()) ||
      (student.grade && student.grade.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.schools?.name && student.schools.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.districts?.name && student.districts.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (activeTab === 'all') return searchMatch;
    
    // Example tabs - adjust based on your actual data and requirements
    if (activeTab === 'elementary') {
      const elementaryGrades = ['k', 'kindergarten', '1', '2', '3', '4', '5'];
      return searchMatch && student.grade && elementaryGrades.includes(student.grade.toLowerCase());
    }
    
    if (activeTab === 'middle') {
      const middleGrades = ['6', '7', '8'];
      return searchMatch && student.grade && middleGrades.includes(student.grade.toLowerCase());
    }
    
    if (activeTab === 'high') {
      const highGrades = ['9', '10', '11', '12'];
      return searchMatch && student.grade && highGrades.includes(student.grade.toLowerCase());
    }
    
    return searchMatch;
  });

  const tabs = [
    { value: 'all', label: 'All Students' },
    { value: 'elementary', label: 'Elementary (K-5)' },
    { value: 'middle', label: 'Middle (6-8)' },
    { value: 'high', label: 'High School (9-12)' },
  ];

  const filterOptions = [
    { value: 'name_asc', label: 'Name (A-Z)' },
    { value: 'name_desc', label: 'Name (Z-A)' },
    { value: 'grade_asc', label: 'Grade (Low-High)' },
    { value: 'grade_desc', label: 'Grade (High-Low)' },
  ];

  const getGradeValue = (grade) => {
    if (!grade) return -1;
    if (grade.toLowerCase() === 'k' || grade.toLowerCase() === 'kindergarten') return 0;
    const num = parseInt(grade);
    return isNaN(num) ? -1 : num;
  };

  const sortStudents = (students) => {
    switch (filterBy) {
      case 'name_asc':
        return [...students].sort((a, b) => 
          `${a.last_name} ${a.first_name}`.localeCompare(`${b.last_name} ${b.first_name}`)
        );
      case 'name_desc':
        return [...students].sort((a, b) => 
          `${b.last_name} ${b.first_name}`.localeCompare(`${a.last_name} ${a.first_name}`)
        );
      case 'grade_asc':
        return [...students].sort((a, b) => getGradeValue(a.grade) - getGradeValue(b.grade));
      case 'grade_desc':
        return [...students].sort((a, b) => getGradeValue(b.grade) - getGradeValue(a.grade));
      default:
        return students;
    }
  };

  const sortedStudents = sortStudents(filteredStudents);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Students Management</h1>
        <p className="text-muted-foreground">View and manage all students in the system</p>
      </div>

      <TabsWithSearch
        tabs={tabs}
        filterOptions={filterOptions}
        onSearch={setSearchTerm}
        onTabChange={setActiveTab}
        onFilterChange={setFilterBy}
        defaultTab="all"
        searchPlaceholder="Search students..."
        filterPlaceholder="Sort by"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {loading ? (
            <p className="col-span-full text-center py-8">Loading students...</p>
          ) : sortedStudents.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center text-center py-8">
              <UserRound className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No Students Found</h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? `No students match your search "${searchTerm}"`
                  : 'No students available in this category'}
              </p>
            </div>
          ) : (
            sortedStudents.map(student => (
              <Card key={student.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <UserRound className="h-5 w-5 text-blue-500" />
                    {student.first_name} {student.last_name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">Grade</p>
                        <p className="text-sm text-muted-foreground">{student.grade || 'Not specified'}</p>
                      </div>
                      {student.grade && (
                        <Badge variant="outline">
                          {getGradeValue(student.grade) <= 5 ? 'Elementary' : 
                           getGradeValue(student.grade) <= 8 ? 'Middle' : 'High School'}
                        </Badge>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">School</p>
                      <p className="text-sm text-muted-foreground">{student.schools?.name || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">District</p>
                      <p className="text-sm text-muted-foreground">{student.districts?.name || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Teacher</p>
                      <p className="text-sm text-muted-foreground">{student.current_teacher || 'Not specified'}</p>
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
