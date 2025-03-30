
import React from 'react';

const Partners = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="psyched-container">
        <h2 className="text-center text-xl text-gray-600 mb-8">
          Trusted by top school districts nationwide
        </h2>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16">
          <div className="grayscale hover:grayscale-0 transition-all duration-300">
            <div className="font-bold text-xl md:text-2xl text-gray-700">Chicago Public Schools</div>
          </div>
          
          <div className="grayscale hover:grayscale-0 transition-all duration-300">
            <div className="font-bold text-xl md:text-2xl text-gray-700">Los Angeles Unified</div>
          </div>
          
          <div className="grayscale hover:grayscale-0 transition-all duration-300">
            <div className="font-bold text-xl md:text-2xl text-gray-700">NYC DOE</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
