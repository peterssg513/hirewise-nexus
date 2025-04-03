
import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-psyched-gray900 text-white pt-12 pb-6 relative overflow-hidden">
      <div className="absolute top-10 right-10 opacity-50">
        <Sparkles className="text-yellow-300 h-6 w-6" />
      </div>
      <div className="absolute bottom-10 left-10 opacity-30">
        <Sparkles className="text-yellow-300 h-4 w-4" />
      </div>
      
      <div className="psyched-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center mb-4 relative">
              <div className="font-bold text-2xl">
                <span className="text-psyched-purple">Psyched</span>
                <span className="text-white font-extrabold">Hire!</span>
              </div>
              <Sparkles 
                size={14} 
                className="text-yellow-400 absolute -top-1 right-2" 
              />
            </div>
            <p className="text-gray-400 mb-4">
              Connecting qualified psychologists with K-12 schools to support student mental health.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">For Psychologists</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/for-psychologists" className="text-gray-400 hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-gray-400 hover:text-white transition-colors">
                  Resources
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">For Schools</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/for-districts" className="text-gray-400 hover:text-white transition-colors">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/success-stories" className="text-gray-400 hover:text-white transition-colors">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} PsychedHire. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
