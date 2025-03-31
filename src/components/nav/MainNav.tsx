
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface NavItem {
  label: string;
  href: string;
  isHighlighted?: boolean;
}

export interface MainNavProps {
  items?: NavItem[];
}

export const MainNav: React.FC<MainNavProps> = ({ items = [] }) => {
  const location = useLocation();

  return (
    <nav className="hidden md:flex space-x-6">
      {items.map((item) => (
        <Link 
          key={item.href}
          to={item.href} 
          className={`font-medium relative ${
            location.pathname === item.href 
              ? item.isHighlighted 
                ? 'text-psyched-orange' 
                : 'text-psyched-lightBlue' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {item.label}
          {location.pathname === item.href && (
            <motion.span 
              className={`absolute -bottom-1 left-0 w-full h-0.5 ${
                item.isHighlighted ? 'bg-psyched-orange' : 'bg-psyched-lightBlue'
              } rounded-full`}
              layoutId="navbar-underline"
            />
          )}
        </Link>
      ))}
    </nav>
  );
};
