import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Star, Calendar, FileText, Search, Award, TrendingDown, Clock, School, Sparkles } from 'lucide-react';
import AIInspiredLogo from '@/components/nav/AIInspiredLogo';

const AIInspiredLanding = () => {
  // Stats for the hero section
  const heroStats = [
    {
      icon: Clock,
      title: "75% Faster Hiring",
      description: "Reduce hiring cycles dramatically"
    },
    {
      icon: Award,
      title: "Qualified Candidates",
      description: "Pre-screened professionals"
    },
    {
      icon: TrendingDown,
      title: "Clear Backlogs",
      description: "Reduce evaluation waitlists"
    }
  ];

  // Benefits for districts
  const benefits = [
    {
      icon: Clock,
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
      title: "Backlog Reduction",
      description: "Clear evaluation backlogs quickly with our efficient process and qualified professionals.",
      features: [
        "Streamlined evaluation workflows",
        "AI-assisted report generation",
        "Compliance monitoring"
      ]
    }
  ];

  // Process steps
  const processSteps = [
    {
      number: 1,
      title: "Create District Profile",
      description: "Set up your district profile with key information and requirements.",
      features: [
        "District information",
        "Compliance requirements",
        "Admin user management"
      ]
    },
    {
      number: 2,
      title: "Post Job Openings",
      description: "Create detailed job postings with specific requirements and timeframes.",
      features: [
        "Intuitive job form",
        "Skills specification",
        "Timeline definition"
      ]
    },
    {
      number: 3,
      title: "Review Applications",
      description: "Browse applications from qualified candidates and select the best matches.",
      features: [
        "Candidate comparison",
        "Credential verification",
        "Interview scheduling"
      ]
    },
    {
      number: 4,
      title: "Access Reports",
      description: "Receive comprehensive, compliant evaluation reports through our secure platform.",
      features: [
        "Secure document access",
        "Compliance verification",
        "Digital record keeping"
      ]
    }
  ];

  // Testimonials
  const testimonials = [
    {
      initials: "DPS",
      name: "Leadership Team",
      role: "Administration",
      organization: "Denver Public Schools",
      quote: "PsychedHire was the difference between scrambling and succeeding. Their speed and quality changed everything."
    },
    {
      initials: "KC",
      name: "District Office",
      role: "Special Education Department",
      organization: "Kansas City Public Schools",
      quote: "Thanks to PsychedHire, we scaled faster than we ever imagined — and with the right people."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <AIInspiredLogo />
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link to="/for-psychologists" className="text-gray-600 hover:text-purple-700 px-3 py-2 text-sm font-medium">For Psychologists</Link>
              <Link to="/for-districts" className="text-gray-600 hover:text-purple-700 px-3 py-2 text-sm font-medium">For Districts</Link>
              <Link to="/success-stories" className="text-gray-600 hover:text-purple-700 px-3 py-2 text-sm font-medium">Success Stories</Link>
              <Link to="/about" className="text-gray-600 hover:text-purple-700 px-3 py-2 text-sm font-medium">About</Link>
            </nav>
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-purple-700 px-3 py-2 text-sm font-medium">Login</Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-purple-600 to-violet-500 text-white hover:from-purple-700 hover:to-violet-600 flex items-center gap-2">
                  Sign up free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-violet-500 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-16 right-16">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 4L23.5 16.5H36L26 24.5L30 37L20 29L10 37L14 24.5L4 16.5H16.5L20 4Z" fill="white" fillOpacity="0.3"/>
          </svg>
        </div>
        <div className="absolute bottom-16 left-16">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 3L18.5 13.5H29L20 19.5L24 30L15 24L6 30L10 19.5L1 13.5H11.5L15 3Z" fill="white" fillOpacity="0.3"/>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              The magic of AI to<br />streamline school psychology
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Connecting qualified psychologists with K-12 schools efficiently,
              so you can focus on what matters the most.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Link to="/for-psychologists">
                <Button size="lg" className="bg-white text-purple-700 hover:bg-white/90 flex items-center gap-2">
                  For Psychologists
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/for-districts">
                <Button size="lg" className="bg-purple-800 text-white hover:bg-purple-900 border border-white/20 flex items-center gap-2">
                  For Districts
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {heroStats.map((stat, index) => {
                  const StatIcon = stat.icon;
                  return (
                    <div key={index} className="flex items-center">
                      <div className="bg-white/20 rounded-full p-2 mr-3">
                        <StatIcon className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-white">{stat.title}</p>
                        <p className="text-sm text-white/80">{stat.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Report Writing Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 mb-4 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                Revolutionary Feature
              </div>
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-violet-500 mb-6">
                AI-Assisted Report Writing
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our advanced AI tools streamline the report writing process, reducing administrative 
                burden while maintaining quality and personalization.
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <div className="flex-shrink-0 mr-3 mt-1 bg-green-100 rounded-full p-1">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">Save up to 60% of report writing time</span>
                    <p className="text-sm text-gray-600 mt-1">
                      Let AI help with formatting, compliance checking, and drafting sections
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mr-3 mt-1 bg-green-100 rounded-full p-1">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">FERPA and HIPAA compliant</span>
                    <p className="text-sm text-gray-600 mt-1">
                      All data is processed securely while meeting all regulatory requirements
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mr-3 mt-1 bg-green-100 rounded-full p-1">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-800">Professional templates and recommendations</span>
                    <p className="text-sm text-gray-600 mt-1">
                      Start with templates aligned with best practices and educational standards
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100 transform rotate-1 z-10 relative">
                <div className="flex space-x-2 mb-4">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                
                <div className="h-64 overflow-y-auto bg-gray-50 rounded p-4 text-sm">
                  <div className="mb-3">
                    <p className="font-bold text-gray-800">Psych Evaluation Report</p>
                    <p className="text-xs text-gray-500">Using AI Assistant - Draft</p>
                  </div>
                  
                  <div className="space-y-2 text-gray-700">
                    <p><span className="font-semibold">Student:</span> John D.</p>
                    <p><span className="font-semibold">Age:</span> 9 years, 4 months</p>
                    <p><span className="font-semibold">Grade:</span> 4th</p>
                    
                    <div className="bg-purple-50 border-l-2 border-purple-400 p-2 my-3 rounded">
                      <p className="text-xs italic">AI suggests: Add details about testing environment and student's demeanor during evaluation.</p>
                    </div>
                    
                    <p><span className="font-semibold">Test Results:</span></p>
                    <p>WISC-V Composite Scores:</p>
                    <ul className="list-disc pl-5 text-xs">
                      <li>Verbal Comprehension: 112 (High Average)</li>
                      <li>Visual Spatial: 105 (Average)</li>
                      <li>Fluid Reasoning: 118 (High Average)</li>
                      <li>Working Memory: 95 (Average)</li>
                      <li>Processing Speed: 88 (Low Average)</li>
                    </ul>
                    
                    <div className="bg-purple-50 border-l-2 border-purple-400 p-2 my-3 rounded">
                      <p className="text-xs">AI compliance check: This report meets all district requirements. Consider adding behavioral observations to strengthen recommendations.</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between mt-4">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="text-xs">AI Suggest</Button>
                    <Button variant="outline" size="sm" className="text-xs">Check Compliance</Button>
                  </div>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white text-xs">Save Draft</Button>
                </div>
              </div>
              
              <div className="absolute top-8 -left-8 -z-10 w-full h-full bg-gradient-to-br from-purple-400/30 to-violet-400/30 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-violet-500 mb-4">
              Benefits for School Districts
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              PsychedHire! provides comprehensive solutions to your school psychology staffing challenges.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const BenefitIcon = benefit.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border-t-4 border-purple-500">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-purple-100 p-3 rounded-full mb-4">
                      <BenefitIcon className="text-purple-600 h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {benefit.description}
                    </p>
                    <ul className="mt-4 text-left space-y-2 w-full">
                      {benefit.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-violet-500 mb-4">
              Simplified Job Posting Process
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We've streamlined every step from posting to report delivery
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow h-full">
                  <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-violet-500 text-white flex items-center justify-center font-bold shadow-lg">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {step.description}
                  </p>
                  <ul className="text-sm space-y-1 text-gray-500">
                    {step.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-violet-500 mb-4">
              PsychedHire! By The Numbers
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our impact on school districts nationwide
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-500 mb-2">75%</div>
              <div className="text-gray-800 font-medium">Reduction in Hiring Time</div>
              <p className="text-sm text-gray-500 mt-2">Average across all district partners</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-500 mb-2">90%</div>
              <div className="text-gray-800 font-medium">Satisfaction Rate</div>
              <p className="text-sm text-gray-500 mt-2">From district administrators</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-500 mb-2">60%</div>
              <div className="text-gray-800 font-medium">Reduction in Admin Work</div>
              <p className="text-sm text-gray-500 mt-2">Through streamlined processes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-1.5 mb-4 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
              <Star className="w-4 h-4 mr-2 text-amber-500" />
              Success Stories
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-violet-500 mb-4">
              What Districts Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from the districts who have transformed their psychology services with PsychedHire!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg border-none overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="bg-gradient-to-br from-purple-100 to-violet-100 p-8 md:w-1/3 flex flex-col justify-center items-center">
                    <div className="w-16 h-16 flex items-center justify-center bg-white rounded-full shadow-md mb-4">
                      <p className="font-bold text-2xl text-purple-700">{testimonial.initials}</p>
                    </div>
                    <p className="font-semibold text-gray-800 text-center">{testimonial.name}</p>
                    <p className="text-sm text-gray-600 text-center">{testimonial.role}</p>
                    <p className="text-xs text-gray-500 text-center">{testimonial.organization}</p>
                  </div>
                  <div className="p-8 md:w-2/3">
                    <svg className="h-8 w-8 text-purple-400 mb-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <p className="italic text-gray-700 mb-6">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-amber-500 fill-amber-500" />
                        ))}
                      </div>
                      <Link to={`/success-stories`}>
                        <Button variant="link" className="p-0 h-auto text-purple-600 hover:text-purple-800 flex items-center gap-1">
                          Read full case study <ArrowRight size={16} />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="text-center">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-violet-500 mb-6">
                  Ready to Transform Your District's Psychology Services?
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Join PsychedHire! today to streamline your hiring process, reduce backlogs, and better support your students.
                </p>
                <Link to="/register">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-violet-500 text-white hover:from-purple-700 hover:to-violet-600 flex items-center gap-2">
                    Sign Up Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                
                <div className="mt-6 text-center">
                  <p className="text-gray-800 font-medium">
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

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Solutions</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/for-psychologists" className="text-sm text-gray-500 hover:text-purple-600">For Psychologists</Link></li>
                <li><Link to="/for-districts" className="text-sm text-gray-500 hover:text-purple-600">For Districts</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Company</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/about" className="text-sm text-gray-500 hover:text-purple-600">About Us</Link></li>
                <li><Link to="/success-stories" className="text-sm text-gray-500 hover:text-purple-600">Success Stories</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Resources</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="#" className="text-sm text-gray-500 hover:text-purple-600">Blog</Link></li>
                <li><Link to="#" className="text-sm text-gray-500 hover:text-purple-600">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="#" className="text-sm text-gray-500 hover:text-purple-600">Privacy</Link></li>
                <li><Link to="#" className="text-sm text-gray-500 hover:text-purple-600">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center">
              <AIInspiredLogo />
            </div>
            <p className="text-sm text-gray-500 mt-4 md:mt-0">© 2025 PsychedHire. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AIInspiredLanding;
