import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
const Hero = () => {
  return <section className="pt-20 pb-20 bg-gradient-to-br from-psyched-purple via-psyched-indigo to-psyched-darkPurple text-white relative overflow-hidden bg-violet-600">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-psyched-indigo/30 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-psyched-lightPurple/30 rounded-full blur-3xl"></div>
      
      {/* Animated stars */}
      <div className="absolute top-20 right-[20%] magic-star">
        <Sparkles className="h-6 w-6 text-yellow-300" />
      </div>
      <div className="absolute bottom-20 left-[20%] magic-star" style={{
      animationDelay: '2s'
    }}>
        <Sparkles className="h-4 w-4 text-yellow-300" />
      </div>
      <div className="absolute top-40 left-[10%] magic-star" style={{
      animationDelay: '1s'
    }}>
        <Sparkles className="h-5 w-5 text-yellow-300" />
      </div>
      <div className="absolute bottom-40 right-[10%] magic-star" style={{
      animationDelay: '3s'
    }}>
        <Sparkles className="h-7 w-7 text-yellow-300" />
      </div>
      
      <div className="psyched-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center px-4 py-1.5 mb-4 bg-white/10 text-white rounded-full text-sm font-medium backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2 text-yellow-300" />
              The power of AI to help schools
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Psyched<span className="text-yellow-300">Hire!</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-lg leading-relaxed">
              The most loved, secure, and trusted AI platform for
              <span className="font-medium text-white"> school psychologists and schools.</span>
            </p>
            
            <ul className="mb-8 space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0 mr-2 mt-1 bg-white/20 rounded-full p-1">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="text-white/90">Find qualified psychologists quickly</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mr-2 mt-1 bg-white/20 rounded-full p-1">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="text-white/90">Streamline evaluations and reduce backlogs</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 mr-2 mt-1 bg-white/20 rounded-full p-1">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="text-white/90">AI-assisted reporting to save time</span>
              </li>
            </ul>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/for-psychologists">
                <Button size="lg" className="group text-psyched-purple bg-slate-950 hover:bg-slate-800">
                  Teachers sign up free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/for-districts">
                <Button size="lg" className="group bg-psyched-purple/30 border border-white/30 backdrop-blur-sm text-white hover:bg-white/20">
                  Schools learn more
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            
            <p className="mt-4 text-sm text-white/70 italic">
              Built by School Psychologists. For School Psychologists.
            </p>
          </div>
          
          <div className="hidden lg:block relative">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 shadow-xl border border-white/20 transform rotate-1 z-20 relative">
              <div className="flex space-x-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              
              <div className="relative">
                <img alt="PsychedHire Screenshot" className="rounded-md w-full shadow-lg border border-white/30" src="/lovable-uploads/917f5e68-3967-473b-bc3e-69479c38263f.png" />
                <div className="absolute -top-6 -right-6">
                  <Sparkles className="h-10 w-10 text-yellow-300 opacity-80" />
                </div>
              </div>
            </div>
            
            <div className="absolute top-4 -left-4 -z-10 w-full h-full bg-psyched-indigo/40 rounded-lg blur-sm"></div>
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;