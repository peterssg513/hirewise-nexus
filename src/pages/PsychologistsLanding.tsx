
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, FileText, Search, Award, ClipboardCheck, Sparkles, ArrowRight, Check, Star } from 'lucide-react';

const PsychologistsLanding = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-24 bg-gradient-to-br from-psyched-cream to-white relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-psyched-lightBlue/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-psyched-yellow/10 rounded-full blur-3xl"></div>
        
        <div className="psyched-container relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-1.5 mb-4 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                Built by School Psychologists. For School Psychologists.
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-psyched-darkBlue mb-6">
                Empowering School Psychologists
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Find flexible opportunities that match your skills and availability 
                while reducing administrative burden<span className="font-medium text-psyched-darkBlue"> — so you can focus on what matters most.</span>
              </p>
              
              <div className="flex justify-center mb-8">
                <Link to="/register?role=psychologist">
                  <Button size="lg" className="group bg-psyched-lightBlue text-psyched-darkBlue hover:bg-psyched-lightBlue/90">
                    Join as a Psychologist
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 rounded-full p-2 mr-3">
                    <Search className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-psyched-darkBlue">Find Jobs Easily</p>
                    <p className="text-sm text-gray-600">Match your skills & availability</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-full p-2 mr-3">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-psyched-darkBlue">AI-Assisted Reports</p>
                    <p className="text-sm text-gray-600">Save hours on each evaluation</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-amber-100 rounded-full p-2 mr-3">
                    <Calendar className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-psyched-darkBlue">Flexible Scheduling</p>
                    <p className="text-sm text-gray-600">Work on your own terms</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* AI Report Writing Section */}
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
      
      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="psyched-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-psyched-darkBlue mb-4">
              Benefits for School Psychologists
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              PsychedHire! was designed with your needs in mind, offering benefits that make your professional life more rewarding.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-t-4 border-t-psyched-lightBlue shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Search className="text-psyched-lightBlue h-10 w-10 mb-4" />
                  <h3 className="text-xl font-semibold text-psyched-darkBlue mb-2">
                    Find Opportunities Easily
                  </h3>
                  <p className="text-gray-600">
                    Browse and apply to opportunities that match your skills, expertise, and availability.
                  </p>
                  <ul className="mt-4 text-left space-y-2 w-full">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Advanced filtering options</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Skill-based matching</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Email alerts for new opportunities</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-t-4 border-t-psyched-yellow shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Calendar className="text-psyched-yellow h-10 w-10 mb-4" />
                  <h3 className="text-xl font-semibold text-psyched-darkBlue mb-2">
                    Flexible Scheduling
                  </h3>
                  <p className="text-gray-600">
                    Choose jobs that fit your schedule and work on your own terms.
                  </p>
                  <ul className="mt-4 text-left space-y-2 w-full">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Part-time and full-time options</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Remote and on-site positions</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Availability calendar management</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-t-4 border-t-psyched-orange shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <FileText className="text-psyched-orange h-10 w-10 mb-4" />
                  <h3 className="text-xl font-semibold text-psyched-darkBlue mb-2">
                    AI-Assisted Reporting
                  </h3>
                  <p className="text-gray-600">
                    Our AI tools help streamline report writing, saving you time while maintaining quality.
                  </p>
                  <ul className="mt-4 text-left space-y-2 w-full">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Smart templates and formatting</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Compliance checking</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Customizable to your writing style</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Process Section */}
      <section className="py-16 bg-white">
        <div className="psyched-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-psyched-darkBlue mb-4">
              Streamlined Application Process
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We've simplified every step of the process to help you find and complete assignments efficiently
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="relative">
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow h-full border-l-4 border-l-psyched-yellow">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-psyched-darkBlue text-white flex items-center justify-center font-bold shadow-lg">
                  1
                </div>
                <h3 className="text-lg font-semibold text-psyched-darkBlue mb-3 mt-2">
                  Create Your Profile
                </h3>
                <p className="text-gray-600 mb-4">
                  Sign up and showcase your qualifications, experience, and availability.
                </p>
                <ul className="text-sm space-y-1 text-gray-500">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-psyched-yellow rounded-full mr-2 flex-shrink-0"></div>
                    Upload credentials
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-psyched-yellow rounded-full mr-2 flex-shrink-0"></div>
                    Set your availability
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-psyched-yellow rounded-full mr-2 flex-shrink-0"></div>
                    Highlight your specialties
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow h-full border-l-4 border-l-psyched-lightBlue">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-psyched-darkBlue text-white flex items-center justify-center font-bold shadow-lg">
                  2
                </div>
                <h3 className="text-lg font-semibold text-psyched-darkBlue mb-3 mt-2">
                  Browse Opportunities
                </h3>
                <p className="text-gray-600 mb-4">
                  Find jobs that match your skills, location preferences, and availability.
                </p>
                <ul className="text-sm space-y-1 text-gray-500">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-psyched-lightBlue rounded-full mr-2 flex-shrink-0"></div>
                    Advanced search filters
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-psyched-lightBlue rounded-full mr-2 flex-shrink-0"></div>
                    Save favorite listings
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-psyched-lightBlue rounded-full mr-2 flex-shrink-0"></div>
                    Quick application process
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow h-full border-l-4 border-l-psyched-orange">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-psyched-darkBlue text-white flex items-center justify-center font-bold shadow-lg">
                  3
                </div>
                <h3 className="text-lg font-semibold text-psyched-darkBlue mb-3 mt-2">
                  Complete Evaluations
                </h3>
                <p className="text-gray-600 mb-4">
                  Perform evaluations using our structured, compliance-friendly platform.
                </p>
                <ul className="text-sm space-y-1 text-gray-500">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-psyched-orange rounded-full mr-2 flex-shrink-0"></div>
                    Structured protocols
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-psyched-orange rounded-full mr-2 flex-shrink-0"></div>
                    Digital data collection
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-psyched-orange rounded-full mr-2 flex-shrink-0"></div>
                    Progress tracking
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow h-full border-l-4 border-l-psyched-darkBlue">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-psyched-darkBlue text-white flex items-center justify-center font-bold shadow-lg">
                  4
                </div>
                <h3 className="text-lg font-semibold text-psyched-darkBlue mb-3 mt-2">
                  Submit Reports
                </h3>
                <p className="text-gray-600 mb-4">
                  Use our AI-assisted tools to generate and submit comprehensive reports.
                </p>
                <ul className="text-sm space-y-1 text-gray-500">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-psyched-darkBlue rounded-full mr-2 flex-shrink-0"></div>
                    AI writing assistance
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-psyched-darkBlue rounded-full mr-2 flex-shrink-0"></div>
                    Compliance verification
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-psyched-darkBlue rounded-full mr-2 flex-shrink-0"></div>
                    Secure submission
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonial Section */}
      <section className="py-16 bg-psyched-cream">
        <div className="psyched-container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-1.5 mb-4 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
              <Star className="w-4 h-4 mr-2 text-amber-500" />
              Testimonials
            </div>
            <h2 className="text-3xl font-bold text-psyched-darkBlue mb-4">
              What School Psychologists Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from professionals who have transformed their careers with PsychedHire!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="shadow-lg border-none overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="bg-psyched-lightBlue/20 p-8 md:w-1/3 flex flex-col justify-center items-center">
                    <div className="w-16 h-16 flex items-center justify-center bg-white rounded-full shadow-md mb-4">
                      <p className="font-bold text-2xl text-psyched-darkBlue">EC</p>
                    </div>
                    <p className="font-semibold text-psyched-darkBlue text-center">Dr. Elizabeth Chen</p>
                    <p className="text-sm text-gray-600 text-center">School Psychologist</p>
                    <p className="text-xs text-gray-500 text-center">8 years experience</p>
                  </div>
                  <div className="p-8 md:w-2/3">
                    <QuoteIcon className="h-8 w-8 text-psyched-yellow mb-4" />
                    <p className="italic text-gray-700 mb-6">
                      "PsychedHire! has transformed my career. I can find jobs that perfectly match my expertise and work schedule. The report-writing assistance saves me hours on each evaluation, allowing me to focus on what truly matters: helping students."
                    </p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-amber-500 fill-amber-500" />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg border-none overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="bg-psyched-orange/20 p-8 md:w-1/3 flex flex-col justify-center items-center">
                    <div className="w-16 h-16 flex items-center justify-center bg-white rounded-full shadow-md mb-4">
                      <p className="font-bold text-2xl text-psyched-darkBlue">JW</p>
                    </div>
                    <p className="font-semibold text-psyched-darkBlue text-center">James Wilson, Ed.S.</p>
                    <p className="text-sm text-gray-600 text-center">School Psychologist</p>
                    <p className="text-xs text-gray-500 text-center">5 years experience</p>
                  </div>
                  <div className="p-8 md:w-2/3">
                    <QuoteIcon className="h-8 w-8 text-psyched-yellow mb-4" />
                    <p className="italic text-gray-700 mb-6">
                      "I love the flexibility PsychedHire! offers. I can take on evaluations that fit my schedule, and the platform makes it easy to manage documentation and reporting. It's revolutionized how I approach my practice as a school psychologist."
                    </p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-amber-500 fill-amber-500" />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="psyched-container">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-psyched-lightBlue/20 to-psyched-yellow/20 rounded-xl p-8 shadow-lg">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-psyched-darkBlue mb-6">
                  Ready to Transform Your School Psychology Career?
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Join PsychedHire! today to find opportunities that match your skills, reduce administrative burden, and make a difference in students' lives.
                </p>
                <Link to="/register?role=psychologist">
                  <Button size="lg" className="group bg-psyched-lightBlue text-psyched-darkBlue hover:bg-psyched-lightBlue/90">
                    Sign Up Now 
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                
                <div className="mt-6 text-center">
                  <p className="text-psyched-darkBlue font-medium">
                    The Future of School Psychology
                  </p>
                  <p className="text-gray-600">
                    So you can focus on what matters the most
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default PsychologistsLanding;
