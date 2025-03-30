
import React from 'react';
import { Button } from '@/components/ui/button';
import { File, Trash } from 'lucide-react';
import { Certification } from '@/services/certificationService';

interface CertificationListProps {
  certifications: Certification[];
  onRemove: (id: string) => void;
}

const CertificationList: React.FC<CertificationListProps> = ({ certifications, onRemove }) => {
  if (certifications.length === 0) {
    return null;
  }

  return (
    <ul className="space-y-2">
      {certifications.map((cert) => (
        <li key={cert.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-md border">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <File className="h-5 w-5 text-gray-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{cert.name}</p>
              <p className="text-sm text-gray-500">{cert.startYear} - {cert.endYear}</p>
              <p className="text-xs text-gray-400">
                Status: {cert.status === 'verified' ? (
                  <span className="text-green-600">Verified</span>
                ) : (
                  <span className="text-yellow-600">Pending verification</span>
                )}
              </p>
            </div>
          </div>
          <Button
            onClick={() => onRemove(cert.id)}
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </li>
      ))}
    </ul>
  );
};

export default CertificationList;
