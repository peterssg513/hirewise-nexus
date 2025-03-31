
import React from 'react';
import { Search } from 'lucide-react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';

interface Column {
  key: string;
  header: string;
  cell?: (item: any) => React.ReactNode;
  width?: string;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (term: string) => void;
  loading?: boolean;
  emptyState?: React.ReactNode;
  actions?: (item: any) => React.ReactNode;
  className?: string;
}

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  searchable = true,
  searchPlaceholder = "Search...",
  onSearch,
  loading = false,
  emptyState,
  actions,
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (onSearch) {
      onSearch(term);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-psyched-darkBlue"></div>
      </div>
    );
  }

  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {searchable && (
        <div className="relative">
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>
      )}
      
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} style={{ width: column.width || 'auto' }}>
                  {column.header}
                </TableHead>
              ))}
              {actions && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, i) => (
              <TableRow key={item.id || i}>
                {columns.map((column) => (
                  <TableCell key={`${item.id || i}-${column.key}`}>
                    {column.cell ? column.cell(item) : item[column.key]}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell className="text-right">
                    {actions(item)}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
