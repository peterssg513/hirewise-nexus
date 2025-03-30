
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

const Index = () => {
  return (
    <div className="min-h-screen bg-psyched-cream">
      <Navbar />
      <main>
        <Hero />
        <WorkflowVisualization />
        <Features />
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
