
import React, { ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { ArrowRight, LucideIcon } from 'lucide-react';

interface StatProps {
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  title: string;
  description: string;
}

interface HeroSectionProps {
  badge: string;
  badgeIcon: LucideIcon;
  badgeBgColor: string;
  badgeTextColor: string;
  title: string;
  description: string;
  ctaLink: string;
  ctaText: string;
  ctaBgColor: string;
  ctaTextColor: string;
  stats: StatProps[];
}

const HeroSection: React.FC<HeroSectionProps> = ({
  badge,
  badgeIcon: BadgeIcon,
  badgeBgColor,
  badgeTextColor,
  title,
  description,
  ctaLink,
  ctaText,
  ctaBgColor,
  ctaTextColor,
  stats
}) => {
  return (
    <section className="pt-20 pb-24 bg-gradient-to-br from-psyched-cream to-white relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-psyched-lightBlue/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-psyched-yellow/10 rounded-full blur-3xl"></div>
      
      <div className="psyched-container relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <div className={`inline-flex items-center px-4 py-1.5 mb-4 ${badgeBgColor} ${badgeTextColor} rounded-full text-sm font-medium`}>
              <BadgeIcon className="w-4 h-4 mr-2" />
              {badge}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-psyched-darkBlue mb-6">
              {title}
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {description}
            </p>
            
            <div className="flex justify-center mb-8">
              <Link to={ctaLink}>
                <Button size="lg" className={`group ${ctaBgColor} ${ctaTextColor} hover:${ctaBgColor}/90`}>
                  {ctaText}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.map((stat, index) => {
                const StatIcon = stat.icon;
                return (
                  <div key={index} className="flex items-center">
                    <div className={`flex-shrink-0 ${stat.bgColor} rounded-full p-2 mr-3`}>
                      <StatIcon className={`h-5 w-5 ${stat.iconColor}`} />
                    </div>
                    <div>
                      <p className="font-medium text-psyched-darkBlue">{stat.title}</p>
                      <p className="text-sm text-gray-600">{stat.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
