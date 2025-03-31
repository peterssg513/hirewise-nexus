
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, ShieldCheck } from 'lucide-react';

interface District {
  id: string;
  name: string;
  contact_email?: string;
  contact_phone?: string;
  location?: string;
  description?: string;
  state?: string;
  job_title?: string;
  website?: string;
  district_size?: number;
  profile_name?: string;
  profile_email?: string;
  profiles?: {
    email?: string;
  };
}

interface DistrictsTabProps {
  loading: boolean;
  pendingDistricts: District[];
  onApprove: (type: string, id: string, name: string) => void;
  onReject: (type: string, id: string, name: string) => void;
}

export const DistrictsTab: React.FC<DistrictsTabProps> = ({
  loading,
  pendingDistricts,
  onApprove,
  onReject
}) => {
  if (loading) {
    return <p>Loading pending districts...</p>;
  }

  if (pendingDistricts.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center text-muted-foreground">
            <ShieldCheck className="mr-2 h-5 w-5" />
            <span>No pending district approvals</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {pendingDistricts.map(district => (
        <Card key={district.id} className="mb-4">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>{district.name}</CardTitle>
              <Badge className="bg-yellow-500">Pending</Badge>
            </div>
            <CardDescription>{district.profile_email || district.profiles?.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-muted-foreground">{district.location || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Contact</p>
                <p className="text-sm text-muted-foreground">{district.contact_phone || 'No phone provided'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">State</p>
                <p className="text-sm text-muted-foreground">{district.state || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Size</p>
                <p className="text-sm text-muted-foreground">{district.district_size ? `${district.district_size} students` : 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Website</p>
                <p className="text-sm text-muted-foreground">
                  {district.website ? (
                    <a href={district.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {district.website}
                    </a>
                  ) : 'Not provided'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Job Title</p>
                <p className="text-sm text-muted-foreground">{district.job_title || 'Not specified'}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium">Description</p>
              <p className="text-sm text-muted-foreground">{district.description || 'No description provided'}</p>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <Button 
                variant="outline" 
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => onReject('district', district.id, district.name)}
              >
                <X className="mr-1 h-4 w-4" />
                Reject
              </Button>
              <Button 
                onClick={() => onApprove('district', district.id, district.name)}
              >
                <Check className="mr-1 h-4 w-4" />
                Approve District
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};
