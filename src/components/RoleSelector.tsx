
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
            ? "border-psyched-lightBlue bg-psyched-lightBlue/10" 
            : "border-gray-200 hover:border-psyched-lightBlue"
        )}
        onClick={() => onChange('psychologist')}
      >
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center mb-3",
          selectedRole === 'psychologist' ? "bg-psyched-lightBlue text-white" : "bg-gray-100"
        )}>
          <GraduationCap size={24} />
        </div>
        <span className="font-medium text-center">School Psychologist</span>
      </div>

      <div 
        className={cn(
          "border rounded-md p-4 flex flex-col items-center cursor-pointer transition-all",
          selectedRole === 'district' 
            ? "border-psyched-orange bg-psyched-orange/10" 
            : "border-gray-200 hover:border-psyched-orange"
        )}
        onClick={() => onChange('district')}
      >
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center mb-3",
          selectedRole === 'district' ? "bg-psyched-orange text-white" : "bg-gray-100"
        )}>
          <Building size={24} />
        </div>
        <span className="font-medium text-center">School District</span>
      </div>

      <div 
        className={cn(
          "border rounded-md p-4 flex flex-col items-center cursor-pointer transition-all",
          selectedRole === 'admin' 
            ? "border-blue-500 bg-blue-500/10" 
            : "border-gray-200 hover:border-blue-500"
        )}
        onClick={() => onChange('admin')}
      >
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center mb-3",
          selectedRole === 'admin' ? "bg-blue-500 text-white" : "bg-gray-100"
        )}>
          <Users size={24} />
        </div>
        <span className="font-medium text-center">Administrator</span>
      </div>
    </div>
  );
};

export default RoleSelector;
