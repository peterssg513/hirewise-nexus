
import React from 'react';
import { CheckSquare, FileText, Search, Users, Sparkles } from 'lucide-react';

const WorkflowVisualization = () => {
  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="absolute top-10 right-10">
        <Sparkles className="text-yellow-400 h-6 w-6 opacity-60" />
      </div>
      <div className="absolute bottom-10 left-10">
        <Sparkles className="text-yellow-400 h-5 w-5 opacity-50" />
      </div>
      
      <div className="psyched-container">
        <h2 className="text-3xl font-bold text-center text-magic-gray900 mb-4">
          How PsychedHire! Works
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Our streamlined process connects qualified psychologists with school districts, 
          simplifying evaluations and improving student support.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-magic-indigo/20 flex items-center justify-center mb-4">
              <Search className="text-magic-indigo h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-magic-gray900 mb-2">Post & Find</h3>
            <p className="text-gray-600">
              Districts post jobs, psychologists find opportunities matching their skills and availability.
            </p>
          </div>
          
          {/* Step 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-magic-purple/20 flex items-center justify-center mb-4">
              <Users className="text-magic-purple h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-magic-gray900 mb-2">Connect</h3>
            <p className="text-gray-600">
              AI-powered matching brings the right psychologists to the right districts.
            </p>
          </div>
          
          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-magic-lightPurple/20 flex items-center justify-center mb-4">
              <CheckSquare className="text-magic-lightPurple h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-magic-gray900 mb-2">Evaluate</h3>
            <p className="text-gray-600">
              Complete evaluations through our structured, compliance-friendly platform.
            </p>
          </div>
          
          {/* Step 4 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <FileText className="text-green-600 h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-magic-gray900 mb-2">Report</h3>
            <p className="text-gray-600">
              Generate and submit comprehensive reports with AI-assisted tools.
            </p>
          </div>
        </div>
        
        {/* Connecting lines on desktop */}
        <div className="hidden lg:block relative h-4 my-4">
          <div className="absolute top-0 left-[20%] right-[20%] h-0.5 bg-gray-200"></div>
          <div className="absolute top-0 left-[40%] w-0.5 h-4 bg-gray-200"></div>
          <div className="absolute top-0 left-[60%] w-0.5 h-4 bg-gray-200"></div>
          <div className="absolute top-0 left-[80%] w-0.5 h-4 bg-gray-200"></div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowVisualization;
