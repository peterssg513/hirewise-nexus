
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from 'lucide-react';

const AIReportSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="psyched-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center px-3 py-1 mb-4 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              Revolutionary Feature
            </div>
            <h2 className="text-3xl font-bold text-psyched-darkBlue mb-6">
              AI-Assisted Report Writing
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Our advanced AI tools streamline the report writing process, reducing administrative 
              burden while maintaining quality and personalization.
            </p>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <div className="flex-shrink-0 mr-3 mt-1 bg-green-100 rounded-full p-1">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <span className="font-medium text-psyched-darkBlue">Save up to 60% of report writing time</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Let AI help with formatting, compliance checking, and drafting sections
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mr-3 mt-1 bg-green-100 rounded-full p-1">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <span className="font-medium text-psyched-darkBlue">FERPA and HIPAA compliant</span>
                  <p className="text-sm text-gray-600 mt-1">
                    All data is processed securely while meeting all regulatory requirements
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mr-3 mt-1 bg-green-100 rounded-full p-1">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <span className="font-medium text-psyched-darkBlue">Professional templates and recommendations</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Start with templates aligned with best practices and educational standards
                  </p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="relative">
            <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100 transform rotate-1 z-10 relative">
              <div className="flex space-x-2 mb-4">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              
              <div className="h-64 overflow-y-auto bg-gray-50 rounded p-4 text-sm">
                <div className="mb-3">
                  <p className="font-bold text-gray-800">Psych Evaluation Report</p>
                  <p className="text-xs text-gray-500">Using AI Assistant - Draft</p>
                </div>
                
                <div className="space-y-2 text-gray-700">
                  <p><span className="font-semibold">Student:</span> John D.</p>
                  <p><span className="font-semibold">Age:</span> 9 years, 4 months</p>
                  <p><span className="font-semibold">Grade:</span> 4th</p>
                  
                  <div className="bg-psyched-yellow/10 border-l-2 border-psyched-yellow p-2 my-3 rounded">
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
                  
                  <div className="bg-blue-50 border-l-2 border-blue-400 p-2 my-3 rounded">
                    <p className="text-xs">AI compliance check: This report meets all district requirements. Consider adding behavioral observations to strengthen recommendations.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-4">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="text-xs">AI Suggest</Button>
                  <Button variant="outline" size="sm" className="text-xs">Check Compliance</Button>
                </div>
                <Button size="sm" className="bg-psyched-yellow text-psyched-darkBlue text-xs">Save Draft</Button>
              </div>
            </div>
            
            <div className="absolute top-8 -left-8 -z-10 w-full h-full bg-psyched-lightBlue/20 rounded-lg"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIReportSection;
