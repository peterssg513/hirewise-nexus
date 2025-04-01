
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  children: React.ReactNode;
  activeClassName?: string;
  exact?: boolean;
}

export const NavLink: React.FC<NavLinkProps> = ({
  to,
  children,
  className,
  activeClassName = 'text-psyched-darkBlue font-medium',
  exact = false,
  ...props
}) => {
  const location = useLocation();
  const isActive = exact 
    ? location.pathname === to
    : location.pathname.startsWith(to.toString());

  return (
    <Link
      to={to}
      className={cn(
        'text-gray-600 hover:text-psyched-darkBlue transition-colors',
        isActive && activeClassName,
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
};
