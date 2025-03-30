
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Briefcase, FileSpreadsheet, Check } from 'lucide-react';

interface ProfilePreferencesProps {
  desiredLocations?: string[];
  workTypes?: string[];
  evaluationTypes?: string[];
  openToRelocation?: boolean;
}

const ProfilePreferences = ({
  desiredLocations = [],
  workTypes = [],
  evaluationTypes = [],
  openToRelocation = false
}: ProfilePreferencesProps) => {
  return (
    <div className="space-y-4 w-full">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-psyched-darkBlue" />
            Desired Locations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {desiredLocations.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {desiredLocations.map((location, index) => (
                <Badge key={index} variant="outline" className="bg-psyched-cream/50">
                  {location}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No locations specified</p>
          )}
          
          {openToRelocation && (
            <div className="mt-2 flex items-center text-sm text-psyched-darkBlue">
              <Check className="h-4 w-4 mr-1" />
              Open to Relocation
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <Briefcase className="h-5 w-5 mr-2 text-psyched-darkBlue" />
            Work Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          {workTypes.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {workTypes.map((type, index) => (
                <Badge key={index} variant="outline" className="bg-psyched-cream/50">
                  {type}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No work types specified</p>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <FileSpreadsheet className="h-5 w-5 mr-2 text-psyched-darkBlue" />
            Evaluation Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          {evaluationTypes.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {evaluationTypes.map((type, index) => (
                <Badge key={index} variant="outline" className="bg-psyched-cream/50">
                  {type}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No evaluation types specified</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePreferences;
