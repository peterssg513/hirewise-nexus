
import React from 'react';
import { Sparkles } from 'lucide-react';

const Motto = () => {
  return (
    <section className="py-12 bg-gradient-to-br from-psyched-purple via-psyched-indigo to-psyched-darkPurple text-white relative overflow-hidden">
      <div className="absolute top-5 right-10">
        <Sparkles className="text-psyched-yellow h-8 w-8 opacity-80" />
      </div>
      <div className="absolute bottom-5 left-10">
        <Sparkles className="text-psyched-yellow h-6 w-6 opacity-60" />
      </div>
      
      <div className="psyched-container text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Built by School Psychologists.</h2>
        <p className="text-xl md:text-2xl">For School Psychologists.</p>
      </div>
    </section>
  );
};

export default Motto;
