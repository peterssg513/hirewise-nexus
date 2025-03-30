
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, FileText, Search, Award, ClipboardCheck } from 'lucide-react';

const PsychologistsLanding = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-24 bg-psyched-cream">
        <div className="psyched-container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-psyched-darkBlue mb-6">
              Empowering School Psychologists
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Find flexible opportunities that match your skills and availability while reducing administrative burden.
            </p>
            <Link to="/register?role=psychologist">
              <Button size="lg" className="bg-psyched-lightBlue text-psyched-darkBlue hover:bg-psyched-lightBlue/90">
                Join as a Psychologist <span className="ml-2">→</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16">
        <div className="psyched-container">
          <h2 className="text-3xl font-bold text-center text-psyched-darkBlue mb-12">
            Benefits for School Psychologists
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Search className="text-psyched-lightBlue h-10 w-10 mb-4" />
                  <h3 className="text-xl font-semibold text-psyched-darkBlue mb-2">
                    Find Opportunities Easily
                  </h3>
                  <p className="text-gray-600">
                    Browse and apply to opportunities that match your skills, expertise, and availability.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Calendar className="text-psyched-lightBlue h-10 w-10 mb-4" />
                  <h3 className="text-xl font-semibold text-psyched-darkBlue mb-2">
                    Flexible Scheduling
                  </h3>
                  <p className="text-gray-600">
                    Choose jobs that fit your schedule and work on your own terms.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <FileText className="text-psyched-lightBlue h-10 w-10 mb-4" />
                  <h3 className="text-xl font-semibold text-psyched-darkBlue mb-2">
                    AI-Assisted Reporting
                  </h3>
                  <p className="text-gray-600">
                    Our AI tools help streamline report writing, saving you time while maintaining quality.
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
            Streamlined Application Process
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="relative">
              <div className="bg-white rounded-lg p-6 shadow-sm h-full">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-psyched-darkBlue text-white flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold text-psyched-darkBlue mb-3 mt-2">
                  Create Your Profile
                </h3>
                <p className="text-gray-600">
                  Sign up and showcase your qualifications, experience, and availability.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-lg p-6 shadow-sm h-full">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-psyched-darkBlue text-white flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold text-psyched-darkBlue mb-3 mt-2">
                  Browse Opportunities
                </h3>
                <p className="text-gray-600">
                  Find jobs that match your skills, location preferences, and availability.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-lg p-6 shadow-sm h-full">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-psyched-darkBlue text-white flex items-center justify-center font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold text-psyched-darkBlue mb-3 mt-2">
                  Complete Evaluations
                </h3>
                <p className="text-gray-600">
                  Perform evaluations using our structured, compliance-friendly platform.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-lg p-6 shadow-sm h-full">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-psyched-darkBlue text-white flex items-center justify-center font-bold">
                  4
                </div>
                <h3 className="text-lg font-semibold text-psyched-darkBlue mb-3 mt-2">
                  Submit Reports
                </h3>
                <p className="text-gray-600">
                  Use our AI-assisted tools to generate and submit comprehensive reports.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonial Section */}
      <section className="py-16">
        <div className="psyched-container">
          <h2 className="text-3xl font-bold text-center text-psyched-darkBlue mb-12">
            What School Psychologists Say
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col">
                  <p className="italic text-gray-700 mb-6">
                    "PsychedHire! has transformed my career. I can find jobs that perfectly match my expertise and work schedule. The report-writing assistance saves me hours on each evaluation."
                  </p>
                  <div>
                    <p className="font-semibold text-psyched-darkBlue">Dr. Elizabeth Chen</p>
                    <p className="text-sm text-gray-600">School Psychologist, 8 years experience</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col">
                  <p className="italic text-gray-700 mb-6">
                    "I love the flexibility PsychedHire! offers. I can take on evaluations that fit my schedule, and the platform makes it easy to manage documentation and reporting."
                  </p>
                  <div>
                    <p className="font-semibold text-psyched-darkBlue">James Wilson, Ed.S.</p>
                    <p className="text-sm text-gray-600">School Psychologist, 5 years experience</p>
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
              Ready to Transform Your School Psychology Career?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join PsychedHire! today to find opportunities that match your skills, reduce administrative burden, and make a difference in students' lives.
            </p>
            <Link to="/register?role=psychologist">
              <Button size="lg" className="bg-psyched-lightBlue text-psyched-darkBlue hover:bg-psyched-lightBlue/90">
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

export default PsychologistsLanding;
