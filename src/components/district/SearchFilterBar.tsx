
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
}

interface SearchFilterBarProps {
  placeholder?: string;
  filterOptions?: FilterOption[];
  onSearch: (searchTerm: string) => void;
  onFilter?: (filterValue: string) => void;
  className?: string;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  placeholder = "Search...",
  filterOptions = [],
  onSearch,
  onFilter,
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('');

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
    if (onFilter) {
      onFilter(value);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className={`flex flex-col sm:flex-row gap-2 mb-4 ${className}`}>
      <div className="relative flex-grow">
        <Input
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        {searchTerm && (
          <button 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {filterOptions.length > 0 && (
        <div className="flex items-center min-w-[180px]">
          <Select value={filter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-full">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter..." />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              {filterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <Button 
        onClick={handleSearch}
        size="sm"
        className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90 whitespace-nowrap"
      >
        <Search className="h-4 w-4 mr-2" /> Search
      </Button>
    </div>
  );
};
