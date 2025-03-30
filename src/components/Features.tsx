
import React from 'react';

const Features = () => {
  return (
    <section className="py-16 bg-white">
      <div className="psyched-container">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 mb-4 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
            Our Mission
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-psyched-darkBlue mb-4">
            Connecting Schools With The Right Psychologists
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            PsychedHire bridges the gap between K-12 schools and qualified psychologists, ensuring 
            students receive the mental health support they need to thrive. Our platform simplifies the 
            hiring process, saving time and resources.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-psyched-cream rounded-lg p-6 shadow-sm transition-transform hover:transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-psyched-yellow/20 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-psyched-yellow">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                <path d="M12 8v4"></path>
                <path d="M12 16h.01"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-psyched-darkBlue mb-2">Simplified Hiring</h3>
            <p className="text-gray-600">
              Our streamlined process removes the complexity from hiring school psychologists, allowing 
              administrators to focus on what matters most: their students.
            </p>
          </div>

          <div className="bg-psyched-cream rounded-lg p-6 shadow-sm transition-transform hover:transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-psyched-yellow/20 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-psyched-yellow">
                <path d="M17 14V2"></path>
                <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-psyched-darkBlue mb-2">Quality Matches</h3>
            <p className="text-gray-600">
              We vet all psychologists on our platform, ensuring schools find candidates with the right qualifications
              and experience for their specific needs.
            </p>
          </div>

          <div className="bg-psyched-cream rounded-lg p-6 shadow-sm transition-transform hover:transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-psyched-yellow/20 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-psyched-yellow">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-psyched-darkBlue mb-2">Ongoing Support</h3>
            <p className="text-gray-600">
              Our relationship doesn't end with a placement. We provide continued support to ensure successful
              integration and long-term success.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
