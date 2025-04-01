
import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from '@/components/ui/select';

interface FilterOption {
  value: string;
  label: string;
}

interface SearchFilterBarProps {
  placeholder?: string;
  onSearch: (searchTerm: string) => void;
  onFilter: (filterValue: string) => void;
  filterOptions?: FilterOption[];
  filterPlaceholder?: string;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  placeholder = 'Search...',
  onSearch,
  onFilter,
  filterOptions = [],
  filterPlaceholder = 'Filter'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilter = (value: string) => {
    setFilterValue(value);
    onFilter(value);
  };

  const handleClear = () => {
    setSearchTerm('');
    setFilterValue('');
    onSearch('');
    onFilter('all');
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          className="pl-10 w-full"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      
      {filterOptions.length > 0 && (
        <div className="sm:w-[200px]">
          <Select 
            value={filterValue} 
            onValueChange={handleFilter}
          >
            <SelectTrigger>
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
        </div>
      )}
      
      {(searchTerm || filterValue) && (
        <Button variant="ghost" onClick={handleClear} className="px-3">
          Clear
        </Button>
      )}
    </div>
  );
};
