
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Check, LucideIcon } from 'lucide-react';

interface BenefitItemProps {
  icon: LucideIcon;
  iconColor: string;
  borderColor: string;
  title: string;
  description: string;
  features: string[];
}

interface BenefitsSectionProps {
  title: string;
  subtitle: string;
  benefits: BenefitItemProps[];
}

const BenefitsSection: React.FC<BenefitsSectionProps> = ({ title, subtitle, benefits }) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="psyched-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-psyched-darkBlue mb-4">
            {title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const BenefitIcon = benefit.icon;
            return (
              <Card key={index} className={`border-t-4 ${benefit.borderColor} shadow-md hover:shadow-lg transition-shadow`}>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <BenefitIcon className={`${benefit.iconColor} h-10 w-10 mb-4`} />
                    <h3 className="text-xl font-semibold text-psyched-darkBlue mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600">
                      {benefit.description}
                    </p>
                    <ul className="mt-4 text-left space-y-2 w-full">
                      {benefit.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
