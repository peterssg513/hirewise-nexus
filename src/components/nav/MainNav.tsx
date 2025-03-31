
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface NavItem {
  label: string;
  href: string;
  isHighlighted?: boolean;
  hash?: string;
}

export interface MainNavProps {
  items?: NavItem[];
}

export const MainNav: React.FC<MainNavProps> = ({ items = [] }) => {
  const location = useLocation();
  
  // Check if path matches or if hash matches (for admin dashboard tabs)
  const isActive = (item: NavItem) => {
    const pathMatch = location.pathname === item.href;
    const hashMatch = item.hash && location.hash === `#${item.hash}`;
    return pathMatch || hashMatch;
  };

  return (
    <nav className="hidden md:flex space-x-6">
      {items.map((item) => (
        <Link 
          key={item.href + (item.hash || '')}
          to={item.hash ? `${item.href}#${item.hash}` : item.href} 
          className={`font-medium relative ${
            isActive(item) 
              ? item.isHighlighted 
                ? 'text-psyched-orange' 
                : 'text-psyched-lightBlue' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {item.label}
          {isActive(item) && (
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
