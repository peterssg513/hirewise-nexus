
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export const AuthButtons = () => {
  return (
    <div className="flex items-center space-x-3">
      <Link to="/login">
        <Button variant="ghost" className="text-psyched-darkBlue">
          Log in
        </Button>
      </Link>
      <Link to="/register">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <Button className="bg-psyched-darkBlue text-white hover:bg-psyched-darkBlue/90">
            Sign up
          </Button>
        </motion.div>
      </Link>
    </div>
  );
};
