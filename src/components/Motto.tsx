
import React from 'react';

const Motto = () => {
  return (
    <section className="py-12 bg-psyched-darkBlue text-white">
      <div className="psyched-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-psyched-yellow">
              The Future of School Psychology
            </h2>
            <p className="text-xl md:text-2xl">
              So you can focus on what matters the most
            </p>
          </div>
          
          <div className="text-center md:text-right">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-psyched-yellow">
              Built by School Psychologists
            </h2>
            <p className="text-xl md:text-2xl">
              For School Psychologists
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Motto;
