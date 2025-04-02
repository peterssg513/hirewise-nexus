import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Clock, Search, Award, TrendingDown, School, FileText, Sparkles, Check } from 'lucide-react';
import HeroSection from '@/components/landing/HeroSection';
import BenefitsSection from '@/components/landing/BenefitsSection';
import ProcessSection from '@/components/landing/ProcessSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import CTASection from '@/components/landing/CTASection';

const DistrictsLanding = () => {
  const heroStats = [
    {
      icon: Clock,
      iconColor: "text-orange-600",
      bgColor: "bg-orange-100",
      title: "75% Faster Hiring",
      description: "Reduce hiring cycles dramatically"
    },
    {
      icon: Award,
      iconColor: "text-green-600",
      bgColor: "bg-green-100",
      title: "Qualified Candidates",
      description: "Pre-screened professionals"
    },
    {
      icon: TrendingDown,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
      title: "Clear Backlogs",
      description: "Reduce evaluation waitlists"
    }
  ];

  const benefits = [
    {
      icon: Clock,
      iconColor: "text-psyched-orange",
      borderColor: "border-t-psyched-orange",
      title: "Faster Hiring",
      description: "Reduce your hiring cycle by up to 75% with our streamlined matching system.",
      features: [
        "Simplified job posting process",
        "Pre-screened candidates",
        "Rapid application review"
      ]
    },
    {
      icon: Award,
      iconColor: "text-psyched-yellow",
      borderColor: "border-t-psyched-yellow",
      title: "Quality Candidates",
      description: "Access pre-screened, qualified psychologists who match your specific needs.",
      features: [
        "Verified credentials and experience",
        "Skill-based matching",
        "Background checks included"
      ]
    },
    {
      icon: TrendingDown,
      iconColor: "text-psyched-lightBlue",
      borderColor: "border-t-psyched-lightBlue",
      title: "Backlog Reduction",
      description: "Clear evaluation backlogs quickly with our efficient process and qualified professionals.",
      features: [
        "Streamlined evaluation workflows",
        "AI-assisted report generation",
        "Compliance monitoring"
      ]
    }
  ];

  const processSteps = [
    {
      number: 1,
      title: "Create District Profile",
      description: "Set up your district profile with key information and requirements.",
      features: [
        "District information",
        "Compliance requirements",
        "Admin user management"
      ],
      borderColor: "border-l-psyched-orange",
      dotColor: "bg-psyched-orange"
    },
    {
      number: 2,
      title: "Post Job Openings",
      description: "Create detailed job postings with specific requirements and timeframes.",
      features: [
        "Intuitive job form",
        "Skills specification",
        "Timeline definition"
      ],
      borderColor: "border-l-psyched-yellow",
      dotColor: "bg-psyched-yellow"
    },
    {
      number: 3,
      title: "Review Applications",
      description: "Browse applications from qualified candidates and select the best matches.",
      features: [
        "Candidate comparison",
        "Credential verification",
        "Interview scheduling"
      ],
      borderColor: "border-l-psyched-lightBlue",
      dotColor: "bg-psyched-lightBlue"
    },
    {
      number: 4,
      title: "Access Reports",
      description: "Receive comprehensive, compliant evaluation reports through our secure platform.",
      features: [
        "Secure document access",
        "Compliance verification",
        "Digital record keeping"
      ],
      borderColor: "border-l-psyched-darkBlue",
      dotColor: "bg-psyched-darkBlue"
    }
  ];

  const testimonials = [
    {
      initials: "DPS",
      name: "Leadership Team",
      role: "Administration",
      organization: "Denver Public Schools",
      quote: "PsychedHire was the difference between scrambling and succeeding. Their speed and quality changed everything. We went from imminent staffing gaps to having over 100 professionals across our psychological service lines.",
      bgColor: "bg-psyched-orange/20",
      slug: "denver-public-schools"
    },
    {
      initials: "KC",
      name: "District Office",
      role: "Special Education Department",
      organization: "Kansas City Public Schools",
      quote: "Thanks to PsychedHire, we scaled faster than we ever imagined — and with the right people. We achieved 542% staffing growth in just 4 years, going from 14 staff to over 90 specialized professionals.",
      bgColor: "bg-psyched-yellow/20",
      slug: "kansas-city-public-schools"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <HeroSection 
        badge="The Future of School Psychology"
        badgeIcon={Sparkles}
        badgeBgColor="bg-orange-100"
        badgeTextColor="text-orange-600"
        title="Streamline School Psychology Staffing"
        description="Find qualified psychologists quickly, reduce backlogs, and improve student support — so you can focus on what matters most."
        ctaLink="/register?role=district"
        ctaText="Join as a District"
        ctaBgColor="bg-psyched-orange"
        ctaTextColor="text-white"
        stats={heroStats}
      />
      
      {/* Case Study Section */}
      <section className="py-16 bg-white">
        <div className="psyched-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100 transform -rotate-1 z-10 relative">
                <div className="flex space-x-2 mb-4">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                
                <div className="bg-psyched-yellow/5 p-4 rounded-lg mb-4">
                  <div className="flex items-center mb-2">
                    <School className="h-5 w-5 text-psyched-orange mr-2" />
                    <h3 className="font-semibold text-psyched-darkBlue">Denver Public Schools</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Case Study Highlights:</p>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mt-1 bg-green-100 rounded-full p-0.5 mr-2">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-700">Transformed staffing shortages into 100+ professionals</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mt-1 bg-green-100 rounded-full p-0.5 mr-2">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-700">Rapidly scaled over 3 academic years</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mt-1 bg-green-100 rounded-full p-0.5 mr-2">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-700">Long-term staffing partnership</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-psyched-lightBlue/5 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <School className="h-5 w-5 text-psyched-lightBlue mr-2" />
                    <h3 className="font-semibold text-psyched-darkBlue">Kansas City Public Schools</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Case Study Highlights:</p>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mt-1 bg-green-100 rounded-full p-0.5 mr-2">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-700">542% staffing growth in 4 years</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mt-1 bg-green-100 rounded-full p-0.5 mr-2">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-700">Over 1,500 evaluations completed</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mt-1 bg-green-100 rounded-full p-0.5 mr-2">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-700">Became exclusive psychology partner</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="absolute top-8 -right-8 -z-10 w-full h-full bg-psyched-orange/20 rounded-lg"></div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center px-3 py-1 mb-4 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                Case Studies
              </div>
              <h2 className="text-3xl font-bold text-psyched-darkBlue mb-6">
                Real Results for Real Districts
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                School districts across the country are transforming their psychology services with PsychedHire!
                See how we're helping them overcome challenges and better serve students.
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <div className="flex-shrink-0 mr-3 mt-1 bg-psyched-orange/20 rounded-full p-1.5">
                    <Clock className="h-5 w-5 text-psyched-orange" />
                  </div>
                  <div>
                    <span className="font-medium text-psyched-darkBlue text-lg">Rapid Staffing Solutions</span>
                    <p className="text-gray-600 mt-1">
                      Turn staffing gaps into comprehensive coverage with our rapid response team
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mr-3 mt-1 bg-psyched-orange/20 rounded-full p-1.5">
                    <FileText className="h-5 w-5 text-psyched-orange" />
                  </div>
                  <div>
                    <span className="font-medium text-psyched-darkBlue text-lg">Sustainable Growth</span>
                    <p className="text-gray-600 mt-1">
                      Build lasting partnerships that grow with your district's needs year after year
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mr-3 mt-1 bg-psyched-orange/20 rounded-full p-1.5">
                    <Award className="h-5 w-5 text-psyched-orange" />
                  </div>
                  <div>
                    <span className="font-medium text-psyched-darkBlue text-lg">Proven Success Record</span>
                    <p className="text-gray-600 mt-1">
                      Join districts like Denver and Kansas City who have achieved remarkable results
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      <BenefitsSection 
        title="Benefits for School Districts"
        subtitle="PsychedHire! provides comprehensive solutions to your school psychology staffing challenges."
        benefits={benefits}
      />
      
      <ProcessSection 
        title="Simplified Job Posting Process"
        subtitle="We've streamlined every step from posting to report delivery"
        steps={processSteps}
      />
      
      {/* Stats Section */}
      <section className="py-16 bg-psyched-cream">
        <div className="psyched-container">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-psyched-darkBlue mb-4">
              PsychedHire! By The Numbers
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our impact on school districts nationwide
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-5xl font-bold text-psyched-orange mb-2">75%</div>
              <div className="text-gray-600 font-medium">Reduction in Hiring Time</div>
              <p className="text-sm text-gray-500 mt-2">Average across all district partners</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-5xl font-bold text-psyched-orange mb-2">90%</div>
              <div className="text-gray-600 font-medium">Satisfaction Rate</div>
              <p className="text-sm text-gray-500 mt-2">From district administrators</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-5xl font-bold text-psyched-orange mb-2">60%</div>
              <div className="text-gray-600 font-medium">Reduction in Admin Work</div>
              <p className="text-sm text-gray-500 mt-2">Through streamlined processes</p>
            </div>
          </div>
        </div>
      </section>
      
      <TestimonialsSection 
        title="What Districts Say"
        subtitle="Hear from the districts who have transformed their psychology services with PsychedHire!"
        badge="Success Stories"
        testimonials={testimonials}
      />
      
      <CTASection 
        title="Ready to Transform Your District's Psychology Services?"
        description="Join PsychedHire! today to streamline your hiring process, reduce backlogs, and better support your students."
        ctaLink="/register?role=district"
        ctaText="Sign Up Now"
        ctaBgColor="bg-psyched-orange"
        ctaTextColor="text-white"
        bgGradient="bg-gradient-to-br from-psyched-cream to-white"
      />
      
      <Footer />
    </div>
  );
};

export default DistrictsLanding;
