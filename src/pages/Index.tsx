import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Motto from '@/components/Motto';
import AIFeatureShowcase from '@/components/AIFeatureShowcase';
import WorkflowVisualization from '@/components/WorkflowVisualization';
import Stats from '@/components/Stats';
import TestimonialCarousel from '@/components/TestimonialCarousel';
import Partners from '@/components/Partners';
import CaseStudies from '@/components/CaseStudies';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from 'lucide-react';
const Index = () => {
  return <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <Motto />
      <AIFeatureShowcase />
      <WorkflowVisualization />
      <Stats />
      <TestimonialCarousel />
      <Partners />
      <CaseStudies />
      <CallToAction />
      
      {/* Links to alternative designs */}
      
      
      <Footer />
    </div>;
};
export default Index;