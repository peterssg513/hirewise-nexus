
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Search, Award, ClipboardCheck, TrendingDown, Sparkles, ArrowRight, Check, Star, School, FileText } from 'lucide-react';

const DistrictsLanding = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-24 bg-gradient-to-br from-psyched-cream to-white relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-psyched-orange/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-psyched-yellow/10 rounded-full blur-3xl"></div>
        
        <div className="psyched-container relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-1.5 mb-4 bg-orange-100 text-orange-600 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                The Future of School Psychology
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-psyched-darkBlue mb-6">
                Streamline School Psychology Staffing
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Find qualified psychologists quickly, reduce backlogs, and improve student support
                <span className="font-medium text-psyched-darkBlue"> — so you can focus on what matters most.</span>
              </p>
              
              <div className="flex justify-center mb-8">
                <Link to="/register?role=district">
                  <Button size="lg" className="group bg-psyched-orange text-white hover:bg-psyched-orange/90">
                    Join as a District
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-orange-100 rounded-full p-2 mr-3">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-psyched-darkBlue">75% Faster Hiring</p>
                    <p className="text-sm text-gray-600">Reduce hiring cycles dramatically</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-full p-2 mr-3">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-psyched-darkBlue">Qualified Candidates</p>
                    <p className="text-sm text-gray-600">Pre-screened professionals</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 rounded-full p-2 mr-3">
                    <TrendingDown className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-psyched-darkBlue">Clear Backlogs</p>
                    <p className="text-sm text-gray-600">Reduce evaluation waitlists</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Case Study Section */}
      <section className="py-16 bg-white">
        <div className="psyched-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100 transform -rotate-1 z-10 relative">
                <div className="flex space-x-2 mb-4">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                
                <div className="bg-psyched-yellow/5 p-4 rounded-lg mb-4">
                  <div className="flex items-center mb-2">
                    <School className="h-5 w-5 text-psyched-orange mr-2" />
                    <h3 className="font-semibold text-psyched-darkBlue">Chicago Public Schools</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Case Study Highlights:</p>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mt-1 bg-green-100 rounded-full p-0.5 mr-2">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-700">Reduced hiring time from 8 weeks to 2 weeks</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mt-1 bg-green-100 rounded-full p-0.5 mr-2">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-700">Cleared 87% of evaluation backlog in first month</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mt-1 bg-green-100 rounded-full p-0.5 mr-2">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-700">95% satisfaction rate from hiring managers</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-psyched-lightBlue/5 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <School className="h-5 w-5 text-psyched-lightBlue mr-2" />
                    <h3 className="font-semibold text-psyched-darkBlue">NYC DOE</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Case Study Highlights:</p>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mt-1 bg-green-100 rounded-full p-0.5 mr-2">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-700">60% reduction in administrative workload</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mt-1 bg-green-100 rounded-full p-0.5 mr-2">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-700">40% more time spent directly with students</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mt-1 bg-green-100 rounded-full p-0.5 mr-2">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-700">Compliance rate increased to 98%</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="absolute top-8 -right-8 -z-10 w-full h-full bg-psyched-orange/20 rounded-lg"></div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center px-3 py-1 mb-4 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                Success Stories
              </div>
              <h2 className="text-3xl font-bold text-psyched-darkBlue mb-6">
                Real Results for Real Districts
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                School districts across the country are transforming their psychology services with PsychedHire!
                See how we're helping them overcome challenges and better serve students.
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <div className="flex-shrink-0 mr-3 mt-1 bg-psyched-orange/20 rounded-full p-1.5">
                    <Clock className="h-5 w-5 text-psyched-orange" />
                  </div>
                  <div>
                    <span className="font-medium text-psyched-darkBlue text-lg">Drastically Reduced Hiring Time</span>
                    <p className="text-gray-600 mt-1">
                      Districts report cutting their psychologist hiring time by an average of 75%
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mr-3 mt-1 bg-psyched-orange/20 rounded-full p-1.5">
                    <FileText className="h-5 w-5 text-psyched-orange" />
                  </div>
                  <div>
                    <span className="font-medium text-psyched-darkBlue text-lg">Evaluation Backlog Reduction</span>
                    <p className="text-gray-600 mt-1">
                      Our district partners clear evaluation backlogs in weeks rather than months
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mr-3 mt-1 bg-psyched-orange/20 rounded-full p-1.5">
                    <Award className="h-5 w-5 text-psyched-orange" />
                  </div>
                  <div>
                    <span className="font-medium text-psyched-darkBlue text-lg">Higher Quality Support</span>
                    <p className="text-gray-600 mt-1">
                      Better matched psychologists mean better support for your students
                    </p>
                  </div>
                </li>
              </ul>
              
              <Link to="/register?role=district">
                <Button className="group bg-psyched-orange text-white hover:bg-psyched-orange/90">
                  See More Success Stories
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="psyched-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-psyched-darkBlue mb-4">
              Benefits for School Districts
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              PsychedHire! provides comprehensive solutions to your school psychology staffing challenges.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-t-4 border-t-psyched-orange shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Clock className="text-psyched-orange h-10 w-10 mb-4" />
                  <h3 className="text-xl font-semibold text-psyched-darkBlue mb-2">
                    Faster Hiring
                  </h3>
                  <p className="text-gray-600">
                    Reduce your hiring cycle by up to 75% with our streamlined matching system.
                  </p>
                  <ul className="mt-4 text-left space-y-2 w-full">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Simplified job posting process</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Pre-screened candidates</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Rapid application review</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-t-4 border-t-psyched-yellow shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Award className="text-psyched-yellow h-10 w-10 mb-4" />
                  <h3 className="text-xl font-semibold text-psyched-darkBlue mb-2">
                    Quality Candidates
                  </h3>
                  <p className="text-gray-600">
                    Access pre-screened, qualified psychologists who match your specific needs.
                  </p>
                  <ul className="mt-4 text-left space-y-2 w-full">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Verified credentials and experience</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Skill-based matching</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Background checks included</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-t-4 border-t-psyched-lightBlue shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <TrendingDown className="text-psyched-lightBlue h-10 w-10 mb-4" />
                  <h3 className="text-xl font-semibold text-psyched-darkBlue mb-2">
                    Backlog Reduction
                  </h3>
                  <p className="text-gray-600">
                    Clear evaluation backlogs quickly with our efficient process and qualified professionals.
                  </p>
                  <ul className="mt-4 text-left space-y-2 w-full">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Streamlined evaluation workflows</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">AI-assisted report generation</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Compliance monitoring</span>
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
              Simplified Job Posting Process
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We've streamlined every step from posting to report delivery
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="relative">
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow h-full border-l-4 border-l-psyched-orange">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-psyched-darkBlue text-white flex items-center justify-center font-bold shadow-lg">
                  1
                </div>
                <h3 className="text-lg font-semibold text-psyched-darkBlue mb-3 mt-2">
                  Create District Profile
                </h3>
                <p className="text-gray-600 mb-4">
                  Set up your district profile with key information and requirements.
                </p>
                <ul className="text-sm space-y-1 text-gray-500">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-psyched-orange rounded-full mr-2 flex-shrink-0"></div>
                    District information
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-psyched-orange rounded-full mr-2 flex-shrink-0"></div>
                    Compliance requirements
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-psyched-orange rounded-full mr-2 flex-shrink-0"></div>
                    Admin user management
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow h-full border-l-4 border-l-psyched-yellow">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-psyched-darkBlue text-white flex items-center justify-center font-bold shadow-lg">
                  2
                </div>
                <h3 className="text-lg font-semibold text-psyched-darkBlue mb-3 mt-2">
                  Post Job Openings
                </h3>
                <p className="text-gray-600 mb-4">
                  Create detailed job postings with specific requirements and timeframes.
                </p>
                <ul className="text-sm space-y-1 text-gray-500">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-psyched-yellow rounded-full mr-2 flex-shrink-0"></div>
                    Intuitive job form
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-psyched-yellow rounded-full mr-2 flex-shrink-0"></div>
                    Skills specification
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-psyched-yellow rounded-full mr-2 flex-shrink-0"></div>
                    Timeline definition
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow h-full border-l-4 border-l-psyched-lightBlue">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-psyched-darkBlue text-white flex items-center justify-center font-bold shadow-lg">
                  3
                </div>
                <h3 className="text-lg font-semibold text-psyched-darkBlue mb-3 mt-2">
                  Review Applications
                </h3>
                <p className="text-gray-600 mb-4">
                  Browse applications from qualified candidates and select the best matches.
                </p>
                <ul className="text-sm space-y-1 text-gray-500">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-psyched-lightBlue rounded-full mr-2 flex-shrink-0"></div>
                    Candidate comparison
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-psyched-lightBlue rounded-full mr-2 flex-shrink-0"></div>
                    Credential verification
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-psyched-lightBlue rounded-full mr-2 flex-shrink-0"></div>
                    Interview scheduling
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
                  Access Reports
                </h3>
                <p className="text-gray-600 mb-4">
                  Receive comprehensive, compliant evaluation reports through our secure platform.
                </p>
                <ul className="text-sm space-y-1 text-gray-500">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-psyched-darkBlue rounded-full mr-2 flex-shrink-0"></div>
                    Secure document access
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-psyched-darkBlue rounded-full mr-2 flex-shrink-0"></div>
                    Compliance verification
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-psyched-darkBlue rounded-full mr-2 flex-shrink-0"></div>
                    Digital record keeping
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 bg-psyched-cream">
        <div className="psyched-container">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-psyched-darkBlue mb-4">
              PsychedHire! By The Numbers
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our impact on school districts nationwide
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-5xl font-bold text-psyched-orange mb-2">75%</div>
              <div className="text-gray-600 font-medium">Reduction in Hiring Time</div>
              <p className="text-sm text-gray-500 mt-2">Average across all district partners</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-5xl font-bold text-psyched-orange mb-2">90%</div>
              <div className="text-gray-600 font-medium">Satisfaction Rate</div>
              <p className="text-sm text-gray-500 mt-2">From district administrators</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-5xl font-bold text-psyched-orange mb-2">60%</div>
              <div className="text-gray-600 font-medium">Reduction in Admin Work</div>
              <p className="text-sm text-gray-500 mt-2">Through streamlined processes</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonial Section */}
      <section className="py-16 bg-white">
        <div className="psyched-container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-1.5 mb-4 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
              <Star className="w-4 h-4 mr-2 text-amber-500" />
              Testimonials
            </div>
            <h2 className="text-3xl font-bold text-psyched-darkBlue mb-4">
              What Districts Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from the districts who have transformed their psychology services with PsychedHire!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="shadow-lg border-none overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="bg-psyched-orange/20 p-8 md:w-1/3 flex flex-col justify-center items-center">
                    <div className="w-16 h-16 flex items-center justify-center bg-white rounded-full shadow-md mb-4">
                      <p className="font-bold text-2xl text-psyched-darkBlue">JM</p>
                    </div>
                    <p className="font-semibold text-psyched-darkBlue text-center">Jessica Martinez</p>
                    <p className="text-sm text-gray-600 text-center">HR Director</p>
                    <p className="text-xs text-gray-500 text-center">Chicago Public Schools</p>
                  </div>
                  <div className="p-8 md:w-2/3">
                    <QuoteIcon className="h-8 w-8 text-psyched-yellow mb-4" />
                    <p className="italic text-gray-700 mb-6">
                      "PsychedHire! has been a game-changer for our district. We've reduced our hiring time significantly and found quality psychologists who match our specific needs. The platform is intuitive and has streamlined our entire process."
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
                  <div className="bg-psyched-yellow/20 p-8 md:w-1/3 flex flex-col justify-center items-center">
                    <div className="w-16 h-16 flex items-center justify-center bg-white rounded-full shadow-md mb-4">
                      <p className="font-bold text-2xl text-psyched-darkBlue">RJ</p>
                    </div>
                    <p className="font-semibold text-psyched-darkBlue text-center">Robert Johnson</p>
                    <p className="text-sm text-gray-600 text-center">Special Education Director</p>
                    <p className="text-xs text-gray-500 text-center">Los Angeles Unified</p>
                  </div>
                  <div className="p-8 md:w-2/3">
                    <QuoteIcon className="h-8 w-8 text-psyched-yellow mb-4" />
                    <p className="italic text-gray-700 mb-6">
                      "The evaluation backlog that used to take months to address can now be cleared in weeks. PsychedHire! has transformed how we support our students' mental health needs and has given us access to top-quality professionals."
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
      <section className="py-16 bg-gradient-to-br from-psyched-cream to-white">
        <div className="psyched-container">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-psyched-darkBlue mb-6">
                  Ready to Transform Your District's Psychology Services?
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Join PsychedHire! today to streamline your hiring process, reduce backlogs, and better support your students.
                </p>
                <Link to="/register?role=district">
                  <Button size="lg" className="group bg-psyched-orange text-white hover:bg-psyched-orange/90">
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

export default DistrictsLanding;
