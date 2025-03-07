import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          x: [0, 15, -15, 0]
        }}
        transition={{
          duration: 1.5,
          ease: "anticipate",
          repeat: Infinity,
          repeatType: "loop"
        }}
        className="relative flex flex-col items-center w-full max-w-[280px] space-y-3"
      >
        <motion.div 
          className="relative flex items-center justify-center"
          animate={{
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop"
          }}
        >
          <motion.div
            className="absolute inset-0 bg-blue-500/10 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.2, 0.5]
            }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop"
            }}
          />
          <motion.img 
            src="/src/logo.png" 
            alt="Business Options Logo" 
            className="w-32 h-32 object-contain relative z-10"
            initial={{ scale: 1 }}
            animate={{ 
              scale: [1, 1.05, 1],
              rotateY: [0, 20, -20, 0]
            }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop"
            }}
          />
        </motion.div>
        
        <motion.div
          initial={{ width: 0 }}
          animate={{ 
            width: ['0%', '60%', '0%'],
            opacity: [0, 0.5, 0]
          }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop"
          }}
          className="h-1 bg-blue-500/50 rounded-full"
        />
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            y: [10, 0, 10]
          }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop"
          }}
          className="text-sm text-gray-700 font-medium tracking-wide"
        >
          Preparing your experience
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;