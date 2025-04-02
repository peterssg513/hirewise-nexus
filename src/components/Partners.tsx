
import React from 'react';

const Partners = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="psyched-container">
        <h2 className="text-center text-2xl font-bold text-psyched-darkBlue mb-3">
          Trusted by Top School Districts
        </h2>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
          Join the leading school districts across the nation that are transforming 
          their psychology services with PsychedHire!
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16">
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-psyched-yellow/20 to-psyched-orange/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative p-6 grayscale hover:grayscale-0 transition-all duration-300 transform group-hover:scale-105">
              <div className="font-bold text-xl md:text-2xl text-gray-700">Denver Public Schools</div>
              <div className="text-sm text-gray-500 mt-1">Since 2022</div>
            </div>
          </div>
          
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-psyched-yellow/20 to-psyched-orange/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative p-6 grayscale hover:grayscale-0 transition-all duration-300 transform group-hover:scale-105">
              <div className="font-bold text-xl md:text-2xl text-gray-700">Kansas City Public Schools</div>
              <div className="text-sm text-gray-500 mt-1">Since 2021</div>
            </div>
          </div>
          
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-psyched-yellow/20 to-psyched-orange/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative p-6 grayscale hover:grayscale-0 transition-all duration-300 transform group-hover:scale-105">
              <div className="font-bold text-xl md:text-2xl text-gray-700">Midwestern Regional District</div>
              <div className="text-sm text-gray-500 mt-1">Since 2018</div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            And many more school districts across the United States
          </p>
        </div>
      </div>
    </section>
  );
};

export default Partners;
