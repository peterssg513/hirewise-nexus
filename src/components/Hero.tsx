
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="pt-16 pb-20 bg-psyched-cream">
      <div className="psyched-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block px-3 py-1 mb-4 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
              K-12 Psychology Recruitment
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-psyched-darkBlue mb-6 leading-tight">
              PsychedHire: The Easy Way to Find K-12 Psychology Jobs!
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Connecting qualified psychologists with K-12 schools efficiently, helping provide essential mental health support for students.
            </p>
            <Link to="/register">
              <Button size="lg" className="bg-psyched-yellow text-psyched-darkBlue hover:bg-psyched-yellow/90">
                Get Started <span className="ml-2">→</span>
              </Button>
            </Link>
          </div>
          <div className="hidden lg:block">
            <div className="bg-white rounded-lg p-8 shadow-lg border border-gray-100 transform rotate-1">
              <div className="flex space-x-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <h3 className="font-bold mb-6 text-gray-800 uppercase text-sm tracking-wide">
                School Psychology Goals:
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 mr-2 mt-1 text-psyched-yellow">✓</div>
                  <span>Find qualified psychologists quickly</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mr-2 mt-1 text-psyched-yellow">✓</div>
                  <span>Streamline the hiring process</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mr-2 mt-1 text-psyched-yellow">✓</div>
                  <span>Support student mental health needs</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mr-2 mt-1 text-psyched-yellow">✓</div>
                  <span>Reduce administrative burden</span>
                </li>
              </ul>
              <div className="w-12 h-12 bg-psyched-yellow rounded-full absolute -bottom-4 -right-4 flex items-center justify-center">
                <span className="font-bold text-psyched-darkBlue">A+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
