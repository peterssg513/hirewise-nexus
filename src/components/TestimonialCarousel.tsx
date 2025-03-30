
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { QuoteIcon } from 'lucide-react';

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  organization: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "PsychedHire! has transformed how we find qualified school psychologists. We've reduced our hiring time by 75% and improved the quality of our matches.",
    author: "Sarah Johnson",
    role: "HR Director",
    organization: "Chicago Public Schools"
  },
  {
    id: 2,
    quote: "As a school psychologist, I've found incredible opportunities through PsychedHire! that align perfectly with my expertise and availability.",
    author: "Michael Rodriguez",
    role: "School Psychologist",
    organization: "Los Angeles Unified"
  },
  {
    id: 3,
    quote: "The platform's evaluation and reporting features have dramatically reduced our administrative workload while improving compliance.",
    author: "Jennifer Williams",
    role: "Special Education Director",
    organization: "NYC DOE"
  },
];

const TestimonialCarousel = () => {
  return (
    <section className="py-16 bg-white">
      <div className="psyched-container">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-psyched-darkBlue mb-12">
          What Our Users Say
        </h2>
        
        <Carousel className="max-w-4xl mx-auto">
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id}>
                <Card className="border-none shadow-none">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <QuoteIcon size={32} className="text-psyched-yellow mb-4" />
                      <p className="text-lg md:text-xl text-gray-700 mb-6 italic">
                        "{testimonial.quote}"
                      </p>
                      <div>
                        <p className="font-semibold text-psyched-darkBlue">
                          {testimonial.author}
                        </p>
                        <p className="text-sm text-gray-600">
                          {testimonial.role}, {testimonial.organization}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="sm:-left-8 md:-left-12" />
          <CarouselNext className="sm:-right-8 md:-right-12" />
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialCarousel;
