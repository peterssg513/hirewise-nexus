
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
  
  // Enhanced isActive function that handles hash navigation properly
  const isActive = (item: NavItem) => {
    if (item.hash) {
      // For admin dashboard tabs
      if (location.pathname === item.href) {
        return location.hash 
          ? location.hash === `#${item.hash}`
          : item.hash === 'districts'; // Default tab
      }
      return false;
    } 
    // For regular path navigation (no hash)
    return location.pathname === item.href;
  };

  return (
    <nav className="flex space-x-6">
      {items.map((item) => {
        const active = isActive(item);
        return (
          <Link 
            key={`${item.href}${item.hash || ''}`}
            to={item.hash ? `${item.href}#${item.hash}` : item.href} 
            className={`relative font-medium transition-colors ${
              active 
                ? item.isHighlighted 
                  ? 'text-psyched-orange' 
                  : 'text-psyched-lightBlue' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {item.label}
            {active && (
              <motion.span 
                className={`absolute -bottom-1 left-0 w-full h-0.5 ${
                  item.isHighlighted ? 'bg-psyched-orange' : 'bg-psyched-lightBlue'
                } rounded-full`}
                layoutId="navbar-underline"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
};
