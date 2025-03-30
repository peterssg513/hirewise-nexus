
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Sparkles, Calendar, FileText, Search, Award, ClipboardCheck, Check, Quote } from 'lucide-react';
import HeroSection from '@/components/landing/HeroSection';
import BenefitsSection from '@/components/landing/BenefitsSection';
import ProcessSection from '@/components/landing/ProcessSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import CTASection from '@/components/landing/CTASection';

const PsychologistsLanding = () => {
  const heroStats = [
    {
      icon: Search,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
      title: "Find Jobs Easily",
      description: "Match your skills & availability"
    },
    {
      icon: FileText,
      iconColor: "text-green-600",
      bgColor: "bg-green-100",
      title: "AI-Assisted Reports",
      description: "Save hours on each evaluation"
    },
    {
      icon: Calendar,
      iconColor: "text-amber-600",
      bgColor: "bg-amber-100",
      title: "Flexible Scheduling",
      description: "Work on your own terms"
    }
  ];

  const benefits = [
    {
      icon: Search,
      iconColor: "text-psyched-lightBlue",
      borderColor: "border-t-psyched-lightBlue",
      title: "Find Opportunities Easily",
      description: "Browse and apply to opportunities that match your skills, expertise, and availability.",
      features: [
        "Advanced filtering options",
        "Skill-based matching",
        "Email alerts for new opportunities"
      ]
    },
    {
      icon: Calendar,
      iconColor: "text-psyched-yellow",
      borderColor: "border-t-psyched-yellow",
      title: "Flexible Scheduling",
      description: "Choose jobs that fit your schedule and work on your own terms.",
      features: [
        "Part-time and full-time options",
        "Remote and on-site positions",
        "Availability calendar management"
      ]
    },
    {
      icon: FileText,
      iconColor: "text-psyched-orange",
      borderColor: "border-t-psyched-orange",
      title: "AI-Assisted Reporting",
      description: "Our AI tools help streamline report writing, saving you time while maintaining quality.",
      features: [
        "Smart templates and formatting",
        "Compliance checking",
        "Customizable to your writing style"
      ]
    }
  ];

  const processSteps = [
    {
      number: 1,
      title: "Create Your Profile",
      description: "Sign up and showcase your qualifications, experience, and availability.",
      features: [
        "Upload credentials",
        "Set your availability",
        "Highlight your specialties"
      ],
      borderColor: "border-l-psyched-yellow",
      dotColor: "bg-psyched-yellow"
    },
    {
      number: 2,
      title: "Browse Opportunities",
      description: "Find jobs that match your skills, location preferences, and availability.",
      features: [
        "Advanced search filters",
        "Save favorite listings",
        "Quick application process"
      ],
      borderColor: "border-l-psyched-lightBlue",
      dotColor: "bg-psyched-lightBlue"
    },
    {
      number: 3,
      title: "Complete Evaluations",
      description: "Perform evaluations using our structured, compliance-friendly platform.",
      features: [
        "Structured protocols",
        "Digital data collection",
        "Progress tracking"
      ],
      borderColor: "border-l-psyched-orange",
      dotColor: "bg-psyched-orange"
    },
    {
      number: 4,
      title: "Submit Reports",
      description: "Use our AI-assisted tools to generate and submit comprehensive reports.",
      features: [
        "AI writing assistance",
        "Compliance verification",
        "Secure submission"
      ],
      borderColor: "border-l-psyched-darkBlue",
      dotColor: "bg-psyched-darkBlue"
    }
  ];

  const testimonials = [
    {
      initials: "EC",
      name: "Dr. Elizabeth Chen",
      role: "School Psychologist",
      organization: "8 years experience",
      quote: "PsychedHire! has transformed my career. I can find jobs that perfectly match my expertise and work schedule. The report-writing assistance saves me hours on each evaluation, allowing me to focus on what truly matters: helping students.",
      bgColor: "bg-psyched-lightBlue/20"
    },
    {
      initials: "JW",
      name: "James Wilson, Ed.S.",
      role: "School Psychologist",
      organization: "5 years experience",
      quote: "I love the flexibility PsychedHire! offers. I can take on evaluations that fit my schedule, and the platform makes it easy to manage documentation and reporting. It's revolutionized how I approach my practice as a school psychologist.",
      bgColor: "bg-psyched-orange/20"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <HeroSection 
        badge="Built by School Psychologists. For School Psychologists."
        badgeIcon={Sparkles}
        badgeBgColor="bg-blue-100"
        badgeTextColor="text-blue-600"
        title="Empowering School Psychologists"
        description="Find flexible opportunities that match your skills and availability while reducing administrative burden — so you can focus on what matters most."
        ctaLink="/register?role=psychologist"
        ctaText="Join as a Psychologist"
        ctaBgColor="bg-psyched-lightBlue"
        ctaTextColor="text-psyched-darkBlue"
        stats={heroStats}
      />
      
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
      
      <BenefitsSection 
        title="Benefits for School Psychologists"
        subtitle="PsychedHire! was designed with your needs in mind, offering benefits that make your professional life more rewarding."
        benefits={benefits}
      />
      
      <ProcessSection 
        title="Streamlined Application Process"
        subtitle="We've simplified every step of the process to help you find and complete assignments efficiently"
        steps={processSteps}
      />
      
      <TestimonialsSection 
        title="What School Psychologists Say"
        subtitle="Hear from professionals who have transformed their careers with PsychedHire!"
        badge="Testimonials"
        testimonials={testimonials}
      />
      
      <CTASection 
        title="Ready to Transform Your School Psychology Career?"
        description="Join PsychedHire! today to find opportunities that match your skills, reduce administrative burden, and make a difference in students' lives."
        ctaLink="/register?role=psychologist"
        ctaText="Sign Up Now"
        ctaBgColor="bg-psyched-lightBlue"
        ctaTextColor="text-psyched-darkBlue"
      />
      
      <Footer />
    </div>
  );
};

export default PsychologistsLanding;
