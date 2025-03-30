
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { FileText, School, TrendingDown, Clock } from 'lucide-react';

const CaseStudies = () => {
  return (
    <section className="py-16 bg-white">
      <div className="psyched-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-psyched-darkBlue mb-4">
            Success Stories
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            See how schools and psychologists across the country are transforming their workflows
            with PsychedHire!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="overflow-hidden shadow-lg border-none hover:shadow-xl transition-shadow">
            <div className="h-3 bg-psyched-yellow"></div>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <School className="text-psyched-orange h-8 w-8 mr-3" />
                <h3 className="text-xl font-semibold text-psyched-darkBlue">Chicago Success Story</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Chicago Public Schools reduced their psychologist hiring time by 75% and cleared a 3-month evaluation backlog in just 4 weeks.
              </p>
              <div className="flex flex-col gap-2 mt-6">
                <div className="flex items-center">
                  <Clock className="text-psyched-darkBlue h-5 w-5 mr-2" />
                  <span className="font-medium">75% faster hiring process</span>
                </div>
                <div className="flex items-center">
                  <TrendingDown className="text-psyched-darkBlue h-5 w-5 mr-2" />
                  <span className="font-medium">87% backlog reduction</span>
                </div>
                <div className="flex items-center">
                  <FileText className="text-psyched-darkBlue h-5 w-5 mr-2" />
                  <span className="font-medium">92% compliance rate improvement</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden shadow-lg border-none hover:shadow-xl transition-shadow">
            <div className="h-3 bg-psyched-lightBlue"></div>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <School className="text-psyched-orange h-8 w-8 mr-3" />
                <h3 className="text-xl font-semibold text-psyched-darkBlue">Los Angeles Unified</h3>
              </div>
              <p className="text-gray-600 mb-4">
                LAUSD connected with 35 qualified psychologists in their first month, filling all open positions with perfect skill-matching.
              </p>
              <div className="flex flex-col gap-2 mt-6">
                <div className="flex items-center">
                  <Clock className="text-psyched-darkBlue h-5 w-5 mr-2" />
                  <span className="font-medium">100% position fill rate</span>
                </div>
                <div className="flex items-center">
                  <TrendingDown className="text-psyched-darkBlue h-5 w-5 mr-2" />
                  <span className="font-medium">53% cost reduction</span>
                </div>
                <div className="flex items-center">
                  <FileText className="text-psyched-darkBlue h-5 w-5 mr-2" />
                  <span className="font-medium">95% satisfaction score</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden shadow-lg border-none hover:shadow-xl transition-shadow">
            <div className="h-3 bg-psyched-orange"></div>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <School className="text-psyched-orange h-8 w-8 mr-3" />
                <h3 className="text-xl font-semibold text-psyched-darkBlue">NYC DOE Experience</h3>
              </div>
              <p className="text-gray-600 mb-4">
                NYC Department of Education reported a 60% reduction in administrative work and 40% more time spent directly with students.
              </p>
              <div className="flex flex-col gap-2 mt-6">
                <div className="flex items-center">
                  <Clock className="text-psyched-darkBlue h-5 w-5 mr-2" />
                  <span className="font-medium">60% admin work reduction</span>
                </div>
                <div className="flex items-center">
                  <TrendingDown className="text-psyched-darkBlue h-5 w-5 mr-2" />
                  <span className="font-medium">40% more student contact time</span>
                </div>
                <div className="flex items-center">
                  <FileText className="text-psyched-darkBlue h-5 w-5 mr-2" />
                  <span className="font-medium">33% report completion improvement</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
