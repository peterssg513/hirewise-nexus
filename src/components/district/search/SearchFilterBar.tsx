
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
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  placeholder = "Search...",
  filterOptions = [],
  onSearch,
  onFilter,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("all");

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
