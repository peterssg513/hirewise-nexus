
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, School, TrendingUp, Clock, Users, ArrowRight } from 'lucide-react';

const CaseStudies = () => {
  return (
    <section className="py-16 bg-white">
      <div className="psyched-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-magic-gray900 mb-4">
            Success Stories
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            See how schools and psychologists across the country are transforming their workflows
            with PsychedHire!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="overflow-hidden shadow-lg border-none hover:shadow-xl transition-shadow">
            <div className="h-3 bg-magic-purple"></div>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <School className="text-magic-indigo h-8 w-8 mr-3" />
                <h3 className="text-xl font-semibold text-magic-gray900">Denver Public Schools</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Denver Public Schools transformed urgent staffing gaps into a comprehensive team of over 100 psychology professionals in just three academic years.
              </p>
              <div className="flex flex-col gap-2 mt-6 mb-6">
                <div className="flex items-center">
                  <Clock className="text-magic-gray900 h-5 w-5 mr-2" />
                  <span className="font-medium">Rapid response solution</span>
                </div>
                <div className="flex items-center">
                  <Users className="text-magic-gray900 h-5 w-5 mr-2" />
                  <span className="font-medium">100+ professionals placed</span>
                </div>
                <div className="flex items-center">
                  <FileText className="text-magic-gray900 h-5 w-5 mr-2" />
                  <span className="font-medium">Long-term staffing partnership</span>
                </div>
              </div>
              <Link to="/success-stories/denver-public-schools">
                <Button className="w-full bg-magic-purple text-white hover:bg-magic-purple/90">
                  Read Full Case Study <ArrowRight className="ml-2" size={16} />
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden shadow-lg border-none hover:shadow-xl transition-shadow">
            <div className="h-3 bg-magic-indigo"></div>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <School className="text-magic-purple h-8 w-8 mr-3" />
                <h3 className="text-xl font-semibold text-magic-gray900">Kansas City Public Schools</h3>
              </div>
              <p className="text-gray-600 mb-4">
                KCKPS achieved 542% staffing growth in just 4 years, expanding from 14 to over 90 specialized staff and completing 1,500+ evaluations.
              </p>
              <div className="flex flex-col gap-2 mt-6 mb-6">
                <div className="flex items-center">
                  <TrendingUp className="text-magic-gray900 h-5 w-5 mr-2" />
                  <span className="font-medium">542% staffing growth</span>
                </div>
                <div className="flex items-center">
                  <FileText className="text-magic-gray900 h-5 w-5 mr-2" />
                  <span className="font-medium">1,500+ evaluations completed</span>
                </div>
                <div className="flex items-center">
                  <Users className="text-magic-gray900 h-5 w-5 mr-2" />
                  <span className="font-medium">Exclusive psychology partner</span>
                </div>
              </div>
              <Link to="/success-stories/kansas-city-public-schools">
                <Button className="w-full bg-magic-indigo text-white hover:bg-magic-indigo/90">
                  Read Full Case Study <ArrowRight className="ml-2" size={16} />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
