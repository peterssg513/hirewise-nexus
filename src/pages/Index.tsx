
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Stats from '@/components/Stats';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';
import TestimonialCarousel from '@/components/TestimonialCarousel';
import Partners from '@/components/Partners';
import WorkflowVisualization from '@/components/WorkflowVisualization';
import CaseStudies from '@/components/CaseStudies';
import AIFeatureShowcase from '@/components/AIFeatureShowcase';
import Motto from '@/components/Motto';

const Index = () => {
  return (
    <div className="min-h-screen bg-psyched-cream">
      <Navbar />
      <main>
        <Hero />
        <Motto />
        <Features />
        <AIFeatureShowcase />
        <WorkflowVisualization />
        <CaseStudies />
        <TestimonialCarousel />
        <Partners />
        <Stats />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
