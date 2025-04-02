
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronRight, Clock, FileText, Quote, School, Target, TrendingUp, Users } from 'lucide-react';

const KansasCityPublicSchools = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-psyched-darkBlue text-white py-24">
          <div className="psyched-container">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center px-4 py-1.5 mb-6 bg-blue-400 bg-opacity-20 text-blue-300 rounded-full text-sm font-medium">
                <School className="w-4 h-4 mr-2" />
                Case Study
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Kansas City Public Schools</h1>
              <p className="text-xl opacity-90 mb-8">
                How PsychedHire Helped Kansas City Public Schools Achieve 542% Staffing Growth in Just 4 Years
              </p>
              <div className="flex justify-center">
                <div className="flex items-center text-sm">
                  <Link to="/" className="hover:underline">Home</Link>
                  <ChevronRight size={14} className="mx-2" />
                  <Link to="/success-stories" className="hover:underline">Success Stories</Link>
                  <ChevronRight size={14} className="mx-2" />
                  <span>Kansas City Public Schools</span>
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
                  Kansas City Public Schools (KCKPS) faced a growing challenge in 2021: a critical shortage of 
                  school psychologists and support staff amidst increasing student needs. They needed more than 
                  just resumes — they needed a strategic partner.
                </p>
                <div className="bg-psyched-lightBlue/10 border-l-4 border-psyched-lightBlue p-6 my-8 rounded">
                  <Quote className="h-10 w-10 text-psyched-lightBlue mb-4" />
                  <p className="text-xl font-medium text-gray-800 italic mb-4">
                    "Thanks to PsychedHire, we scaled faster than we ever imagined — and with the right people. We achieved 542% staffing growth in just 4 years."
                  </p>
                  <p className="text-right text-gray-600">
                    — District Office, Special Education Department, Kansas City Public Schools
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-psyched-darkBlue mb-4">At a Glance</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Organization</p>
                    <p className="font-medium">Kansas City Public Schools</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">Kansas City, Kansas</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Challenge</p>
                    <p className="font-medium">Shortage of qualified school psychologists</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Solution</p>
                    <p className="font-medium">Strategic staffing plan with telepractice services</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Results</p>
                    <p className="font-medium">542% staffing growth in 4 years (14 to 90+ staff)</p>
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
                    <p>Severe shortage of qualified school psychologists</p>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1">•</div>
                    <p>Lack of coordinated evaluation support system</p>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1">•</div>
                    <p>Urgent demand for scalable staffing solutions</p>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1">•</div>
                    <p>Need to increase capacity for student evaluations</p>
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
                    <p>Strategic staffing plan with phased implementation</p>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1">•</div>
                    <p>Highly qualified telepractice psychologists</p>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1">•</div>
                    <p>On-site facilitators to support virtual services</p>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1">•</div>
                    <p>Comprehensive evaluation management system</p>
                  </li>
                </ul>
              </div>
              
              {/* Results */}
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-psyched-darkBlue mb-4">The Results</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <div className="mr-2 mt-1">•</div>
                    <p><strong>2021:</strong> 14 staff (psychologists and facilitators)</p>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1">•</div>
                    <p><strong>2023:</strong> PsychedHire becomes exclusive psychology partner</p>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1">•</div>
                    <p><strong>2024:</strong> 50+ staff and over 1,500 evaluations completed</p>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1">•</div>
                    <p><strong>2025 (Projected):</strong> 90+ specialized staff</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* Growth Metrics */}
        <section className="py-16">
          <div className="psyched-container">
            <h2 className="text-3xl font-bold text-psyched-darkBlue text-center mb-12">Growth Metrics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
              <div className="bg-psyched-lightBlue/10 p-6 rounded-lg text-center">
                <p className="text-5xl font-bold text-psyched-lightBlue mb-2">542%</p>
                <p className="font-medium text-psyched-darkBlue">Staffing Growth</p>
                <p className="text-sm text-gray-600">Over 4 years</p>
              </div>
              
              <div className="bg-psyched-yellow/10 p-6 rounded-lg text-center">
                <p className="text-5xl font-bold text-psyched-yellow mb-2">1,500+</p>
                <p className="font-medium text-psyched-darkBlue">Evaluations</p>
                <p className="text-sm text-gray-600">Completed to date</p>
              </div>
              
              <div className="bg-psyched-orange/10 p-6 rounded-lg text-center">
                <p className="text-5xl font-bold text-psyched-orange mb-2">90+</p>
                <p className="font-medium text-psyched-darkBlue">Staff Members</p>
                <p className="text-sm text-gray-600">Projected for 2025</p>
              </div>
              
              <div className="bg-green-100 p-6 rounded-lg text-center">
                <p className="text-5xl font-bold text-green-600 mb-2">100%</p>
                <p className="font-medium text-psyched-darkBlue">District Coverage</p>
                <p className="text-sm text-gray-600">Across all schools</p>
              </div>
            </div>
            
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-psyched-darkBlue mb-6">Staffing Growth Timeline</h3>
              
              <div className="relative pt-6">
                {/* Timeline line */}
                <div className="absolute top-0 w-full h-1 bg-gray-200"></div>
                
                {/* Timeline points */}
                <div className="flex justify-between">
                  {/* 2021 */}
                  <div className="relative">
                    <div className="absolute top-0 -mt-6 w-8 h-8 rounded-full bg-psyched-yellow flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <div className="mt-8 text-center w-24">
                      <p className="font-bold text-psyched-darkBlue">2021</p>
                      <p className="text-2xl font-bold text-psyched-yellow">14</p>
                      <p className="text-sm text-gray-600">Staff</p>
                    </div>
                  </div>
                  
                  {/* 2022 */}
                  <div className="relative">
                    <div className="absolute top-0 -mt-6 w-8 h-8 rounded-full bg-psyched-yellow flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <div className="mt-8 text-center w-24">
                      <p className="font-bold text-psyched-darkBlue">2022</p>
                      <p className="text-2xl font-bold text-psyched-yellow">22</p>
                      <p className="text-sm text-gray-600">Staff</p>
                    </div>
                  </div>
                  
                  {/* 2023 */}
                  <div className="relative">
                    <div className="absolute top-0 -mt-6 w-8 h-8 rounded-full bg-psyched-lightBlue flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <div className="mt-8 text-center w-24">
                      <p className="font-bold text-psyched-darkBlue">2023</p>
                      <p className="text-2xl font-bold text-psyched-lightBlue">35</p>
                      <p className="text-sm text-gray-600">Staff</p>
                    </div>
                  </div>
                  
                  {/* 2024 */}
                  <div className="relative">
                    <div className="absolute top-0 -mt-6 w-8 h-8 rounded-full bg-psyched-orange flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <div className="mt-8 text-center w-24">
                      <p className="font-bold text-psyched-darkBlue">2024</p>
                      <p className="text-2xl font-bold text-psyched-orange">50+</p>
                      <p className="text-sm text-gray-600">Staff</p>
                    </div>
                  </div>
                  
                  {/* 2025 */}
                  <div className="relative">
                    <div className="absolute top-0 -mt-6 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <div className="mt-8 text-center w-24">
                      <p className="font-bold text-psyched-darkBlue">2025</p>
                      <p className="text-2xl font-bold text-green-600">90+</p>
                      <p className="text-sm text-gray-600">Staff</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Strategic Implementation */}
        <section className="py-16 bg-psyched-darkBlue text-white">
          <div className="psyched-container">
            <h2 className="text-3xl font-bold text-center mb-12">Strategic Implementation</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white bg-opacity-10 p-6 rounded-lg">
                <FileText className="h-12 w-12 text-psyched-lightBlue mb-4" />
                <h3 className="text-xl font-bold mb-3">Cluster System</h3>
                <p className="text-gray-300">
                  Implemented a cluster system for efficient deployment of psychologists across multiple schools
                </p>
              </div>
              
              <div className="bg-white bg-opacity-10 p-6 rounded-lg">
                <Target className="h-12 w-12 text-psyched-lightBlue mb-4" />
                <h3 className="text-xl font-bold mb-3">Process Documentation</h3>
                <p className="text-gray-300">
                  Contributed to the development of a comprehensive psychologist handbook and district protocols
                </p>
              </div>
              
              <div className="bg-white bg-opacity-10 p-6 rounded-lg">
                <CheckCircle className="h-12 w-12 text-psyched-lightBlue mb-4" />
                <h3 className="text-xl font-bold mb-3">Multi-Layer Support</h3>
                <p className="text-gray-300">
                  Provided staff for every layer of student support, from evaluation to intervention
                </p>
              </div>
            </div>
            
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-xl mb-8">
                PsychedHire didn't just meet expectations — we exceeded them. We became a true partner in 
                Kansas City Public Schools' mission to provide excellent psychological services to all students.
              </p>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16">
          <div className="psyched-container text-center">
            <h2 className="text-3xl font-bold text-psyched-darkBlue mb-6">Ready to Scale Your School Psychology Services?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Learn how PsychedHire can help your district achieve remarkable staffing growth and service excellence
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register?role=district">
                <Button size="lg" className="bg-psyched-lightBlue text-white hover:bg-psyched-darkBlue">
                  Join as a District
                </Button>
              </Link>
              <Link to="/for-districts">
                <Button size="lg" variant="outline" className="border-psyched-lightBlue text-psyched-lightBlue hover:bg-gray-50">
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

export default KansasCityPublicSchools;
