
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { SearchInput } from './SearchInput';
import { FilterSelect } from './FilterSelect';

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
      <SearchInput
        placeholder={placeholder}
        value={searchTerm}
        onChange={setSearchTerm}
        onSearch={handleSearch}
      />

      {filterOptions.length > 0 && (
        <FilterSelect
          value={filter}
          onChange={handleFilterChange}
          options={filterOptions}
        />
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
