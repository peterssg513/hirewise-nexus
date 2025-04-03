
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useAnimation, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Check, Users, Brain, Sparkles, 
  Clock, School, Award, FileSearch, Star, Calendar
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ThirdLandingLogo } from '@/components/nav/ThirdLandingLogo';

const ThirdLandingPage = () => {
  const { scrollY } = useScroll();
  const headerBackgroundOpacity = useTransform(scrollY, [0, 100], [0, 1]);
  const controls = useAnimation();
  const [visibleSection, setVisibleSection] = useState('');
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  
  useEffect(() => {
    controls.start({ opacity: 1, y: 0 });
  }, [controls]);
  
  const gradientTextClass = "bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-lavender-600";

  const staggerChildren = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  // Features with teal/lavender/coral theme
  const features = [
    {
      id: "matching",
      icon: Users,
      title: "Smart Matching",
      description: "Our AI-powered system connects schools with psychologists who perfectly match their requirements and culture.",
      color: "teal"
    },
    {
      id: "evaluations",
      icon: FileSearch,
      title: "Simplified Evaluations",
      description: "Streamlined workflows make student evaluations more efficient while maintaining the highest quality standards.",
      color: "lavender"
    },
    {
      id: "reports",
      icon: Brain,
      title: "AI-Assisted Reports",
      description: "Reduce documentation time by 60% with intelligent templates and automated compliance checking.",
      color: "coral"
    }
  ];

  // Testimonials with our theme
  const testimonials = [
    {
      quote: "PsychedHire transformed our hiring process. We found qualified psychologists in half the time.",
      author: "Dr. Amanda Chen",
      position: "Director of Special Education",
      organization: "Westlake School District"
    },
    {
      quote: "The platform's intuitive design made it easy to complete evaluations and submit reports efficiently.",
      author: "Michael Rodriguez",
      position: "School Psychologist",
      organization: "Maple Grove Elementary"
    },
    {
      quote: "We cleared our evaluation backlog in just two months using PsychedHire's matching system.",
      author: "Sarah Thompson",
      position: "Assistant Principal",
      organization: "Eastside Middle School"
    }
  ];

  // Workflow steps with our theme
  const workflowSteps = [
    {
      number: "01",
      title: "Create Your Profile",
      description: "Set up your school or psychologist profile with your specific requirements and qualifications.",
      icon: Users
    },
    {
      number: "02",
      title: "Get Matched",
      description: "Our AI algorithm connects schools with qualified psychologists based on skills and needs.",
      icon: Sparkles
    },
    {
      number: "03",
      title: "Schedule Evaluations",
      description: "Easily coordinate and schedule student assessments through our intuitive calendar.",
      icon: Calendar
    },
    {
      number: "04",
      title: "Access Reports",
      description: "Complete and access comprehensive evaluation reports through our secure platform.",
      icon: FileSearch
    }
  ];

  // Stats with our theme
  const stats = [
    { value: "75%", label: "Faster Hiring", icon: Clock },
    { value: "60%", label: "Time Saved on Reports", icon: FileSearch },
    { value: "90%", label: "User Satisfaction", icon: Star }
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Header */}
      <motion.header
        style={{ backgroundColor: `rgba(255, 255, 255, ${headerBackgroundOpacity})` }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b border-lavender-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <ThirdLandingLogo />
            
            <nav className="hidden md:flex space-x-8">
              <Link 
                to="#features" 
                className="text-gray-600 hover:text-teal-600 px-3 py-2 text-sm font-medium relative group"
              >
                Features
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-teal-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
              <Link 
                to="#testimonials" 
                className="text-gray-600 hover:text-teal-600 px-3 py-2 text-sm font-medium relative group"
              >
                Testimonials
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-teal-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
              <Link 
                to="#workflow" 
                className="text-gray-600 hover:text-teal-600 px-3 py-2 text-sm font-medium relative group"
              >
                How It Works
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-teal-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
            </nav>
            
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-teal-700 px-3 py-2 text-sm font-medium">
                Login
              </Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/register">
                  <Button className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white">
                    Get Started
                  </Button>
                </Link>
              </motion.div>
            </div>
            
            <motion.button 
              className="md:hidden rounded-md p-2 text-gray-600 hover:text-teal-600 hover:bg-gray-100"
              whileTap={{ scale: 0.9 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="pt-32 pb-16 bg-gradient-to-br from-lavender-50 via-white to-teal-50 overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-teal-200/20 to-lavender-200/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-coral-200/20 to-teal-200/20 blur-3xl rounded-full translate-y-1/2 -translate-x-1/3"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center px-3 py-1 mb-6 bg-lavender-100 text-teal-700 rounded-full text-sm font-medium"
              >
                <Sparkles className="w-4 h-4 mr-2 text-coral-500" />
                Revolutionizing School Psychology
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              >
                <span className={gradientTextClass}>Connect</span> schools & psychologists with ease
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-gray-600 mb-8"
              >
                A modern platform that bridges the gap between schools and qualified psychologists. Streamline evaluations, reduce administrative burden, and improve student outcomes.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap justify-center lg:justify-start gap-4"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/register">
                    <Button size="lg" className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white">
                      Get Started Free
                    </Button>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="#features">
                    <Button size="lg" variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50">
                      Learn More
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="relative z-10 bg-white rounded-xl shadow-xl p-6 border border-lavender-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-coral-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-teal-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-lavender-400 rounded-full"></div>
                  </div>
                  <div className="text-xs text-gray-500">PsychedHire Dashboard</div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-lavender-50 p-4 rounded-lg border border-lavender-200">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-teal-800">New Applications</h3>
                      <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2 py-1 rounded">8 New</span>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-white p-2 rounded border border-lavender-100 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-coral-100 rounded-full flex items-center justify-center text-coral-600 font-medium mr-2">JD</div>
                          <div>
                            <p className="text-sm font-medium">Dr. Jane Doe</p>
                            <p className="text-xs text-gray-500">Child Psychology • 8 yrs exp.</p>
                          </div>
                        </div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <button className="text-xs bg-teal-50 hover:bg-teal-100 text-teal-700 px-2 py-1 rounded border border-teal-200">
                            View
                          </button>
                        </motion.div>
                      </div>
                      <div className="bg-white p-2 rounded border border-lavender-100 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-medium mr-2">MS</div>
                          <div>
                            <p className="text-sm font-medium">Michael Smith</p>
                            <p className="text-xs text-gray-500">Educational Psych • 12 yrs exp.</p>
                          </div>
                        </div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <button className="text-xs bg-teal-50 hover:bg-teal-100 text-teal-700 px-2 py-1 rounded border border-teal-200">
                            View
                          </button>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-teal-800">Upcoming Evaluations</h3>
                      <span className="bg-coral-100 text-coral-800 text-xs font-medium px-2 py-1 rounded">This Week</span>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-white p-2 rounded border border-teal-100 flex items-center">
                        <div className="w-8 h-8 bg-lavender-100 rounded-full flex items-center justify-center text-lavender-600 font-medium mr-2">
                          <Calendar className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium">Reading Assessment</p>
                            <p className="text-xs text-gray-500">Wed, Apr 5</p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-xs text-gray-500">Maple Elementary</p>
                            <p className="text-xs text-teal-600">09:30 AM</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-lavender-100 flex justify-between items-center">
                  <div className="text-xs text-gray-500">Last updated: Just now</div>
                  <motion.button 
                    className="text-xs text-teal-600 flex items-center hover:text-teal-700"
                    whileHover={{ x: 2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    View All <ArrowRight className="ml-1 h-3 w-3" />
                  </motion.button>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-lavender-200 rounded-full blur-2xl opacity-40"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-teal-200 rounded-full blur-2xl opacity-40"></div>
              <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-8 h-40 bg-coral-200 rounded-full blur-xl opacity-40"></div>
            </motion.div>
          </div>
          
          {/* Stats preview */}
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => {
              const StatIcon = stat.icon;
              return (
                <motion.div 
                  key={index}
                  variants={fadeIn}
                  className="bg-white bg-opacity-70 backdrop-blur-sm rounded-lg p-6 text-center border border-lavender-100 shadow-sm"
                  whileHover={{ 
                    y: -5,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <motion.div
                    className="w-12 h-12 mx-auto bg-teal-100 rounded-full flex items-center justify-center mb-4"
                    animate={{ 
                      backgroundColor: [
                        "rgba(204, 251, 241, 1)", // teal-100
                        "rgba(230, 232, 250, 1)", // lavender-100
                        "rgba(255, 228, 219, 1)", // coral-100
                        "rgba(204, 251, 241, 1)"  // teal-100
                      ]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <StatIcon className="h-6 w-6 text-teal-600" />
                  </motion.div>
                  <h3 className="text-3xl font-bold text-teal-800">{stat.value}</h3>
                  <p className="text-gray-600">{stat.label}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
        
        <svg className="absolute bottom-0 left-0 right-0 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 60">
          <path fill="currentColor" fillOpacity="1" d="M0,32L80,42.7C160,53,320,75,480,64C640,53,800,11,960,5.3C1120,0,1280,32,1360,48L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Transform Your <span className={gradientTextClass}>School Psychology</span> Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform connects schools and psychologists with powerful tools designed for the modern educational environment.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-md border border-lavender-100 hover:shadow-xl transition-shadow duration-300"
                onMouseEnter={() => setHoveredFeature(feature.id)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <motion.div 
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto
                    ${feature.color === 'teal' ? 'bg-teal-100 text-teal-600' : 
                     feature.color === 'lavender' ? 'bg-lavender-100 text-lavender-600' : 
                     'bg-coral-100 text-coral-600'}`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  animate={{ 
                    scale: hoveredFeature === feature.id ? [1, 1.1, 1] : 1
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <feature.icon className="h-8 w-8" />
                </motion.div>
                <h3 className="text-xl font-bold text-center mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </motion.div>
            ))}
          </div>
          
          {/* Feature showcase */}
          <motion.div 
            className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-gradient-to-br from-lavender-50 to-transparent rounded-2xl p-8 md:p-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div
                className="inline-flex items-center px-3 py-1 mb-4 bg-teal-100 text-teal-800 rounded-full text-sm font-medium"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              >
                <Sparkles className="w-4 h-4 mr-2 text-teal-600" />
                Featured Tool
              </motion.div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">AI-Assisted Reporting</h3>
              <p className="text-gray-600 mb-6">
                Our revolutionary AI tools streamline the report-writing process, reducing administrative burden while maintaining quality and personalization.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Save up to 60% of report writing time",
                  "FERPA and HIPAA compliant",
                  "Professional templates and recommendations"
                ].map((item, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + (index * 0.1) }}
                  >
                    <motion.div 
                      className="flex-shrink-0 mr-3 mt-1 bg-teal-100 text-teal-600 rounded-full p-1"
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Check className="h-4 w-4" />
                    </motion.div>
                    <span className="text-gray-600">{item}</span>
                  </motion.li>
                ))}
              </ul>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                  Learn More About AI Tools
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div
                className="bg-white rounded-lg p-6 shadow-xl border border-lavender-200"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-medium">Student Evaluation Report</h4>
                  <span className="text-xs text-gray-500 bg-lavender-50 px-2 py-1 rounded-full">AI Enhanced</span>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">Student Information</label>
                    <div className="p-3 bg-gray-50 rounded-md text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">Alexander Thompson</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Grade:</span>
                        <span className="font-medium">5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">School:</span>
                        <span className="font-medium">Westlake Elementary</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm text-gray-600">Assessment Results</label>
                      <motion.button 
                        className="text-xs text-teal-600 flex items-center"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Sparkles className="h-3 w-3 mr-1" /> 
                        AI Suggest
                      </motion.button>
                    </div>
                    <div className="p-3 bg-teal-50 border border-teal-100 rounded-md text-sm">
                      <p className="text-gray-700">
                        Alexander demonstrated strengths in verbal comprehension (95th percentile) and abstract reasoning (89th percentile). Areas for development include working memory (65th percentile) and processing speed (58th percentile).
                      </p>
                      <motion.div 
                        className="mt-2 p-2 bg-white rounded border border-teal-200 text-xs text-teal-800"
                        animate={{ 
                          boxShadow: ['0 0 0 rgba(13, 148, 136, 0.2)', '0 0 8px rgba(13, 148, 136, 0.6)', '0 0 0 rgba(13, 148, 136, 0.2)']
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <div className="flex items-start">
                          <Sparkles className="h-3 w-3 mr-1 flex-shrink-0 mt-0.5 text-teal-600" />
                          <span>AI suggests adding specific examples from subtests to support these observations.</span>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">Recommendations</label>
                    <div className="p-3 bg-gray-50 rounded-md text-sm">
                      <ul className="space-y-1 list-disc list-inside text-gray-700">
                        <li>Extended time for assignments requiring complex processing</li>
                        <li>Visual supports for multi-step instructions</li>
                        <li>Structured organization systems for homework management</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-between">
                  <Button variant="outline" className="border-lavender-200 text-lavender-800">Save Draft</Button>
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white">Complete Report</Button>
                </div>
              </motion.div>
              
              <div className="absolute -z-10 -top-6 -right-6 w-32 h-32 bg-coral-200 opacity-30 rounded-full blur-2xl"></div>
              <div className="absolute -z-10 -bottom-8 -left-8 w-40 h-40 bg-teal-200 opacity-30 rounded-full blur-2xl"></div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="workflow" className="py-20 bg-gradient-to-br from-teal-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How <span className={gradientTextClass}>PsychedHire!</span> Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our streamlined process connects schools with qualified psychologists quickly and efficiently.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workflowSteps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-md border border-teal-100 relative overflow-hidden group"
                  whileHover={{
                    y: -5,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                >
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-teal-50 rounded-full opacity-70 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6">
                      <motion.div 
                        className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-600"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.7 }}
                      >
                        <StepIcon className="h-6 w-6" />
                      </motion.div>
                      <span className="text-3xl font-bold text-teal-200">{step.number}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-3 py-1 mb-4 bg-coral-100 text-coral-800 rounded-full text-sm font-medium">
              <Star className="w-4 h-4 mr-2 text-coral-600" />
              Success Stories
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Educators <span className={gradientTextClass}>Nationwide</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what schools and psychologists are saying about our platform.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-md border border-lavender-100"
                whileHover={{
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
              >
                <div className="mb-6 text-teal-600">
                  {[...Array(5)].map((_, i) => (
                    <motion.span 
                      key={i} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 + (i * 0.1) }}
                    >
                      <Star className="inline w-5 h-5 fill-current" />
                    </motion.span>
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-6">"{testimonial.quote}"</blockquote>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-lavender-100 rounded-full flex items-center justify-center text-lavender-600 font-bold mr-3">
                    {testimonial.author.split(' ').map(name => name[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.position}</p>
                    <p className="text-xs text-teal-600">{testimonial.organization}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link to="/success-stories">
              <Button variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50">
                View All Success Stories <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-lavender-50 to-teal-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-coral-200/20 to-teal-200/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-lavender-200/20 to-coral-200/20 blur-3xl rounded-full translate-y-1/2 -translate-x-1/3"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-lavender-100 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            whileHover={{ 
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            }}
          >
            <motion.h2 
              className="text-3xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Ready to Transform Your <span className={gradientTextClass}>School Psychology</span> Services?
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Join PsychedHire! today to streamline your hiring process and better support your students.
            </motion.p>
            <motion.div 
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/district-signup">
                  <Button size="lg" className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white">
                    Sign Up as District
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/psychologist-signup">
                  <Button size="lg" className="bg-gradient-to-r from-lavender-600 to-lavender-500 hover:from-lavender-700 hover:to-lavender-600 text-white">
                    Sign Up as Psychologist
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-lavender-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-sm font-medium text-gray-800 mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><Link to="#features" className="text-gray-600 hover:text-teal-600 text-sm">Features</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-teal-600 text-sm">Security</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-teal-600 text-sm">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-800 mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-600 hover:text-teal-600 text-sm">Blog</Link></li>
                <li><Link to="/success-stories" className="text-gray-600 hover:text-teal-600 text-sm">Success Stories</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-teal-600 text-sm">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-800 mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-600 hover:text-teal-600 text-sm">About</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-teal-600 text-sm">Careers</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-teal-600 text-sm">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-800 mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-600 hover:text-teal-600 text-sm">Privacy</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-teal-600 text-sm">Terms</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-teal-600 text-sm">Security</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-lavender-100 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <ThirdLandingLogo />
            </div>
            <div className="text-sm text-gray-500">
              © 2025 PsychedHire. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ThirdLandingPage;
