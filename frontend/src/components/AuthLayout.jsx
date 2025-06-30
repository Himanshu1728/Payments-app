import React from 'react';
import { motion } from 'framer-motion';
import { FaLeaf } from 'react-icons/fa'; // Changed icon for uniqueness

function AuthLayout({ children, title }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-amber-50 to-yellow-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl hover:shadow-emerald-300 transition duration-300"
      >
        <div>
          <motion.div
            initial={{ rotate: -180 }}
            animate={{ rotate: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 10 }}
            className="mx-auto h-14 w-14 text-emerald-600"
          >
            <FaLeaf className="w-full h-full" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-6 text-center text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-amber-500"
          >
            {title}
          </motion.h2>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

export default AuthLayout;
