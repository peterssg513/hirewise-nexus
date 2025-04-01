
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { SearchInput } from './SearchInput';
import { FilterSelect } from './FilterSelect';

export interface FilterOption {
  value: string;
  label: string;
}

export interface SearchFilterBarProps {
  placeholder?: string;
  filterOptions?: FilterOption[];
  onSearch: (searchTerm: string) => void;
  onFilter?: (filterValue: string) => void;
  initialFilterValue?: string;
  initialSearchTerm?: string;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  placeholder = "Search...",
  filterOptions = [],
  onSearch,
  onFilter,
  initialFilterValue = "all",
  initialSearchTerm = "",
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [filterValue, setFilterValue] = useState(initialFilterValue);

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleFilterChange = (value: string) => {
    setFilterValue(value);
    if (onFilter) {
      onFilter(value);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
      <div className="flex-1 w-full">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          onSearch={handleSearch}
          placeholder={placeholder}
        />
      </div>
      
      {filterOptions.length > 0 && onFilter && (
        <FilterSelect
          value={filterValue}
          onChange={handleFilterChange}
          options={filterOptions}
        />
      )}
    </div>
  );
};
