
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const BrandGuideLogo = ({ showDownload = false }: { showDownload?: boolean }) => {
  return (
    <div className="flex items-center gap-4">
      <Link to="/brand-guide" className="flex items-center group">
        <motion.div 
          className="relative flex items-center"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="font-bold text-2xl">
            <span className="text-magic-purple">Magic</span>
            <span className="text-magic-indigo font-extrabold">School</span>
          </div>
          <Sparkles 
            size={16} 
            className="text-yellow-400 absolute -top-1 -right-4" 
          />
        </motion.div>
      </Link>
      
      {showDownload && (
        <Button 
          variant="outline" 
          size="sm"
          className="border-white/30 text-white hover:bg-white/10"
          onClick={(e) => e.stopPropagation()}
          asChild
        >
          <a id="download-pdf-link" href="#" className="flex items-center gap-1">
            <Download className="h-4 w-4" /> Download PDF
          </a>
        </Button>
      )}
    </div>
  );
};

export default BrandGuideLogo;
