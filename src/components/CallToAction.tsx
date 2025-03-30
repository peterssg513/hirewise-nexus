
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CallToAction = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute w-64 h-64 rounded-full bg-psyched-yellow/20 -top-32 -left-32 blur-3xl"></div>
      <div className="absolute w-64 h-64 rounded-full bg-psyched-lightBlue/20 -bottom-32 -right-32 blur-3xl"></div>
      
      <div className="psyched-container relative">
        <div className="bg-white rounded-xl p-8 md:p-12 shadow-xl border border-gray-100">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-psyched-darkBlue mb-6">
            Ready to Transform K-12 Mental Health Support?
          </h2>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            Join PsychedHire today and be part of our mission to connect schools with qualified
            psychologists, ensuring every student has access to essential mental health support.
          </p>
          
          <div className="max-w-3xl mx-auto bg-psyched-cream p-6 rounded-lg mb-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-semibold text-psyched-darkBlue mb-2">The Future of School Psychology</h3>
                <p className="text-gray-600">So you can focus on what matters the most</p>
              </div>
              <div className="text-center md:text-right">
                <h3 className="text-xl font-semibold text-psyched-darkBlue mb-2">Built by School Psychologists</h3>
                <p className="text-gray-600">For School Psychologists</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register?role=psychologist">
              <Button size="lg" className="w-full sm:w-auto group bg-psyched-lightBlue text-psyched-darkBlue hover:bg-psyched-lightBlue/90">
                For Psychologists
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/register?role=district">
              <Button size="lg" className="w-full sm:w-auto group bg-psyched-orange text-white hover:bg-psyched-orange/90">
                For School Districts
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
