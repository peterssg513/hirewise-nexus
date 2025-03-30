
import React from 'react';

interface ProcessStepProps {
  number: number;
  title: string;
  description: string;
  features: string[];
  borderColor: string;
  dotColor: string;
}

interface ProcessSectionProps {
  title: string;
  subtitle: string;
  steps: ProcessStepProps[];
}

const ProcessSection: React.FC<ProcessSectionProps> = ({ title, subtitle, steps }) => {
  return (
    <section className="py-16 bg-white">
      <div className="psyched-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-psyched-darkBlue mb-4">
            {title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className={`bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow h-full border-l-4 ${step.borderColor}`}>
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-psyched-darkBlue text-white flex items-center justify-center font-bold shadow-lg">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-psyched-darkBlue mb-3 mt-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {step.description}
                </p>
                <ul className="text-sm space-y-1 text-gray-500">
                  {step.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <div className={`w-1.5 h-1.5 ${step.dotColor} rounded-full mr-2 flex-shrink-0`}></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
