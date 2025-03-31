
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Edit, Trash } from 'lucide-react';
import { School } from '@/services/schoolService';

interface SchoolCardProps {
  school: School;
  onEdit: (school: School) => void;
  onDelete: (school: School) => void;
}

export const SchoolCard: React.FC<SchoolCardProps> = ({ school, onEdit, onDelete }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>{school.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 pb-2">
        {(school.city || school.state) && (
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            <span>
              {[
                school.street,
                school.city,
                school.state,
                school.zip_code
              ].filter(Boolean).join(', ')}
            </span>
          </div>
        )}
        
        {school.enrollment_size && (
          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 mr-2 text-gray-500" />
            <span>{school.enrollment_size.toLocaleString()} students</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onEdit(school)}
        >
          <Edit className="h-3.5 w-3.5 mr-1" /> Edit
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onDelete(school)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash className="h-3.5 w-3.5 mr-1" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
};
