
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';

const Unauthorized = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-psyched-cream">
      <Navbar />
      <main className="psyched-container py-20 flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold text-psyched-darkBlue mb-4">
          Access Denied
        </h1>
        
        <p className="text-lg mb-8 max-w-2xl">
          You don't have permission to access this page. 
          {user?.role && (
            <span> Your current role is <strong>{user.role}</strong>.</span>
          )}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {user?.role && (
            <Link to={`/${user.role}-dashboard`}>
              <Button className="bg-psyched-darkBlue hover:bg-psyched-darkBlue/90">
                Go to Your Dashboard
              </Button>
            </Link>
          )}
          
          <Button onClick={logout} variant="outline">
            Log Out
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Unauthorized;
