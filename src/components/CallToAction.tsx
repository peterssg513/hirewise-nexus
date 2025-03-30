
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute w-64 h-64 rounded-full bg-psyched-yellow/20 -top-32 -left-32"></div>
      <div className="absolute w-64 h-64 rounded-full bg-psyched-yellow/20 -bottom-32 -right-32"></div>
      
      <div className="psyched-container relative">
        <div className="bg-white rounded-xl p-8 md:p-12 shadow-lg border border-gray-100">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-psyched-darkBlue mb-6">
            Ready to Transform K-12 Mental Health Support?
          </h2>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            Join PsychedHire today and be part of our mission to connect schools with qualified
            psychologists, ensuring every student has access to essential mental health support.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register?role=psychologist">
              <Button size="lg" className="w-full sm:w-auto bg-psyched-lightBlue text-psyched-darkBlue hover:bg-psyched-lightBlue/90">
                For Psychologists <span className="ml-1">→</span>
              </Button>
            </Link>
            <Link to="/register?role=district">
              <Button size="lg" className="w-full sm:w-auto bg-psyched-orange text-white hover:bg-psyched-orange/90">
                For School Districts <span className="ml-1">→</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
