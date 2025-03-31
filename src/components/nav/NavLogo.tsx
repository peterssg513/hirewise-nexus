
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const NavLogo = () => {
  return (
    <Link to="/" className="flex items-center group">
      <motion.div 
        className="bg-psyched-yellow font-bold px-2 py-1 text-psyched-darkBlue mr-1 rounded"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        Psyched
      </motion.div>
      <motion.div 
        className="text-psyched-darkBlue font-semibold"
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        Hire!
      </motion.div>
    </Link>
  );
};
