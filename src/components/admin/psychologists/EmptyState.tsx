
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';

const EmptyState = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-center text-muted-foreground p-8">
          <Users className="mr-2 h-5 w-5" />
          <span>No pending psychologist approvals</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
