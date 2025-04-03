
import React from 'react';
import { cn } from "@/lib/utils";
import { Building, GraduationCap, Users } from "lucide-react";

type Role = 'psychologist' | 'district' | 'admin';

interface RoleSelectorProps {
  selectedRole: Role | null;
  onChange: (role: Role) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      <div 
        className={cn(
          "border rounded-md p-4 flex flex-col items-center cursor-pointer transition-all",
          selectedRole === 'psychologist' 
            ? "border-magic-purple bg-magic-purple/10" 
            : "border-gray-200 hover:border-magic-purple"
        )}
        onClick={() => onChange('psychologist')}
      >
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center mb-3",
          selectedRole === 'psychologist' ? "bg-magic-purple text-white" : "bg-gray-100"
        )}>
          <GraduationCap size={24} />
        </div>
        <span className="font-medium text-center">School Psychologist</span>
      </div>

      <div 
        className={cn(
          "border rounded-md p-4 flex flex-col items-center cursor-pointer transition-all",
          selectedRole === 'district' 
            ? "border-magic-indigo bg-magic-indigo/10" 
            : "border-gray-200 hover:border-magic-indigo"
        )}
        onClick={() => onChange('district')}
      >
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center mb-3",
          selectedRole === 'district' ? "bg-magic-indigo text-white" : "bg-gray-100"
        )}>
          <Building size={24} />
        </div>
        <span className="font-medium text-center">School District</span>
      </div>

      <div 
        className={cn(
          "border rounded-md p-4 flex flex-col items-center cursor-pointer transition-all",
          selectedRole === 'admin' 
            ? "border-magic-lightPurple bg-magic-lightPurple/10" 
            : "border-gray-200 hover:border-magic-lightPurple"
        )}
        onClick={() => onChange('admin')}
      >
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center mb-3",
          selectedRole === 'admin' ? "bg-magic-lightPurple text-white" : "bg-gray-100"
        )}>
          <Users size={24} />
        </div>
        <span className="font-medium text-center">Administrator</span>
      </div>
    </div>
  );
};

export default RoleSelector;
