
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, Star } from 'lucide-react';

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  organization: string;
  rating: number;
  image?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "PsychedHire was the difference between scrambling and succeeding. Their speed and quality changed everything. We went from imminent staffing gaps to having over 100 professionals across our psychological service lines.",
    author: "Leadership Team",
    role: "Administration",
    organization: "Denver Public Schools",
    rating: 5
  },
  {
    id: 2,
    quote: "Thanks to PsychedHire, we scaled faster than we ever imagined — and with the right people. We achieved 542% staffing growth in just 4 years, going from 14 staff to over 90 specialized professionals.",
    author: "District Office",
    role: "Special Education Department",
    organization: "Kansas City Public Schools",
    rating: 5
  },
  {
    id: 3,
    quote: "The platform's evaluation and reporting features have dramatically reduced our administrative workload while improving compliance. We've been able to clear our evaluation backlog and provide timely services to students. PsychedHire! truly understands the needs of school psychologists.",
    author: "Jennifer Williams",
    role: "Special Education Director",
    organization: "NYC DOE",
    rating: 5
  },
  {
    id: 4,
    quote: "I was skeptical at first, but PsychedHire! has exceeded all my expectations. The quality of candidates I've found through the platform is outstanding, and the streamlined application process makes it easy to find the right opportunities that match my schedule and expertise.",
    author: "David Thompson",
    role: "School Psychologist",
    organization: "Atlanta Public Schools",
    rating: 5
  },
];

const TestimonialCarousel = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-white to-psyched-cream">
      <div className="psyched-container">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-1.5 mb-4 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
            <Star className="w-4 h-4 mr-2 text-amber-500" />
            Success Stories
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-psyched-darkBlue mb-4">
            What Our Users Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from the districts and psychologists who are transforming school psychology with PsychedHire!
          </p>
        </div>
        
        <Carousel className="max-w-5xl mx-auto">
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/2">
                <div className="p-1">
                  <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                          <Quote size={24} className="text-psyched-yellow" />
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={16} 
                                className={i < testimonial.rating ? "fill-psyched-yellow text-psyched-yellow" : "text-gray-300"} 
                              />
                            ))}
                          </div>
                        </div>
                        
                        <p className="text-base text-gray-700 mb-6 flex-grow">
                          "{testimonial.quote}"
                        </p>
                        
                        <div className="mt-auto pt-4 border-t border-gray-100">
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
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="sm:-left-8 md:-left-12 -translate-y-1/2" />
          <CarouselNext className="sm:-right-8 md:-right-12 -translate-y-1/2" />
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialCarousel;
