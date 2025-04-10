
import React from 'react';
import { Button } from '@/components/ui/button';
import { SearchX } from 'lucide-react';

interface NoJobsFoundProps {
  hasFilters: boolean;
  onClearFilters: () => void;
}

export const NoJobsFound: React.FC<NoJobsFoundProps> = ({ hasFilters, onClearFilters }) => {
  return (
    <div className="col-span-full flex justify-center items-center h-64 bg-gray-50 rounded-lg border-2 border-dashed">
      <div className="text-center">
        <SearchX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold">No jobs found</h3>
        <p className="text-muted-foreground">
          {hasFilters 
            ? "Try adjusting your filters or search query" 
            : "There are no open positions matching your criteria at the moment"}
        </p>
        {hasFilters && (
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={onClearFilters}
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};
