
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const BrandGuideLogo = ({ showDownload = false }: { showDownload?: boolean }) => {
  return (
    <div className="flex items-center gap-4">
      <Link to="/brand-guide" className="flex items-center group">
        <motion.div 
          className="bg-gradient-to-r from-indigo-600 to-purple-600 font-bold px-3 py-1.5 text-white mr-1 rounded-md shadow-md"
          whileHover={{ scale: 1.05 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 10
          }}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Psyched
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          className="text-gray-800 dark:text-white font-semibold"
        >
          Hire!
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
