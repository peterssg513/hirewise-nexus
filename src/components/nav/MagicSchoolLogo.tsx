
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const MagicSchoolLogo = ({ variant = 'default' }: { variant?: 'default' | 'light' | 'dark' }) => {
  const getLogoClasses = () => {
    switch (variant) {
      case 'light':
        return "text-white";
      case 'dark':
        return "text-psyched-gray900";
      default:
        return "text-psyched-purple";
    }
  };

  return (
    <Link to="/" className="flex items-center group">
      <motion.div 
        className="relative flex items-center"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <div className={`font-bold text-2xl ${getLogoClasses()}`}>
          <span className="text-psyched-purple">Psyched</span>
          <span className="text-psyched-indigo font-extrabold">Hire!</span>
        </div>
        <Sparkles 
          size={16} 
          className="text-psyched-yellow absolute -top-1 -right-4" 
        />
      </motion.div>
    </Link>
  );
};

export default MagicSchoolLogo;
