
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';

const Hero = () => {
  return (
    <section className="pt-20 pb-20 bg-gradient-to-br from-psyched-cream to-white relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-psyched-yellow/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-psyched-lightBlue/10 rounded-full blur-3xl"></div>
      
      <div className="psyched-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center px-4 py-1.5 mb-4 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
              <span className="mr-1.5">✨</span>
              The Future of School Psychology
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-psyched-darkBlue mb-6 leading-tight">
              PsychedHire!
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg leading-relaxed">
              Connecting qualified psychologists with K-12 schools efficiently, 
              <span className="font-medium text-psyched-darkBlue"> so you can focus on what matters the most.</span>
            </p>
            
            <ul className="mb-8 space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0 mr-2 mt-1 bg-green-100 rounded-full p-1">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-gray-700">Find qualified psychologists quickly</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mr-2 mt-1 bg-green-100 rounded-full p-1">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-gray-700">Streamline evaluations and reduce backlogs</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mr-2 mt-1 bg-green-100 rounded-full p-1">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-gray-700">AI-assisted reporting to save time</span>
              </li>
            </ul>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/for-psychologists">
                <Button size="lg" className="group bg-psyched-lightBlue text-psyched-darkBlue hover:bg-psyched-lightBlue/90">
                  For Psychologists
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/for-districts">
                <Button size="lg" className="group bg-psyched-orange text-white hover:bg-psyched-orange/90">
                  For Districts
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            
            <p className="mt-4 text-sm text-gray-500 italic">
              Built by School Psychologists. For School Psychologists.
            </p>
          </div>
          
          <div className="hidden lg:block relative">
            <div className="bg-white rounded-lg p-8 shadow-xl border border-gray-100 transform rotate-1 z-20 relative">
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
                  <div className="flex-shrink-0 bg-psyched-yellow text-psyched-darkBlue rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                    <span className="font-medium text-sm">1</span>
                  </div>
                  <div>
                    <span className="font-medium text-psyched-darkBlue">Find qualified psychologists</span>
                    <p className="text-sm text-gray-600 mt-1">Connect with pre-vetted professionals quickly</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 bg-psyched-yellow text-psyched-darkBlue rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                    <span className="font-medium text-sm">2</span>
                  </div>
                  <div>
                    <span className="font-medium text-psyched-darkBlue">Streamline hiring process</span>
                    <p className="text-sm text-gray-600 mt-1">Reduce hiring time by up to 75%</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 bg-psyched-yellow text-psyched-darkBlue rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                    <span className="font-medium text-sm">3</span>
                  </div>
                  <div>
                    <span className="font-medium text-psyched-darkBlue">Support student needs</span>
                    <p className="text-sm text-gray-600 mt-1">Improve mental health access for students</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 bg-psyched-yellow text-psyched-darkBlue rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                    <span className="font-medium text-sm">4</span>
                  </div>
                  <div>
                    <span className="font-medium text-psyched-darkBlue">Reduce admin burden</span>
                    <p className="text-sm text-gray-600 mt-1">AI-assisted reports save hours of work</p>
                  </div>
                </li>
              </ul>
              <div className="w-16 h-16 bg-psyched-yellow rounded-full absolute -bottom-6 -right-6 flex items-center justify-center shadow-lg">
                <span className="font-bold text-2xl text-psyched-darkBlue">A+</span>
              </div>
            </div>
            
            <div className="absolute top-4 -left-4 -z-10 w-full h-full bg-psyched-lightBlue/30 rounded-lg"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
