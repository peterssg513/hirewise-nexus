
import React from 'react';
import { Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
}

export const FilterSelect: React.FC<FilterSelectProps> = ({
  value,
  onChange,
  options,
}) => {
  return (
    <div className="flex items-center min-w-[180px]">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter..." />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
