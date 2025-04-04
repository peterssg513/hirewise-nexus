
import { Search, FileText, Calendar, Award, ClipboardCheck } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface HeroStat {
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  title: string;
  description: string;
}

interface Benefit {
  icon: LucideIcon;
  iconColor: string;
  borderColor: string;
  title: string;
  description: string;
  features: string[];
}

interface ProcessStep {
  number: number;
  title: string;
  description: string;
  features: string[];
  borderColor: string;
  dotColor: string;
}

interface Testimonial {
  initials: string;
  name: string;
  role: string;
  organization: string;
  quote: string;
  bgColor: string;
  slug: string;
}

interface PsychologistLandingData {
  heroStats: HeroStat[];
  benefits: Benefit[];
  processSteps: ProcessStep[];
  testimonials: Testimonial[];
}

export const setupPsychologistLandingData = (): PsychologistLandingData => {
  const heroStats = [
    {
      icon: Search,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
      title: "Find Jobs Easily",
      description: "Match your skills & availability"
    },
    {
      icon: FileText,
      iconColor: "text-green-600",
      bgColor: "bg-green-100",
      title: "AI-Assisted Reports",
      description: "Save hours on each evaluation"
    },
    {
      icon: Calendar,
      iconColor: "text-amber-600",
      bgColor: "bg-amber-100",
      title: "Flexible Scheduling",
      description: "Work on your own terms"
    }
  ];

  const benefits = [
    {
      icon: Search,
      iconColor: "text-psyched-lightBlue",
      borderColor: "border-t-psyched-lightBlue",
      title: "Find Opportunities Easily",
      description: "Browse and apply to opportunities that match your skills, expertise, and availability.",
      features: [
        "Advanced filtering options",
        "Skill-based matching",
        "Email alerts for new opportunities"
      ]
    },
    {
      icon: Calendar,
      iconColor: "text-psyched-yellow",
      borderColor: "border-t-psyched-yellow",
      title: "Flexible Scheduling",
      description: "Choose jobs that fit your schedule and work on your own terms.",
      features: [
        "Part-time and full-time options",
        "Remote and on-site positions",
        "Availability calendar management"
      ]
    },
    {
      icon: FileText,
      iconColor: "text-psyched-orange",
      borderColor: "border-t-psyched-orange",
      title: "AI-Assisted Reporting",
      description: "Our AI tools help streamline report writing, saving you time while maintaining quality.",
      features: [
        "Smart templates and formatting",
        "Compliance checking",
        "Customizable to your writing style"
      ]
    }
  ];

  const processSteps = [
    {
      number: 1,
      title: "Create Your Profile",
      description: "Sign up and showcase your qualifications, experience, and availability.",
      features: [
        "Upload credentials",
        "Set your availability",
        "Highlight your specialties"
      ],
      borderColor: "border-l-psyched-yellow",
      dotColor: "bg-psyched-yellow"
    },
    {
      number: 2,
      title: "Browse Opportunities",
      description: "Find jobs that match your skills, location preferences, and availability.",
      features: [
        "Advanced search filters",
        "Save favorite listings",
        "Quick application process"
      ],
      borderColor: "border-l-psyched-lightBlue",
      dotColor: "bg-psyched-lightBlue"
    },
    {
      number: 3,
      title: "Complete Evaluations",
      description: "Perform evaluations using our structured, compliance-friendly platform.",
      features: [
        "Structured protocols",
        "Digital data collection",
        "Progress tracking"
      ],
      borderColor: "border-l-psyched-orange",
      dotColor: "bg-psyched-orange"
    },
    {
      number: 4,
      title: "Submit Reports",
      description: "Use our AI-assisted tools to generate and submit comprehensive reports.",
      features: [
        "AI writing assistance",
        "Compliance verification",
        "Secure submission"
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
      bgColor: "bg-psyched-lightBlue/20",
      slug: "denver-public-schools"
    },
    {
      initials: "KC",
      name: "District Office",
      role: "Special Education Department",
      organization: "Kansas City Public Schools",
      quote: "Thanks to PsychedHire, we scaled faster than we ever imagined — and with the right people. We achieved 542% staffing growth in just 4 years, going from 14 staff to over 90 specialized professionals.",
      bgColor: "bg-psyched-orange/20",
      slug: "kansas-city-public-schools"
    },
    {
      initials: "MRD",
      name: "Consortium Leaders",
      role: "Regional Administration",
      organization: "Midwestern Regional District",
      quote: "We went from scattered coverage to a fully scaled, coordinated system in just a few years - thanks to PsychedHire.",
      bgColor: "bg-psyched-yellow/20",
      slug: "midwestern-regional-district"
    }
  ];

  return {
    heroStats,
    benefits,
    processSteps,
    testimonials
  };
};
