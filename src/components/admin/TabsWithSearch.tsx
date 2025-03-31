
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface TabsWithSearchProps {
  tabs: { value: string; label: string }[];
  filterOptions?: { value: string; label: string }[];
  onSearch: (searchTerm: string) => void;
  onTabChange: (tab: string) => void;
  onFilterChange?: (filter: string) => void;
  defaultTab?: string;
  searchPlaceholder?: string;
  filterPlaceholder?: string;
  children: React.ReactNode;
}

export const TabsWithSearch: React.FC<TabsWithSearchProps> = ({
  tabs,
  filterOptions,
  onSearch,
  onTabChange,
  onFilterChange,
  defaultTab = 'pending',
  searchPlaceholder = 'Search...',
  filterPlaceholder = 'Filter by',
  children,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue={defaultTab} onValueChange={onTabChange}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="flex w-full sm:w-auto gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-8"
              />
            </div>
            
            {filterOptions && onFilterChange && (
              <Select onValueChange={onFilterChange}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder={filterPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
        
        {children}
      </Tabs>
    </div>
  );
};
