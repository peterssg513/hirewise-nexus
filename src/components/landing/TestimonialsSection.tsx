
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Quote, Star } from 'lucide-react';

interface TestimonialProps {
  initials: string;
  name: string;
  role: string;
  organization: string;
  quote: string;
  bgColor: string;
}

interface TestimonialsSectionProps {
  title: string;
  subtitle: string;
  badge: string;
  testimonials: TestimonialProps[];
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ title, subtitle, badge, testimonials }) => {
  return (
    <section className="py-16 bg-psyched-cream">
      <div className="psyched-container">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-1.5 mb-4 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
            <Star className="w-4 h-4 mr-2 text-amber-500" />
            {badge}
          </div>
          <h2 className="text-3xl font-bold text-psyched-darkBlue mb-4">
            {title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="shadow-lg border-none overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className={`${testimonial.bgColor} p-8 md:w-1/3 flex flex-col justify-center items-center`}>
                    <div className="w-16 h-16 flex items-center justify-center bg-white rounded-full shadow-md mb-4">
                      <p className="font-bold text-2xl text-psyched-darkBlue">{testimonial.initials}</p>
                    </div>
                    <p className="font-semibold text-psyched-darkBlue text-center">{testimonial.name}</p>
                    <p className="text-sm text-gray-600 text-center">{testimonial.role}</p>
                    <p className="text-xs text-gray-500 text-center">{testimonial.organization}</p>
                  </div>
                  <div className="p-8 md:w-2/3">
                    <Quote className="h-8 w-8 text-psyched-yellow mb-4" />
                    <p className="italic text-gray-700 mb-6">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-amber-500 fill-amber-500" />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
