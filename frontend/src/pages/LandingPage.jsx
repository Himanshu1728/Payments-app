import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaPaperPlane, FaMoneyCheckAlt, FaLock, FaUserCheck } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

const LandingPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('Authorization');
    if (token) {
      api
        .get('/me', { headers: { Authorization: token } })
        .then((response) => {
          console.log(response.data);
          setIsAuthenticated(true);
        })
        .catch((error) => {
          console.log(error);
          setIsAuthenticated(false);
        });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100">
      <header className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg shadow-md sticky top-0 z-50">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FaLeaf className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-yellow-500">
              NovaPay
            </span>
          </div>
          <div className="hidden md:flex space-x-8">
            {['Explore', 'Secure Transactions', 'Get Started'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-gray-700 hover:text-green-600 transition duration-300"
              >
                {item}
              </a>
            ))}
          </div>
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="bg-gradient-to-r from-green-600 to-yellow-500 text-white px-6 py-2 rounded-full hover:from-green-700 hover:to-yellow-600 transition duration-300 transform hover:scale-105"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              to="/signup"
              className="bg-gradient-to-r from-green-600 to-yellow-500 text-white px-6 py-2 rounded-full hover:from-green-700 hover:to-yellow-600 transition duration-300 transform hover:scale-105"
            >
              Sign Up / Sign In
            </Link>
          )}
        </nav>
      </header>

      <main>
        <section className="container mx-auto px-6 py-24 text-center relative overflow-hidden">
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Manage Your Payments
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-yellow-500">
                With Ease.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Send money, track expenses, and enjoy seamless transactions with NovaPay.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <motion.a
                href="/signup"
                className="bg-gradient-to-r from-green-600 to-yellow-500 text-white px-8 py-3 rounded-full hover:from-green-700 hover:to-yellow-600 transition duration-300 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started <FaPaperPlane className="ml-2 w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
            <svg
              className="absolute w-full h-full"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#A7F3D0"
                d="M41.2,-70.6C54.9,-64.1,68.1,-55.3,76.7,-42.9C85.3,-30.5,89.3,-15.2,88.2,-0.6C87.1,14,80.9,28,72.6,40.4C64.3,52.8,53.9,63.6,41.1,70.3C28.3,77,14.1,79.6,-0.7,80.9C-15.5,82.2,-31,82.2,-44.1,75.8C-57.2,69.4,-67.9,56.5,-75.1,42.1C-82.3,27.7,-86,13.9,-84.6,0.8C-83.2,-12.3,-76.8,-24.6,-69.1,-35.9C-61.5,-47.2,-52.7,-57.5,-41.4,-65.4C-30.1,-73.3,-15,-78.9,-0.2,-78.5C14.6,-78.1,29.2,-71.8,41.2,-70.6Z"
                transform="translate(100 100)"
              />
            </svg>
          </div>
        </section>

        <section id="explore" className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-yellow-500">
              Explore Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: FaLock, title: 'Secure Payments', description: 'Your transactions are fully encrypted and safe.' },
                { icon: FaMoneyCheckAlt, title: 'Instant Transfers', description: 'Send and receive money in seconds with zero hassle.' },
                { icon: FaUserCheck, title: 'User Friendly', description: 'Simple and intuitive interface for quick payments.' },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-green-50 to-yellow-50 p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition duration-300"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <feature.icon className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-600 mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-green-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2025 NovaPay. All rights reserved.</p>
          <div className="mt-4">
            <a href="#" className="text-green-300 hover:text-white mx-2">Privacy Policy</a>
            <a href="#" className="text-green-300 hover:text-white mx-2">Terms of Service</a>
            <a href="#" className="text-green-300 hover:text-white mx-2">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
