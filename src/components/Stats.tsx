
import React from 'react';
import { Sparkles } from 'lucide-react';

const Stats = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-psyched-purple via-psyched-indigo to-psyched-darkPurple text-white relative overflow-hidden">
      <div className="absolute top-10 left-10">
        <Sparkles className="text-psyched-yellow h-8 w-8 opacity-80" />
      </div>
      <div className="absolute bottom-10 right-10">
        <Sparkles className="text-psyched-yellow h-6 w-6 opacity-60" />
      </div>
      
      <div className="psyched-container">
        <h2 className="text-center text-3xl font-bold mb-16">
          Making a Difference
        </h2>
        <p className="text-center text-xl mb-16 max-w-3xl mx-auto">
          PsychedHire is transforming K-12 psychology staffing nationwide.
        </p>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl md:text-5xl font-bold text-psyched-yellow mb-2">200+</div>
            <div className="text-gray-300">School Districts</div>
          </div>
          
          <div>
            <div className="text-4xl md:text-5xl font-bold text-psyched-yellow mb-2">1,000+</div>
            <div className="text-gray-300">Psychologists</div>
          </div>
          
          <div>
            <div className="text-4xl md:text-5xl font-bold text-psyched-yellow mb-2">50,000+</div>
            <div className="text-gray-300">Students Supported</div>
          </div>
          
          <div>
            <div className="text-4xl md:text-5xl font-bold text-psyched-yellow mb-2">35</div>
            <div className="text-gray-300">States Served</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
