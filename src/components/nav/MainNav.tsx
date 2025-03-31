
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
  
  // Completely rewritten isActive function to properly handle all navigation scenarios
  const isActive = (item: NavItem) => {
    // For items with hash (admin dashboard tabs)
    if (item.hash) {
      // Check if we're on the correct base path
      if (location.pathname === item.href) {
        // If there's a hash in the URL, check if it matches the item's hash
        if (location.hash) {
          return location.hash === `#${item.hash}`;
        } 
        // If no hash in URL but this is the default tab (districts)
        else {
          return item.hash === 'districts';
        }
      }
      return false;
    } 
    // For regular path navigation (no hash)
    else {
      return location.pathname === item.href;
    }
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
