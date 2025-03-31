
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

interface ApprovedDistrictCardProps {
  district: any;
}

const ApprovedDistrictCard: React.FC<ApprovedDistrictCardProps> = ({ 
  district
}) => {
  return (
    <Card key={district.id} className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{district.name || 'Unnamed District'}</CardTitle>
            <CardDescription>{district.profile?.email || district.contact_email || 'No email provided'}</CardDescription>
          </div>
          <Badge className="bg-green-500">Approved</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Location</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" /> 
              {district.location || district.state || 'Not specified'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Contact</p>
            <p className="text-sm text-muted-foreground">
              {district.first_name && district.last_name 
                ? `${district.first_name} ${district.last_name}` 
                : 'Not specified'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Job Title</p>
            <p className="text-sm text-muted-foreground">
              {district.job_title || 'Not specified'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Contact Phone</p>
            <p className="text-sm text-muted-foreground">
              {district.contact_phone || 'Not provided'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Website</p>
            <p className="text-sm text-muted-foreground">
              {district.website 
                ? <a href={district.website.startsWith('http') ? district.website : `https://${district.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-500 hover:underline">
                    {district.website}
                  </a> 
                : 'None specified'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">District Size</p>
            <p className="text-sm text-muted-foreground">
              {district.district_size ? `${district.district_size} students` : 'Not specified'}
            </p>
          </div>
        </div>
        
        {district.description && (
          <div className="mt-4">
            <p className="text-sm font-medium">Description</p>
            <p className="text-sm text-muted-foreground mt-1 border rounded-md p-3 bg-gray-50">
              {district.description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApprovedDistrictCard;
