
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const ThirdLandingLogo = () => {
  return (
    <Link to="/third-landing-page" className="flex items-center group">
      <motion.div 
        className="bg-gradient-to-r from-teal-600 to-teal-400 font-bold px-3 py-1.5 text-white mr-1 rounded-l-lg"
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
        className="bg-gradient-to-r from-coral-400 to-coral-300 font-bold px-3 py-1.5 text-white rounded-r-lg"
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.05 }}
      >
        Hire!
      </motion.div>
    </Link>
  );
};

export default ThirdLandingLogo;
