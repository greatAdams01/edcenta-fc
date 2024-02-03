'use client'
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AnimationProps {
  children: ReactNode;
}

const Animation: React.FC<AnimationProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1}}
      exit={{ opacity: 0}}
      transition={{ delay: 2 }}
      className="flex w-full flex-col"
    >
      {children}
    </motion.div>
  );
};

export default Animation;
