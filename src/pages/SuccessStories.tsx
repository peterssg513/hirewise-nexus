
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { School, Users, ArrowRight, FileText, TrendingUp, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SuccessStories = () => {
  return (
    <div className="min-h-screen bg-psyched-cream flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-psyched-darkBlue text-white py-20">
          <div className="psyched-container">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Success Stories</h1>
              <p className="text-xl opacity-90 mb-8">
                Discover how PsychedHire! has transformed school psychology staffing and services across the country
              </p>
              <div className="flex justify-center">
                <div className="flex items-center text-sm">
                  <Link to="/" className="hover:underline">Home</Link>
                  <ChevronRight size={14} className="mx-2" />
                  <span>Success Stories</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Featured Case Studies */}
        <section className="py-16 bg-white">
          <div className="psyched-container">
            <h2 className="text-3xl font-bold text-psyched-darkBlue mb-10">Featured Case Studies</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Denver Public Schools */}
              <Card className="shadow-lg border-none overflow-hidden">
                <div className="h-3 bg-psyched-yellow"></div>
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <School className="text-psyched-orange h-10 w-10 mr-3" />
                    <h3 className="text-2xl font-semibold text-psyched-darkBlue">Denver Public Schools</h3>
                  </div>
                  
                  <p className="text-lg font-medium text-psyched-darkBlue mb-3">
                    How PsychedHire Helped Denver Public Schools Rapidly Scale Their Psychological Services
                  </p>
                  
                  <p className="text-gray-600 mb-6">
                    In 2022, Denver Public Schools (DPS) faced urgent staffing needs in psychological services. 
                    With competitors already approaching the district, DPS needed a trusted partner who could 
                    respond fast and deliver lasting results.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <Clock className="h-6 w-6 text-psyched-yellow mb-2" />
                      <p className="font-semibold">Rapid Response</p>
                      <p className="text-sm text-gray-600">3 academic years</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <Users className="h-6 w-6 text-psyched-yellow mb-2" />
                      <p className="font-semibold">Team Growth</p>
                      <p className="text-sm text-gray-600">100+ professionals</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <Link to="/success-stories/denver-public-schools">
                      <Button className="bg-psyched-yellow text-psyched-darkBlue hover:bg-psyched-orange">
                        Read Full Case Study <ArrowRight className="ml-2" size={16} />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              
              {/* Kansas City Public Schools */}
              <Card className="shadow-lg border-none overflow-hidden">
                <div className="h-3 bg-psyched-lightBlue"></div>
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <School className="text-psyched-orange h-10 w-10 mr-3" />
                    <h3 className="text-2xl font-semibold text-psyched-darkBlue">Kansas City Public Schools</h3>
                  </div>
                  
                  <p className="text-lg font-medium text-psyched-darkBlue mb-3">
                    How PsychedHire Helped Kansas City Public Schools Achieve 542% Staffing Growth in Just 4 Years
                  </p>
                  
                  <p className="text-gray-600 mb-6">
                    Kansas City Public Schools (KCKPS) faced a growing challenge in 2021: a critical shortage of 
                    school psychologists and support staff amidst increasing student needs. They needed more than 
                    just resumes — they needed a strategic partner.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-psyched-lightBlue mb-2" />
                      <p className="font-semibold">Growth Rate</p>
                      <p className="text-sm text-gray-600">542% in 4 years</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <FileText className="h-6 w-6 text-psyched-lightBlue mb-2" />
                      <p className="font-semibold">Evaluations</p>
                      <p className="text-sm text-gray-600">1,500+ completed</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <Link to="/success-stories/kansas-city-public-schools">
                      <Button className="bg-psyched-lightBlue text-white hover:bg-psyched-darkBlue">
                        Read Full Case Study <ArrowRight className="ml-2" size={16} />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-psyched-darkBlue to-psyched-blue text-white">
          <div className="psyched-container text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Become Our Next Success Story?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Join the growing community of schools and districts transforming their psychology services with PsychedHire!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/for-districts">
                <Button size="lg" className="bg-white text-psyched-darkBlue hover:bg-psyched-yellow">
                  For Districts
                </Button>
              </Link>
              <Link to="/for-psychologists">
                <Button size="lg" className="bg-white text-psyched-darkBlue hover:bg-psyched-yellow">
                  For Psychologists
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default SuccessStories;
