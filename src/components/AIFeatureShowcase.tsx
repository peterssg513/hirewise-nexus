
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Sparkles, FileText, BookOpen, Clock } from 'lucide-react';

const AIFeatureShowcase = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-white to-gray-50 overflow-hidden relative">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-magic-purple/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-magic-indigo/5 rounded-full blur-3xl"></div>
      <div className="absolute top-20 right-40 magic-star" style={{ animationDelay: '2s' }}>
        <Sparkles className="h-8 w-8 text-yellow-400" />
      </div>
      
      <div className="psyched-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center px-3 py-1 mb-4 bg-magic-purple/10 text-magic-purple rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Assistance
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-magic-gray900 mb-6">
              Revolutionary Report Writing with AI
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Our AI-assisted report writing tool helps psychologists save hours on each evaluation, 
              ensuring comprehensive, compliant reports while reducing administrative burden.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1 bg-magic-purple/10 p-2 rounded-full">
                  <FileText className="h-5 w-5 text-magic-purple" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-magic-gray900">Template-Based Writing</h3>
                  <p className="text-gray-600">Start with professional templates aligned with educational standards.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1 bg-magic-indigo/10 p-2 rounded-full">
                  <BookOpen className="h-5 w-5 text-magic-indigo" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-magic-gray900">Compliance Checking</h3>
                  <p className="text-gray-600">Automatic verification of compliance with district and state requirements.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1 bg-magic-lightPurple/10 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-magic-lightPurple" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-magic-gray900">Time-Saving</h3>
                  <p className="text-gray-600">Reduce report writing time by up to 60% while maintaining quality and personalization.</p>
                </div>
              </div>
            </div>
            
            <Link to="/register?role=psychologist">
              <Button size="lg" className="bg-gradient-to-r from-magic-indigo to-magic-purple text-white hover:opacity-90">
                Try AI-Assisted Reporting <span className="ml-2">→</span>
              </Button>
            </Link>
          </div>
          
          <div className="hidden lg:block relative">
            <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100 transform rotate-1 z-10 relative">
              <div className="flex space-x-2 mb-4">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              
              <div className="h-56 overflow-y-auto bg-gray-50 rounded p-4 text-sm">
                <div className="mb-3">
                  <p className="font-bold text-gray-800">Psych Evaluation Report</p>
                  <p className="text-xs text-gray-500">Using AI Assistant - Draft</p>
                </div>
                
                <div className="space-y-2 text-gray-700">
                  <p><span className="font-semibold">Student:</span> John D.</p>
                  <p><span className="font-semibold">Age:</span> 9 years, 4 months</p>
                  <p><span className="font-semibold">Grade:</span> 4th</p>
                  
                  <div className="bg-magic-purple/10 border-l-2 border-magic-purple p-2 my-3 rounded">
                    <p className="text-xs italic">AI suggests: Add details about testing environment and student's demeanor during evaluation.</p>
                  </div>
                  
                  <p><span className="font-semibold">Test Results:</span></p>
                  <p>WISC-V Composite Scores:</p>
                  <ul className="list-disc pl-5 text-xs">
                    <li>Verbal Comprehension: 112 (High Average)</li>
                    <li>Visual Spatial: 105 (Average)</li>
                    <li>Fluid Reasoning: 118 (High Average)</li>
                    <li>Working Memory: 95 (Average)</li>
                    <li>Processing Speed: 88 (Low Average)</li>
                  </ul>
                  
                  <div className="bg-magic-indigo/10 border-l-2 border-magic-indigo p-2 my-3 rounded">
                    <p className="text-xs">AI compliance check: This report meets all district requirements. Consider adding behavioral observations to strengthen recommendations.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-4">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="text-xs text-magic-purple">AI Suggest</Button>
                  <Button variant="outline" size="sm" className="text-xs text-magic-indigo">Check Compliance</Button>
                </div>
                <Button size="sm" className="bg-magic-purple text-white text-xs">Save Draft</Button>
              </div>
            </div>
            
            <div className="absolute top-8 -left-8 -z-10 w-full h-full bg-magic-purple/10 rounded-lg"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIFeatureShowcase;
