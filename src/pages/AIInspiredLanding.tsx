
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Star, Calendar, FileText, Search, Award, TrendingDown, Clock, School, Sparkles } from 'lucide-react';
import AIInspiredLogo from '@/components/nav/AIInspiredLogo';
import { motion } from 'framer-motion';

const AIInspiredLanding = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

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
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <AIInspiredLogo />
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link to="/for-psychologists" className="text-gray-600 hover:text-purple-700 px-3 py-2 text-sm font-medium relative group">
                For Psychologists
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
              <Link to="/for-districts" className="text-gray-600 hover:text-purple-700 px-3 py-2 text-sm font-medium relative group">
                For Districts
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
              <Link to="/success-stories" className="text-gray-600 hover:text-purple-700 px-3 py-2 text-sm font-medium relative group">
                Success Stories
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-purple-700 px-3 py-2 text-sm font-medium relative group">
                About
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
            </nav>
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-purple-700 px-3 py-2 text-sm font-medium relative group">
                Login
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
              <Link to="/register">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="bg-gradient-to-r from-purple-600 to-violet-500 text-white hover:from-purple-700 hover:to-violet-600 flex items-center gap-2">
                    Sign up free
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  </Button>
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-20 bg-gradient-to-br from-purple-600 to-violet-500 relative overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        
        {/* Decorative elements */}
        <motion.div 
          className="absolute top-16 right-16"
          animate={{ 
            rotate: [0, 15, 0, -15, 0],
            scale: [1, 1.1, 1, 1.1, 1]
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 4L23.5 16.5H36L26 24.5L30 37L20 29L10 37L14 24.5L4 16.5H16.5L20 4Z" fill="white" fillOpacity="0.3"/>
          </svg>
        </motion.div>
        <motion.div 
          className="absolute bottom-16 left-16"
          animate={{ 
            rotate: [0, -15, 0, 15, 0],
            scale: [1, 1.1, 1, 1.1, 1]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1 
          }}
        >
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 3L18.5 13.5H29L20 19.5L24 30L15 24L6 30L10 19.5L1 13.5H11.5L15 3Z" fill="white" fillOpacity="0.3"/>
          </svg>
        </motion.div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1 
              variants={fadeIn}
              custom={0}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              The magic of AI to<br />streamline school psychology
            </motion.h1>
            <motion.p 
              variants={fadeIn}
              custom={1}
              className="text-xl text-white/90 mb-8 max-w-2xl mx-auto"
            >
              Connecting qualified psychologists with K-12 schools efficiently,
              so you can focus on what matters the most.
            </motion.p>
            
            <motion.div 
              variants={fadeIn}
              custom={2}
              className="flex flex-wrap justify-center gap-4 mb-12"
            >
              <Link to="/for-psychologists">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="bg-white text-purple-700 hover:bg-white/90 flex items-center gap-2 group">
                    For Psychologists
                    <motion.div
                      className="group-hover:translate-x-1 transition-transform duration-300"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  </Button>
                </motion.div>
              </Link>
              <Link to="/for-districts">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="bg-purple-800 text-white hover:bg-purple-900 border border-white/20 flex items-center gap-2 group">
                    For Districts
                    <motion.div
                      className="group-hover:translate-x-1 transition-transform duration-300"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
            
            <motion.div 
              variants={fadeIn}
              custom={3}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {heroStats.map((stat, index) => {
                  const StatIcon = stat.icon;
                  return (
                    <motion.div 
                      key={index} 
                      className="flex items-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + (index * 0.2) }}
                      whileHover={{ scale: 1.03 }}
                    >
                      <motion.div 
                        className="bg-white/20 rounded-full p-2 mr-3"
                        animate={{ rotate: [0, 10, 0, -10, 0] }}
                        transition={{ duration: 6, repeat: Infinity, delay: index }}
                      >
                        <StatIcon className="h-5 w-5 text-white" />
                      </motion.div>
                      <div className="text-left">
                        <p className="font-medium text-white">{stat.title}</p>
                        <p className="text-sm text-white/80">{stat.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* AI Report Writing Section */}
      <motion.section 
        className="py-16 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div className="inline-flex items-center px-3 py-1 mb-4 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, 0, -5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                </motion.div>
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
                {[
                  {
                    title: "Save up to 60% of report writing time",
                    description: "Let AI help with formatting, compliance checking, and drafting sections"
                  },
                  {
                    title: "FERPA and HIPAA compliant",
                    description: "All data is processed securely while meeting all regulatory requirements"
                  },
                  {
                    title: "Professional templates and recommendations",
                    description: "Start with templates aligned with best practices and educational standards"
                  }
                ].map((item, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + (index * 0.2) }}
                  >
                    <motion.div 
                      className="flex-shrink-0 mr-3 mt-1 bg-green-100 rounded-full p-1"
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Check className="h-4 w-4 text-green-600" />
                    </motion.div>
                    <div>
                      <span className="font-medium text-gray-800">{item.title}</span>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.description}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <motion.div 
                className="bg-white rounded-lg p-6 shadow-lg border border-gray-100 z-10 relative"
                animate={{ rotate: [1, 2, 1, 0, 1] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              >
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
                    
                    <motion.div 
                      className="bg-purple-50 border-l-2 border-purple-400 p-2 my-3 rounded"
                      animate={{ 
                        opacity: [0.7, 1, 0.7],
                        x: [0, 2, 0, -2, 0]
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <p className="text-xs italic">AI suggests: Add details about testing environment and student's demeanor during evaluation.</p>
                    </motion.div>
                    
                    <p><span className="font-semibold">Test Results:</span></p>
                    <p>WISC-V Composite Scores:</p>
                    <ul className="list-disc pl-5 text-xs">
                      <li>Verbal Comprehension: 112 (High Average)</li>
                      <li>Visual Spatial: 105 (Average)</li>
                      <li>Fluid Reasoning: 118 (High Average)</li>
                      <li>Working Memory: 95 (Average)</li>
                      <li>Processing Speed: 88 (Low Average)</li>
                    </ul>
                    
                    <motion.div 
                      className="bg-purple-50 border-l-2 border-purple-400 p-2 my-3 rounded"
                      animate={{ 
                        opacity: [0.7, 1, 0.7],
                        x: [0, 2, 0, -2, 0]
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    >
                      <p className="text-xs">AI compliance check: This report meets all district requirements. Consider adding behavioral observations to strengthen recommendations.</p>
                    </motion.div>
                  </div>
                </div>
                
                <div className="flex justify-between mt-4">
                  <div className="flex space-x-2">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="outline" size="sm" className="text-xs">AI Suggest</Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="outline" size="sm" className="text-xs">Check Compliance</Button>
                    </motion.div>
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white text-xs">Save Draft</Button>
                  </motion.div>
                </div>
              </motion.div>
              
              <motion.div 
                className="absolute top-8 -left-8 -z-10 w-full h-full bg-gradient-to-br from-purple-400/30 to-violet-400/30 rounded-lg"
                animate={{ 
                  rotate: [-1, 1, -1],
                  scale: [0.98, 1.02, 0.98]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              ></motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section 
        className="py-16 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-violet-500 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Benefits for School Districts
            </motion.h2>
            <motion.p 
              className="text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              PsychedHire! provides comprehensive solutions to your school psychology staffing challenges.
            </motion.p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {benefits.map((benefit, index) => {
              const BenefitIcon = benefit.icon;
              return (
                <motion.div 
                  key={index} 
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border-t-4 border-purple-500"
                  variants={fadeIn}
                  custom={index}
                  whileHover={{ y: -5, transition: { duration: 0.3 } }}
                >
                  <div className="flex flex-col items-center text-center">
                    <motion.div 
                      className="bg-purple-100 p-3 rounded-full mb-4"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.7 }}
                    >
                      <BenefitIcon className="text-purple-600 h-6 w-6" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {benefit.description}
                    </p>
                    <ul className="mt-4 text-left space-y-2 w-full">
                      {benefit.features.map((feature, featureIndex) => (
                        <motion.li 
                          key={featureIndex} 
                          className="flex items-center"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + (featureIndex * 0.1) }}
                        >
                          <motion.div
                            whileHover={{ scale: 1.2 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                          </motion.div>
                          <span className="text-sm text-gray-600">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* Process Section */}
      <motion.section 
        className="py-16 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-violet-500 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Simplified Job Posting Process
            </motion.h2>
            <motion.p 
              className="text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              We've streamlined every step from posting to report delivery
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div 
                key={index} 
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow h-full">
                  <motion.div 
                    className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-violet-500 text-white flex items-center justify-center font-bold shadow-lg"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                  >
                    {step.number}
                  </motion.div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {step.description}
                  </p>
                  <ul className="text-sm space-y-1 text-gray-500">
                    {step.features.map((feature, featureIndex) => (
                      <motion.li 
                        key={featureIndex} 
                        className="flex items-center"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + (featureIndex * 0.1) }}
                      >
                        <motion.div 
                          className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2 flex-shrink-0"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: featureIndex * 0.3 }}
                        ></motion.div>
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className="py-16 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <motion.h2 
              className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-violet-500 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              PsychedHire! By The Numbers
            </motion.h2>
            <motion.p 
              className="text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Our impact on school districts nationwide
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              {
                value: "75%",
                label: "Reduction in Hiring Time",
                description: "Average across all district partners"
              },
              {
                value: "90%",
                label: "Satisfaction Rate",
                description: "From district administrators"
              },
              {
                value: "60%",
                label: "Reduction in Admin Work",
                description: "Through streamlined processes"
              }
            ].map((stat, index) => (
              <motion.div 
                key={index} 
                className="bg-white p-8 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
              >
                <motion.div 
                  className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-500 mb-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + (index * 0.2) }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-gray-800 font-medium">{stat.label}</div>
                <p className="text-sm text-gray-500 mt-2">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section 
        className="py-16 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div 
              className="inline-flex items-center px-4 py-1.5 mb-4 bg-amber-100 text-amber-800 rounded-full text-sm font-medium"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                animate={{ rotate: [0, 20, 0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Star className="w-4 h-4 mr-2 text-amber-500" />
              </motion.div>
              Success Stories
            </motion.div>
            <motion.h2 
              className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-violet-500 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              What Districts Say
            </motion.h2>
            <motion.p 
              className="text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Hear from the districts who have transformed their psychology services with PsychedHire!
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index} 
                className="bg-white rounded-xl shadow-lg border-none overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.2 }}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
              >
                <div className="flex flex-col md:flex-row">
                  <div className="bg-gradient-to-br from-purple-100 to-violet-100 p-8 md:w-1/3 flex flex-col justify-center items-center">
                    <motion.div 
                      className="w-16 h-16 flex items-center justify-center bg-white rounded-full shadow-md mb-4"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.7 }}
                    >
                      <p className="font-bold text-2xl text-purple-700">{testimonial.initials}</p>
                    </motion.div>
                    <p className="font-semibold text-gray-800 text-center">{testimonial.name}</p>
                    <p className="text-sm text-gray-600 text-center">{testimonial.role}</p>
                    <p className="text-xs text-gray-500 text-center">{testimonial.organization}</p>
                  </div>
                  <div className="p-8 md:w-2/3">
                    <motion.svg 
                      className="h-8 w-8 text-purple-400 mb-4" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </motion.svg>
                    <p className="italic text-gray-700 mb-6">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center justify-between">
                      <motion.div 
                        className="flex"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                      >
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ 
                              duration: 2, 
                              repeat: Infinity, 
                              delay: i * 0.3,
                            }}
                          >
                            <Star key={i} className="h-4 w-4 text-amber-500 fill-amber-500" />
                          </motion.div>
                        ))}
                      </motion.div>
                      <Link to={`/success-stories`}>
                        <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }}>
                          <Button variant="link" className="p-0 h-auto text-purple-600 hover:text-purple-800 flex items-center gap-1">
                            Read full case study <ArrowRight size={16} />
                          </Button>
                        </motion.div>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-16 bg-gradient-to-br from-gray-50 to-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div 
              className="bg-white rounded-xl p-8 shadow-lg border border-gray-100"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              whileHover={{ 
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
            >
              <div className="text-center">
                <motion.h2 
                  className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-violet-500 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  Ready to Transform Your District's Psychology Services?
                </motion.h2>
                <motion.p 
                  className="text-xl text-gray-600 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Join PsychedHire! today to streamline your hiring process, reduce backlogs, and better support your students.
                </motion.p>
                <Link to="/register">
                  <motion.div 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button size="lg" className="bg-gradient-to-r from-purple-600 to-violet-500 text-white hover:from-purple-700 hover:to-violet-600 flex items-center gap-2">
                      Sign Up Now
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </motion.div>
                    </Button>
                  </motion.div>
                </Link>
                
                <motion.div 
                  className="mt-6 text-center"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-gray-800 font-medium">
                    Built by School Psychologists
                  </p>
                  <p className="text-gray-600">
                    For School Psychologists
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Solutions</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/for-psychologists" className="text-sm text-gray-500 hover:text-purple-600 transition-colors duration-200">For Psychologists</Link></li>
                <li><Link to="/for-districts" className="text-sm text-gray-500 hover:text-purple-600 transition-colors duration-200">For Districts</Link></li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Company</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/about" className="text-sm text-gray-500 hover:text-purple-600 transition-colors duration-200">About Us</Link></li>
                <li><Link to="/success-stories" className="text-sm text-gray-500 hover:text-purple-600 transition-colors duration-200">Success Stories</Link></li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Resources</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="#" className="text-sm text-gray-500 hover:text-purple-600 transition-colors duration-200">Blog</Link></li>
                <li><Link to="#" className="text-sm text-gray-500 hover:text-purple-600 transition-colors duration-200">Help Center</Link></li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="#" className="text-sm text-gray-500 hover:text-purple-600 transition-colors duration-200">Privacy</Link></li>
                <li><Link to="#" className="text-sm text-gray-500 hover:text-purple-600 transition-colors duration-200">Terms</Link></li>
              </ul>
            </motion.div>
          </div>
          <motion.div 
            className="mt-8 border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center">
              <AIInspiredLogo />
            </div>
            <p className="text-sm text-gray-500 mt-4 md:mt-0">© 2025 PsychedHire. All rights reserved.</p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default AIInspiredLanding;
