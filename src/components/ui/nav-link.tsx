
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  exact?: boolean;
}

export const NavLink = ({
  to,
  children,
  className = '',
  activeClassName = 'text-primary font-medium',
  exact = false,
  ...props
}: NavLinkProps) => {
  const location = useLocation();
  const isActive = exact 
    ? location.pathname === to
    : location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      className={cn(
        'inline-flex items-center text-muted-foreground hover:text-foreground transition-colors',
        className,
        isActive && activeClassName
      )}
      {...props}
    >
      {children}
    </Link>
  );
};
