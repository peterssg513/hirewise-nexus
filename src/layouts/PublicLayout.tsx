
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface PublicLayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({
  children,
  showNavbar = true,
  showFooter = true,
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {showNavbar && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default PublicLayout;
