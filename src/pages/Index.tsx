
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
  return (
    <div className="min-h-screen bg-white">
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
      <div className="bg-gray-50 py-8 text-center">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Looking for something different?</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/ai-inspired-design">
            <Button variant="outline" className="border-psyched-purple text-psyched-purple hover:bg-psyched-purple/10 flex items-center gap-2">
              View AI-Inspired Design
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/third-landing-page">
            <Button variant="outline" className="border-psyched-indigo text-psyched-indigo hover:bg-psyched-indigo/10 flex items-center gap-2">
              Third Landing Page
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/brand-guide">
            <Button variant="outline" className="border-psyched-lightPurple text-psyched-lightPurple hover:bg-psyched-lightPurple/10 flex items-center gap-2">
              Brand Guide
              <Sparkles className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
