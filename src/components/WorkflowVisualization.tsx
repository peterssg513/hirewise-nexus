
import React from 'react';
import { CheckSquare, FileText, Search, Users } from 'lucide-react';

const WorkflowVisualization = () => {
  return (
    <section className="py-16 bg-white">
      <div className="psyched-container">
        <h2 className="text-3xl font-bold text-center text-psyched-darkBlue mb-4">
          How PsychedHire! Works
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Our streamlined process connects qualified psychologists with school districts, 
          simplifying evaluations and improving student support.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-psyched-lightBlue/20 flex items-center justify-center mb-4">
              <Search className="text-psyched-lightBlue h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-psyched-darkBlue mb-2">Post & Find</h3>
            <p className="text-gray-600">
              Districts post jobs, psychologists find opportunities matching their skills and availability.
            </p>
          </div>
          
          {/* Step 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-psyched-yellow/20 flex items-center justify-center mb-4">
              <Users className="text-psyched-yellow h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-psyched-darkBlue mb-2">Connect</h3>
            <p className="text-gray-600">
              AI-powered matching brings the right psychologists to the right districts.
            </p>
          </div>
          
          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-psyched-orange/20 flex items-center justify-center mb-4">
              <CheckSquare className="text-psyched-orange h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-psyched-darkBlue mb-2">Evaluate</h3>
            <p className="text-gray-600">
              Complete evaluations through our structured, compliance-friendly platform.
            </p>
          </div>
          
          {/* Step 4 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <FileText className="text-green-600 h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-psyched-darkBlue mb-2">Report</h3>
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
