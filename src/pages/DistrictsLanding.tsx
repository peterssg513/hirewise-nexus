
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Search, Award, ClipboardCheck, TrendingDown } from 'lucide-react';

const DistrictsLanding = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-24 bg-psyched-cream">
        <div className="psyched-container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-psyched-darkBlue mb-6">
              Streamline School Psychology Staffing
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Find qualified psychologists quickly, reduce backlogs, and improve student support.
            </p>
            <Link to="/register?role=district">
              <Button size="lg" className="bg-psyched-orange text-white hover:bg-psyched-orange/90">
                Join as a District <span className="ml-2">→</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16">
        <div className="psyched-container">
          <h2 className="text-3xl font-bold text-center text-psyched-darkBlue mb-12">
            Benefits for School Districts
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Clock className="text-psyched-orange h-10 w-10 mb-4" />
                  <h3 className="text-xl font-semibold text-psyched-darkBlue mb-2">
                    Faster Hiring
                  </h3>
                  <p className="text-gray-600">
                    Reduce your hiring cycle by up to 75% with our streamlined matching system.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Award className="text-psyched-orange h-10 w-10 mb-4" />
                  <h3 className="text-xl font-semibold text-psyched-darkBlue mb-2">
                    Quality Candidates
                  </h3>
                  <p className="text-gray-600">
                    Access pre-screened, qualified psychologists who match your specific needs.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <TrendingDown className="text-psyched-orange h-10 w-10 mb-4" />
                  <h3 className="text-xl font-semibold text-psyched-darkBlue mb-2">
                    Backlog Reduction
                  </h3>
                  <p className="text-gray-600">
                    Clear evaluation backlogs quickly with our efficient process and qualified professionals.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Process Section */}
      <section className="py-16 bg-gray-50">
        <div className="psyched-container">
          <h2 className="text-3xl font-bold text-center text-psyched-darkBlue mb-12">
            Simplified Job Posting Process
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="relative">
              <div className="bg-white rounded-lg p-6 shadow-sm h-full">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-psyched-darkBlue text-white flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold text-psyched-darkBlue mb-3 mt-2">
                  Create District Profile
                </h3>
                <p className="text-gray-600">
                  Set up your district profile with key information and requirements.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-lg p-6 shadow-sm h-full">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-psyched-darkBlue text-white flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold text-psyched-darkBlue mb-3 mt-2">
                  Post Job Openings
                </h3>
                <p className="text-gray-600">
                  Create detailed job postings with specific requirements and timeframes.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-lg p-6 shadow-sm h-full">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-psyched-darkBlue text-white flex items-center justify-center font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold text-psyched-darkBlue mb-3 mt-2">
                  Review Applications
                </h3>
                <p className="text-gray-600">
                  Browse applications from qualified candidates and select the best matches.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-lg p-6 shadow-sm h-full">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-psyched-darkBlue text-white flex items-center justify-center font-bold">
                  4
                </div>
                <h3 className="text-lg font-semibold text-psyched-darkBlue mb-3 mt-2">
                  Access Reports
                </h3>
                <p className="text-gray-600">
                  Receive comprehensive, compliant evaluation reports through our secure platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16">
        <div className="psyched-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-psyched-orange mb-2">75%</div>
              <div className="text-gray-600">Reduction in Hiring Time</div>
            </div>
            
            <div>
              <div className="text-5xl font-bold text-psyched-orange mb-2">90%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
            
            <div>
              <div className="text-5xl font-bold text-psyched-orange mb-2">60%</div>
              <div className="text-gray-600">Reduction in Administrative Work</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonial Section */}
      <section className="py-16 bg-gray-50">
        <div className="psyched-container">
          <h2 className="text-3xl font-bold text-center text-psyched-darkBlue mb-12">
            What Districts Say
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col">
                  <p className="italic text-gray-700 mb-6">
                    "PsychedHire! has been a game-changer for our district. We've reduced our hiring time significantly and found quality psychologists who match our specific needs."
                  </p>
                  <div>
                    <p className="font-semibold text-psyched-darkBlue">Jessica Martinez</p>
                    <p className="text-sm text-gray-600">HR Director, Chicago Public Schools</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col">
                  <p className="italic text-gray-700 mb-6">
                    "The evaluation backlog that used to take months to address can now be cleared in weeks. PsychedHire! has transformed how we support our students' mental health needs."
                  </p>
                  <div>
                    <p className="font-semibold text-psyched-darkBlue">Robert Johnson</p>
                    <p className="text-sm text-gray-600">Special Education Director, Los Angeles Unified</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-psyched-cream">
        <div className="psyched-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-psyched-darkBlue mb-6">
              Ready to Transform Your District's Psychology Services?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join PsychedHire! today to streamline your hiring process, reduce backlogs, and better support your students.
            </p>
            <Link to="/register?role=district">
              <Button size="lg" className="bg-psyched-orange text-white hover:bg-psyched-orange/90">
                Sign Up Now <span className="ml-2">→</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default DistrictsLanding;
