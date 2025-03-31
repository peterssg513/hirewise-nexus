
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, School, Users, FileText } from 'lucide-react';

interface DistrictNavigationProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const DistrictNavigation: React.FC<DistrictNavigationProps> = ({ 
  activeTab, 
  onTabChange 
}) => {
  return (
    <Tabs defaultValue={activeTab} value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="bg-white mb-4 w-full justify-start">
        <TabsTrigger value="overview" className="text-sm flex items-center gap-1.5">
          Overview
        </TabsTrigger>
        <TabsTrigger value="jobs" className="text-sm flex items-center gap-1.5">
          <Briefcase className="h-4 w-4" />
          Jobs
        </TabsTrigger>
        <TabsTrigger value="schools" className="text-sm flex items-center gap-1.5">
          <School className="h-4 w-4" />
          Schools
        </TabsTrigger>
        <TabsTrigger value="students" className="text-sm flex items-center gap-1.5">
          <Users className="h-4 w-4" />
          Students
        </TabsTrigger>
        <TabsTrigger value="evaluations" className="text-sm flex items-center gap-1.5">
          <FileText className="h-4 w-4" />
          Evaluations
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
