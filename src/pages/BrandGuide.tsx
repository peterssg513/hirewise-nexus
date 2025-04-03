
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, X, Copy } from 'lucide-react';
import BrandGuideLogo from '@/components/nav/BrandGuideLogo';
import AIInspiredLogo from '@/components/nav/AIInspiredLogo';
import { toast } from "sonner";

const BrandGuide = () => {
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
  
  // Color palette
  const brandColors = [
    { name: "Purple 600", hex: "#9333EA", class: "bg-purple-600" },
    { name: "Violet 500", hex: "#8B5CF6", class: "bg-violet-500" },
    { name: "Purple 700", hex: "#7E22CE", class: "bg-purple-700" },
    { name: "Violet 600", hex: "#7C3AED", class: "bg-violet-600" },
    { name: "White", hex: "#FFFFFF", class: "bg-white" },
    { name: "Gray 50", hex: "#F9FAFB", class: "bg-gray-50" },
    { name: "Gray 100", hex: "#F3F4F6", class: "bg-gray-100" },
    { name: "Gray 600", hex: "#4B5563", class: "bg-gray-600" },
    { name: "Gray 800", hex: "#1F2937", class: "bg-gray-800" },
    { name: "Green 500", hex: "#10B981", class: "bg-green-500" },
    { name: "Amber 500", hex: "#F59E0B", class: "bg-amber-500" },
    { name: "Red 500", hex: "#EF4444", class: "bg-red-500" },
  ];

  // Gradients
  const gradients = [
    { 
      name: "Primary Gradient", 
      class: "from-purple-600 to-violet-500",
      code: "bg-gradient-to-r from-purple-600 to-violet-500" 
    },
    { 
      name: "Secondary Gradient", 
      class: "from-purple-700 to-violet-600",
      code: "bg-gradient-to-r from-purple-700 to-violet-600" 
    },
    { 
      name: "Accent Gradient", 
      class: "from-violet-500 to-fuchsia-500",
      code: "bg-gradient-to-r from-violet-500 to-fuchsia-500" 
    },
    { 
      name: "Success Gradient", 
      class: "from-green-400 to-emerald-500",
      code: "bg-gradient-to-r from-green-400 to-emerald-500" 
    },
    { 
      name: "Warning Gradient", 
      class: "from-amber-400 to-orange-500",
      code: "bg-gradient-to-r from-amber-400 to-orange-500" 
    },
  ];

  // Typography
  const fonts = [
    {
      name: "Inter",
      description: "Primary font for all body text and UI elements",
      weights: ["400 (Regular)", "500 (Medium)", "600 (Semibold)", "700 (Bold)"],
      example: "The quick brown fox jumps over the lazy dog.",
      class: "font-sans",
      code: "font-sans"
    },
    {
      name: "Poppins",
      description: "Used for headings and important UI elements",
      weights: ["500 (Medium)", "600 (Semibold)", "700 (Bold)"],
      example: "The quick brown fox jumps over the lazy dog.",
      class: "font-poppins",
      code: "font-poppins"
    },
  ];

  // Icons we commonly use
  const commonIcons = [
    { name: "ArrowRight", component: <ArrowRight className="text-purple-600" /> },
    { name: "ArrowLeft", component: <ArrowLeft className="text-purple-600" /> },
    { name: "Check", component: <Check className="text-green-500" /> },
    { name: "X", component: <X className="text-red-500" /> },
    { name: "Copy", component: <Copy className="text-gray-600" /> },
  ];

  // Button variants
  const buttonVariants = [
    {
      name: "Default",
      element: <Button>Default Button</Button>
    },
    {
      name: "Default with Icon",
      element: <Button>Default with Icon <ArrowRight className="ml-2 h-4 w-4" /></Button>
    },
    {
      name: "Primary",
      element: <Button className="bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600">Primary Button</Button>
    },
    {
      name: "Secondary",
      element: <Button variant="secondary">Secondary Button</Button>
    },
    {
      name: "Outline",
      element: <Button variant="outline" className="border-purple-500 text-purple-600 hover:bg-purple-50">Outline Button</Button>
    },
    {
      name: "Ghost",
      element: <Button variant="ghost">Ghost Button</Button>
    },
    {
      name: "Success",
      element: <Button className="bg-green-500 hover:bg-green-600 text-white">Success Button</Button>
    },
  ];

  // Helper function to copy text to clipboard
  const copyToClipboard = (text: string, description: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${description} to clipboard!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <header className="bg-gradient-to-r from-purple-600 to-violet-500 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <BrandGuideLogo />
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#colors" className="text-white/90 hover:text-white px-3 py-2 text-sm font-medium">Colors</a>
              <a href="#gradients" className="text-white/90 hover:text-white px-3 py-2 text-sm font-medium">Gradients</a>
              <a href="#typography" className="text-white/90 hover:text-white px-3 py-2 text-sm font-medium">Typography</a>
              <a href="#logo" className="text-white/90 hover:text-white px-3 py-2 text-sm font-medium">Logo</a>
              <a href="#icons" className="text-white/90 hover:text-white px-3 py-2 text-sm font-medium">Icons</a>
              <a href="#buttons" className="text-white/90 hover:text-white px-3 py-2 text-sm font-medium">Buttons</a>
            </nav>
            <div>
              <Link to="/ai-inspired-design">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Landing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-violet-500 mb-4"
            >
              PsychedHire! Brand Guide
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              A comprehensive guide to our brand identity, design system, and visual language
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-8 bg-white p-6 rounded-lg shadow-md border border-gray-100"
            >
              <p className="text-lg font-medium text-gray-800 italic">
                "Built by School Psychologists. For School Psychologists."
              </p>
            </motion.div>
          </motion.section>

          {/* Brand Story */}
          <section className="mb-20">
            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Our Brand Story</h2>
              <p className="text-gray-600 mb-4">
                PsychedHire! was created to address the significant challenges K-12 schools face in efficiently connecting with qualified psychologists for job postings and evaluations. Our platform streamlines the hiring process, simplifies evaluations and reporting, and improves match quality between schools and psychology professionals.
              </p>
              <p className="text-gray-600">
                Our visual identity reflects our commitment to innovation, efficiency, and support. The vibrant purple and violet palette conveys creativity and trust, while our clean, modern design ensures a seamless user experience that feels both professional and approachable.
              </p>
            </div>
          </section>

          {/* Colors Section */}
          <motion.section 
            id="colors" 
            className="mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 
              variants={fadeIn}
              custom={0}
              className="text-3xl font-bold mb-8 pb-2 border-b border-gray-200"
            >
              Colors
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              custom={1}
              className="text-gray-600 mb-8"
            >
              Our color palette is designed to convey innovation, trust, and creativity. The primary purple and violet hues are complemented by neutral grays and functional accent colors.
            </motion.p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {brandColors.map((color, index) => (
                <motion.div 
                  key={color.name}
                  variants={fadeIn}
                  custom={index + 2}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
                  whileHover={{ y: -5, transition: { duration: 0.3 } }}
                >
                  <div 
                    className={`h-24 ${color.class} ${color.name === "White" ? "border border-gray-200" : ""}`}
                  ></div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-800">{color.name}</h3>
                    <p className="text-gray-500 text-sm">{color.hex}</p>
                    <button 
                      onClick={() => copyToClipboard(color.hex, color.name)}
                      className="mt-2 text-purple-600 hover:text-purple-800 text-sm flex items-center"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy HEX
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Gradients Section */}
          <motion.section 
            id="gradients" 
            className="mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 
              variants={fadeIn}
              custom={0}
              className="text-3xl font-bold mb-8 pb-2 border-b border-gray-200"
            >
              Gradients
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              custom={1}
              className="text-gray-600 mb-8"
            >
              Gradients add depth and visual interest to our designs. They're primarily used for buttons, section backgrounds, and decorative elements.
            </motion.p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gradients.map((gradient, index) => (
                <motion.div 
                  key={gradient.name}
                  variants={fadeIn}
                  custom={index + 2}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
                  whileHover={{ y: -5, transition: { duration: 0.3 } }}
                >
                  <div 
                    className={`h-32 bg-gradient-to-r ${gradient.class}`}
                  ></div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-800">{gradient.name}</h3>
                    <p className="text-gray-500 text-sm font-mono break-all">{gradient.code}</p>
                    <button 
                      onClick={() => copyToClipboard(gradient.code, gradient.name)}
                      className="mt-2 text-purple-600 hover:text-purple-800 text-sm flex items-center"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy code
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Typography Section */}
          <motion.section 
            id="typography" 
            className="mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 
              variants={fadeIn}
              custom={0}
              className="text-3xl font-bold mb-8 pb-2 border-b border-gray-200"
            >
              Typography
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              custom={1}
              className="text-gray-600 mb-8"
            >
              Our typography system uses clean, modern fonts that enhance readability across all devices and screen sizes.
            </motion.p>
            
            {fonts.map((font, index) => (
              <motion.div 
                key={font.name}
                variants={fadeIn}
                custom={index + 2}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 mb-6"
              >
                <div className="p-6">
                  <div className="flex flex-wrap items-start justify-between">
                    <div className="mb-4 md:mb-0">
                      <h3 className="text-xl font-bold text-gray-800">{font.name}</h3>
                      <p className="text-gray-600">{font.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Available weights:</p>
                      <ul className="text-xs text-gray-500">
                        {font.weights.map((weight, i) => (
                          <li key={i}>{weight}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-6 border-t border-gray-100 pt-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Example:</h4>
                    <div className={`${font.class} space-y-4`}>
                      <p className="text-4xl font-bold">Heading 1</p>
                      <p className="text-3xl font-bold">Heading 2</p>
                      <p className="text-2xl font-bold">Heading 3</p>
                      <p className="text-xl font-medium">Subtitle</p>
                      <p className="text-base">{font.example}</p>
                      <p className="text-sm">Small text: {font.example}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 border-t border-gray-100 pt-4 flex justify-end">
                    <button 
                      onClick={() => copyToClipboard(font.code, `${font.name} class`)}
                      className="text-purple-600 hover:text-purple-800 text-sm flex items-center"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy class: {font.code}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            
            <motion.div
              variants={fadeIn}
              custom={4}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Typography Guidelines</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  Use font sizes consistently across similar elements
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  Maintain adequate contrast between text and background
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  Use bold weights for emphasis rather than italics
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  Keep line heights between 1.5 and 1.7 for body text
                </li>
                <li className="flex items-start">
                  <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  Avoid using more than two font families in the same design
                </li>
                <li className="flex items-start">
                  <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  Don't mix too many font weights and sizes
                </li>
              </ul>
            </motion.div>
          </motion.section>

          {/* Logo Section */}
          <motion.section 
            id="logo" 
            className="mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 
              variants={fadeIn}
              custom={0}
              className="text-3xl font-bold mb-8 pb-2 border-b border-gray-200"
            >
              Logo
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              custom={1}
              className="text-gray-600 mb-8"
            >
              Our logo represents the innovative, modern approach we bring to connecting school psychologists with educational institutions.
            </motion.p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div 
                variants={fadeIn}
                custom={2}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
              >
                <div className="p-8 flex items-center justify-center bg-gradient-to-r from-purple-600 to-violet-500">
                  <div className="transform scale-150">
                    <BrandGuideLogo />
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-medium text-gray-800">Primary Logo (Light Text on Dark Background)</h3>
                  <p className="text-gray-500 text-sm">For use on dark or colored backgrounds</p>
                </div>
              </motion.div>
              
              <motion.div 
                variants={fadeIn}
                custom={3}
                className="bg-gray-100 rounded-lg shadow-md overflow-hidden border border-gray-200"
              >
                <div className="p-8 flex items-center justify-center">
                  <div className="transform scale-150">
                    <AIInspiredLogo />
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-medium text-gray-800">Secondary Logo (Dark Text)</h3>
                  <p className="text-gray-500 text-sm">For use on light backgrounds</p>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              variants={fadeIn}
              custom={4}
              className="mt-8 bg-white rounded-lg shadow-md p-6 border border-gray-100"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Logo Guidelines</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  Always maintain the logo's proportions when scaling
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  Ensure adequate spacing around the logo (minimum clear space equal to the height of "P")
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  Use the appropriate version based on background color
                </li>
                <li className="flex items-start">
                  <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  Don't stretch or distort the logo
                </li>
                <li className="flex items-start">
                  <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  Don't change the logo colors or apply effects
                </li>
                <li className="flex items-start">
                  <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  Don't place the logo on busy backgrounds that reduce visibility
                </li>
              </ul>
            </motion.div>
          </motion.section>

          {/* Icons Section */}
          <motion.section 
            id="icons" 
            className="mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 
              variants={fadeIn}
              custom={0}
              className="text-3xl font-bold mb-8 pb-2 border-b border-gray-200"
            >
              Icons
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              custom={1}
              className="text-gray-600 mb-8"
            >
              We use Lucide icons throughout our interface for their clean, consistent style and excellent readability.
            </motion.p>
            
            <motion.div 
              variants={fadeIn}
              custom={2}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-100 mb-8"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Commonly Used Icons</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {commonIcons.map((icon, index) => (
                  <div 
                    key={index} 
                    className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="h-10 w-10 flex items-center justify-center mb-2">
                      {icon.component}
                    </div>
                    <p className="text-xs text-gray-600">{icon.name}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              variants={fadeIn}
              custom={3}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Icon Guidelines</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  Use icons consistently to represent the same actions across the platform
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  Maintain consistent sizing within the same UI component
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  Pair icons with text labels for improved accessibility
                </li>
                <li className="flex items-start">
                  <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  Don't mix icon styles or use icons from multiple libraries
                </li>
                <li className="flex items-start">
                  <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  Avoid using too many icons in a single view
                </li>
              </ul>
            </motion.div>
          </motion.section>

          {/* Buttons Section */}
          <motion.section 
            id="buttons" 
            className="mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 
              variants={fadeIn}
              custom={0}
              className="text-3xl font-bold mb-8 pb-2 border-b border-gray-200"
            >
              Buttons
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              custom={1}
              className="text-gray-600 mb-8"
            >
              Our button system provides consistent, accessible interactive elements across the platform.
            </motion.p>
            
            <motion.div 
              variants={fadeIn}
              custom={2}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-100 mb-8"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6">Button Variants</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {buttonVariants.map((button, index) => (
                  <div 
                    key={index} 
                    className="flex flex-col space-y-2"
                  >
                    <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-center h-16">
                      {button.element}
                    </div>
                    <p className="text-sm text-gray-600 text-center">{button.name}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              variants={fadeIn}
              custom={3}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Button Guidelines</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  Use clear, action-oriented button text (e.g., "Save Changes" instead of "Submit")
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  Use icons to reinforce the action when helpful
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  Use the primary button for the main action in a form or page
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  Ensure adequate spacing between adjacent buttons
                </li>
                <li className="flex items-start">
                  <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  Don't use too many primary buttons on a single page
                </li>
                <li className="flex items-start">
                  <X className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  Don't use generic text like "Click Here" or "Submit"
                </li>
              </ul>
            </motion.div>
          </motion.section>

          {/* Design Principles */}
          <motion.section 
            className="mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 
              variants={fadeIn}
              custom={0}
              className="text-3xl font-bold mb-8 pb-2 border-b border-gray-200"
            >
              Design Principles
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Clarity",
                  description: "Eliminate ambiguity. Make everything clear and intuitive for users at all levels of experience."
                },
                {
                  title: "Efficiency",
                  description: "Streamline user workflows and reduce unnecessary steps to help users accomplish their goals quickly."
                },
                {
                  title: "Consistency",
                  description: "Create familiar patterns to help users navigate and use our platform with confidence."
                },
                {
                  title: "Accessibility",
                  description: "Design for users of all abilities and ensure our platform is usable by everyone."
                },
                {
                  title: "Feedback",
                  description: "Provide clear feedback for user actions to create a responsive and engaging experience."
                },
                {
                  title: "Delight",
                  description: "Add thoughtful touches and animations that make using our platform a joyful experience."
                }
              ].map((principle, index) => (
                <motion.div 
                  key={principle.title}
                  variants={fadeIn}
                  custom={index + 1}
                  className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
                  whileHover={{ y: -5, transition: { duration: 0.3 } }}
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{principle.title}</h3>
                  <p className="text-gray-600">{principle.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
            
          {/* Resources */}
          <motion.section 
            className="mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 
              variants={fadeIn}
              custom={0}
              className="text-3xl font-bold mb-8 pb-2 border-b border-gray-200"
            >
              Resources
            </motion.h2>
            
            <motion.div 
              variants={fadeIn}
              custom={1}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Design Assets</h3>
              <p className="text-gray-600 mb-6">
                Access our design assets, templates, and resources to ensure brand consistency across all materials.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  "Logo Package", "Brand Guidelines PDF", "UI Component Library", 
                  "Social Media Templates", "Email Templates", "Presentation Template"
                ].map((resource, index) => (
                  <div 
                    key={index} 
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between"
                  >
                    <span className="text-gray-700">{resource}</span>
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.section>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <BrandGuideLogo />
            <p className="mt-4">© 2025 PsychedHire. All rights reserved.</p>
            <p className="mt-2 text-gray-400 italic">
              "Built by School Psychologists. For School Psychologists."
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BrandGuide;
