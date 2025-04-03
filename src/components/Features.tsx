
import React from 'react';
import { CheckCircle, Sparkles, Clock, Users, Award, Star } from 'lucide-react';

const Features = () => {
  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="absolute opacity-5 -right-20 top-20">
        <Star className="w-64 h-64 text-yellow-400" />
      </div>
      <div className="absolute top-10 right-10">
        <Sparkles className="text-yellow-400 h-6 w-6 opacity-60" />
      </div>
      <div className="absolute bottom-10 left-10">
        <Sparkles className="text-yellow-400 h-5 w-5 opacity-50" />
      </div>
      
      <div className="psyched-container relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-1.5 mb-4 bg-magic-purple/10 text-magic-purple rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4 mr-2" />
            Our Mission
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-magic-gray900 mb-4">
            Connecting Schools With The Right Psychologists
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            PsychedHire bridges the gap between K-12 schools and qualified psychologists, ensuring 
            students receive the mental health support they need to thrive. Our platform simplifies the 
            hiring process, saving time and resources.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-1">
            <div className="w-14 h-14 bg-magic-purple/10 rounded-full flex items-center justify-center mb-6">
              <Clock className="h-6 w-6 text-magic-purple" />
            </div>
            <h3 className="text-xl font-semibold text-magic-gray900 mb-3">Simplified Hiring</h3>
            <p className="text-gray-600 mb-4">
              Our streamlined process removes the complexity from hiring school psychologists, allowing 
              administrators to focus on what matters most: their students.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-600">75% faster hiring process</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-600">Pre-screened candidates</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-600">Automated matching system</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-1">
            <div className="w-14 h-14 bg-magic-indigo/10 rounded-full flex items-center justify-center mb-6">
              <Award className="h-6 w-6 text-magic-indigo" />
            </div>
            <h3 className="text-xl font-semibold text-magic-gray900 mb-3">Quality Matches</h3>
            <p className="text-gray-600 mb-4">
              We vet all psychologists on our platform, ensuring schools find candidates with the right qualifications
              and experience for their specific needs.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-600">Credential verification</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-600">Skill-based matching</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-600">Background screening</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-1">
            <div className="w-14 h-14 bg-magic-lightPurple/10 rounded-full flex items-center justify-center mb-6">
              <Users className="h-6 w-6 text-magic-lightPurple" />
            </div>
            <h3 className="text-xl font-semibold text-magic-gray900 mb-3">Ongoing Support</h3>
            <p className="text-gray-600 mb-4">
              Our relationship doesn't end with a placement. We provide continued support to ensure successful
              integration and long-term success.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-600">Regular check-ins</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-600">Performance feedback</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-600">Continuous improvement</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
