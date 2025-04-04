
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Sparkles, Calendar, FileText, Search } from 'lucide-react';
import HeroSection from '@/components/landing/HeroSection';
import BenefitsSection from '@/components/landing/BenefitsSection';
import ProcessSection from '@/components/landing/ProcessSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import CTASection from '@/components/landing/CTASection';
import AIReportSection from '@/components/landing/AIReportSection';
import { setupPsychologistLandingData } from '@/data/psychologistLandingData';

const PsychologistsLanding = () => {
  const { heroStats, benefits, processSteps, testimonials } = setupPsychologistLandingData();

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
      
      <AIReportSection />
      
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
        title="What Districts Say About Our Psychologists"
        subtitle="Hear from the districts who have transformed their staffing with PsychedHire!"
        badge="Success Stories"
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
