
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated, profile } = useAuth();
  const location = useLocation();

  const getDashboardLink = () => {
    if (!profile?.role) return '/login';
    return `/${profile.role}-dashboard`;
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="psyched-container py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="bg-psyched-yellow font-bold px-2 py-1 text-psyched-darkBlue mr-1">
                Psyched
              </div>
              <div className="text-psyched-darkBlue font-semibold">
                Hire!
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-6">
            <Link 
              to="/for-psychologists" 
              className={`font-medium ${location.pathname === '/for-psychologists' ? 'text-psyched-lightBlue' : 'text-gray-600 hover:text-gray-900'}`}
            >
              For School Psychologists
            </Link>
            <Link 
              to="/for-districts" 
              className={`font-medium ${location.pathname === '/for-districts' ? 'text-psyched-orange' : 'text-gray-600 hover:text-gray-900'}`}
            >
              For Districts/Schools
            </Link>
          </div>
          
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <Link to={getDashboardLink()}>
                <Button className="bg-psyched-darkBlue text-white hover:bg-psyched-darkBlue/90">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-psyched-darkBlue">
                    Log in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-psyched-darkBlue text-white hover:bg-psyched-darkBlue/90">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
