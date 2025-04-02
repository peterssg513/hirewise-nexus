
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronRight, Clock, Quote, School, Target, Users } from 'lucide-react';

const DenverPublicSchools = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-psyched-darkBlue text-white py-24">
          <div className="psyched-container">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center px-4 py-1.5 mb-6 bg-yellow-400 bg-opacity-20 text-yellow-400 rounded-full text-sm font-medium">
                <School className="w-4 h-4 mr-2" />
                Case Study
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Denver Public Schools</h1>
              <p className="text-xl opacity-90 mb-8">
                How PsychedHire Helped Denver Public Schools Rapidly Scale Their Psychological Services
              </p>
              <div className="flex justify-center">
                <div className="flex items-center text-sm">
                  <Link to="/" className="hover:underline">Home</Link>
                  <ChevronRight size={14} className="mx-2" />
                  <Link to="/success-stories" className="hover:underline">Success Stories</Link>
                  <ChevronRight size={14} className="mx-2" />
                  <span>Denver Public Schools</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Overview */}
        <section className="py-16">
          <div className="psyched-container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <h2 className="text-3xl font-bold text-psyched-darkBlue mb-6">Overview</h2>
                <p className="text-gray-700 text-lg mb-6">
                  In 2022, Denver Public Schools (DPS) faced urgent staffing needs in psychological services. 
                  With competitors already approaching the district, DPS needed a trusted partner who could 
                  respond fast and deliver lasting results.
                </p>
                <div className="bg-psyched-yellow/10 border-l-4 border-psyched-yellow p-6 my-8 rounded">
                  <Quote className="h-10 w-10 text-psyched-yellow mb-4" />
                  <p className="text-xl font-medium text-gray-800 italic mb-4">
                    "PsychedHire was the difference between scrambling and succeeding. Their speed and quality changed everything."
                  </p>
                  <p className="text-right text-gray-600">
                    — Leadership Team, Denver Public Schools
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-psyched-darkBlue mb-4">At a Glance</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Organization</p>
                    <p className="font-medium">Denver Public Schools</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">Denver, Colorado</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Challenge</p>
                    <p className="font-medium">Urgent staffing needs in psychological services</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Solution</p>
                    <p className="font-medium">Rapid staffing with qualified professionals</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Results</p>
                    <p className="font-medium">100+ professionals across psychological service lines</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Challenge, Solution, Results */}
        <section className="py-16 bg-gray-50">
          <div className="psyched-container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Challenge */}
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-6">
                  <Target className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-psyched-darkBlue mb-4">The Challenge</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <div className="mr-2 mt-1">•</div>
                    <p>Imminent staffing gaps in psychological services</p>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1">•</div>
                    <p>Competitive vendor landscape with pressure to decide quickly</p>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1">•</div>
                    <p>Short timeline for implementing a scalable solution</p>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1">•</div>
                    <p>Need for consistent quality across a large school system</p>
                  </li>
                </ul>
              </div>
              
              {/* Solution */}
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-psyched-darkBlue mb-4">The Solution</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <div className="mr-2 mt-1">•</div>
                    <p>Swift response with dedicated team assignments</p>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1">•</div>
                    <p>Precise matching of professionals to district needs</p>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1">•</div>
                    <p>Strong communication channels with district leaders</p>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1">•</div>
                    <p>Streamlined onboarding and service delivery</p>
                  </li>
                </ul>
              </div>
              
              {/* Results */}
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-psyched-darkBlue mb-4">The Results</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <div className="mr-2 mt-1">•</div>
                    <p><strong>2022-23:</strong> Initial staffing needs fulfilled</p>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1">•</div>
                    <p><strong>2023-24:</strong> Expanded team with wider coverage</p>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1">•</div>
                    <p><strong>2024-25:</strong> Over 100 professionals across psychological service lines</p>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1">•</div>
                    <p>Established long-term partnership built on trust and results</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* Timeline */}
        <section className="py-16">
          <div className="psyched-container">
            <h2 className="text-3xl font-bold text-psyched-darkBlue text-center mb-12">Project Timeline</h2>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute h-full w-1 bg-gray-200 left-1/2 transform -translate-x-1/2"></div>
              
              {/* Timeline items */}
              <div className="space-y-24">
                {/* 2022 */}
                <div className="relative flex items-center justify-between">
                  <div className="w-5/12 pr-8 text-right">
                    <h3 className="text-xl font-bold text-psyched-darkBlue mb-2">2022: Initial Engagement</h3>
                    <p className="text-gray-600">
                      Denver Public Schools approached PsychedHire with urgent staffing needs. We responded quickly, 
                      establishing a strong foundation and fulfilling immediate requirements.
                    </p>
                  </div>
                  
                  <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-psyched-yellow rounded-full border-4 border-white flex items-center justify-center z-10">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  
                  <div className="w-5/12 pl-8">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium">Key Achievement:</p>
                      <p className="text-gray-600">Rapid staffing deployment within critical timeframe</p>
                    </div>
                  </div>
                </div>
                
                {/* 2023 */}
                <div className="relative flex items-center justify-between">
                  <div className="w-5/12 pr-8 text-right">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium">Key Achievement:</p>
                      <p className="text-gray-600">Expanded service coverage and deepened district relationship</p>
                    </div>
                  </div>
                  
                  <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-psyched-lightBlue rounded-full border-4 border-white flex items-center justify-center z-10">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  
                  <div className="w-5/12 pl-8">
                    <h3 className="text-xl font-bold text-psyched-darkBlue mb-2">2023: Growth Phase</h3>
                    <p className="text-gray-600">
                      Building on our successful first year, we expanded our team and service offerings to 
                      meet the growing needs of Denver Public Schools.
                    </p>
                  </div>
                </div>
                
                {/* 2024-2025 */}
                <div className="relative flex items-center justify-between">
                  <div className="w-5/12 pr-8 text-right">
                    <h3 className="text-xl font-bold text-psyched-darkBlue mb-2">2024-2025: Full Scale</h3>
                    <p className="text-gray-600">
                      The partnership reached full maturity with over 100 professionals deployed across 
                      all psychological service lines, creating a new standard of excellence.
                    </p>
                  </div>
                  
                  <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-psyched-orange rounded-full border-4 border-white flex items-center justify-center z-10">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  
                  <div className="w-5/12 pl-8">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium">Key Achievement:</p>
                      <p className="text-gray-600">100+ professionals deployed and long-term partnership established</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Impact */}
        <section className="py-16 bg-psyched-darkBlue text-white">
          <div className="psyched-container">
            <h2 className="text-3xl font-bold text-center mb-12">Long-Term Impact</h2>
            
            <p className="text-xl text-center max-w-3xl mx-auto mb-12">
              By responding quickly and with purpose, PsychedHire turned a high-pressure situation into a thriving, 
              long-term partnership — setting a new standard for excellence in K–12 psychology staffing.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white bg-opacity-10 p-6 rounded-lg">
                <Users className="h-12 w-12 text-psyched-yellow mb-4" />
                <h3 className="text-xl font-bold mb-3">Staffing Stability</h3>
                <p className="text-gray-300">
                  Established consistent psychological services coverage across all schools in the district
                </p>
              </div>
              
              <div className="bg-white bg-opacity-10 p-6 rounded-lg">
                <Target className="h-12 w-12 text-psyched-yellow mb-4" />
                <h3 className="text-xl font-bold mb-3">Quality Outcomes</h3>
                <p className="text-gray-300">
                  Improved evaluation quality and timeliness, leading to better student support
                </p>
              </div>
              
              <div className="bg-white bg-opacity-10 p-6 rounded-lg">
                <CheckCircle className="h-12 w-12 text-psyched-yellow mb-4" />
                <h3 className="text-xl font-bold mb-3">Strategic Partnership</h3>
                <p className="text-gray-300">
                  Transformed from vendor to trusted strategic partner in educational psychology
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16">
          <div className="psyched-container text-center">
            <h2 className="text-3xl font-bold text-psyched-darkBlue mb-6">Ready to Transform Your School Psychology Services?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Learn how PsychedHire can help your district achieve staffing stability and service excellence
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register?role=district">
                <Button size="lg" className="bg-psyched-yellow text-psyched-darkBlue hover:bg-psyched-orange">
                  Join as a District
                </Button>
              </Link>
              <Link to="/for-districts">
                <Button size="lg" variant="outline" className="border-psyched-darkBlue text-psyched-darkBlue hover:bg-gray-50">
                  Learn More
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

export default DenverPublicSchools;
