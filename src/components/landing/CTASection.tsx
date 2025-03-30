
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface CTASectionProps {
  title: string;
  description: string;
  ctaLink: string;
  ctaText: string;
  ctaBgColor: string;
  ctaTextColor: string;
  bgGradient?: string;
}

const CTASection: React.FC<CTASectionProps> = ({ 
  title, 
  description, 
  ctaLink, 
  ctaText,
  ctaBgColor,
  ctaTextColor,
  bgGradient = "bg-gradient-to-br from-psyched-cream to-white"
}) => {
  return (
    <section className={`py-16 ${bgGradient}`}>
      <div className="psyched-container">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-psyched-darkBlue mb-6">
                {title}
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                {description}
              </p>
              <Link to={ctaLink}>
                <Button size="lg" className={`group ${ctaBgColor} ${ctaTextColor} hover:${ctaBgColor}/90`}>
                  {ctaText}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              
              <div className="mt-6 text-center">
                <p className="text-psyched-darkBlue font-medium">
                  Built by School Psychologists
                </p>
                <p className="text-gray-600">
                  For School Psychologists
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
