
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
import { ArrowRight } from 'lucide-react';

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
      
      {/* Link to AI-inspired design */}
      <div className="bg-gray-50 py-8 text-center">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Looking for something different?</h3>
        <div className="flex justify-center space-x-4">
          <Link to="/ai-inspired-design">
            <Button variant="outline" className="border-purple-500 text-purple-600 hover:bg-purple-50 flex items-center gap-2">
              View AI-Inspired Design
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
