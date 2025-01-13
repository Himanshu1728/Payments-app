import { useState, useEffect } from "react";
import { ArrowRight, Cloud } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";

export default function LandingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("Authorization");
    if (token) {
      axios
        .get("http://localhost:8080/api/v1/me", {
          headers: { Authorization: token },
        })
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Cloud className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-800">PaymentsApp</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition">
              How It Works
            </a>
            <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition">
              Testimonials
            </a>
          </div>
          {isAuthenticated ? (
            <a
              href="/dashboard"
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
            >
              Dashboard
            </a>
          ) : (
            <div className="flex space-x-4">
              <a href="/signin" className="text-gray-700 hover:text-blue-600 transition">
                Sign In
              </a>
              <a
                href="/signup"
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
              >
                Sign Up
              </a>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <main>
        <section className="container mx-auto px-6 py-24 text-center relative">
          <div className="absolute inset-0 opacity-10">
            <Cloud className="w-full h-full text-blue-300" />
          </div>
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
              Simplify Your Payments<br />
              <span className="text-blue-600">Your Way.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Make secure transactions, manage your expenses, and connect with others effortlessly—all in one place.
            </p>
            <div className="flex justify-center space-x-4">
              <motion.a
                href="/signup"
                className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition flex items-center"
                initial={{ x: -200 }}
                animate={{ x: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </motion.a>
              <motion.a
                href="#features"
                className="bg-white text-blue-600 px-8 py-3 rounded-full hover:bg-blue-50 transition border border-blue-600"
                initial={{ x: 200 }}
                animate={{ x: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                Learn More
              </motion.a>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-white py-16">
  <div className="container mx-auto px-6">
    <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Features</h2>
    <motion.div
      className="grid grid-cols-1 md:grid-cols-3 gap-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="bg-blue-50 p-8 rounded-lg shadow-md text-center hover:bg-blue-100 transition"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="mb-4">
          <Cloud className="w-12 h-12 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-blue-600 mb-4">Secure Payments</h3>
        <p className="text-gray-600">
          Enjoy end-to-end encryption to ensure your transactions remain secure and private.
        </p>
      </motion.div>
      <motion.div
        className="bg-blue-50 p-8 rounded-lg shadow-md text-center hover:bg-blue-100 transition"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="mb-4">
          <ArrowRight className="w-12 h-12 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-blue-600 mb-4">Expense Tracking</h3>
        <p className="text-gray-600">
          Stay on top of your finances with intuitive tracking tools and reports.
        </p>
      </motion.div>
      <motion.div
        className="bg-blue-50 p-8 rounded-lg shadow-md text-center hover:bg-blue-100 transition"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="mb-4">
          <ArrowRight className="w-12 h-12 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-blue-600 mb-4">Seamless Collaboration</h3>
        <p className="text-gray-600">
          Collaborate with friends, family, or colleagues effortlessly with payment links.
        </p>
      </motion.div>
    </motion.div>
  </div>
</section>


        {/* How It Works Section */}
        <section id="how-it-works" className="bg-gray-50 py-16">
  <div className="container mx-auto px-6">
    <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">How It Works</h2>
    <motion.div
      className="flex flex-wrap justify-center gap-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="p-8 bg-white rounded-lg shadow-lg max-w-xs text-center hover:bg-blue-50 transition"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="mb-4">
          <Cloud className="w-12 h-12 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-blue-600 mb-4">1. Create Account</h3>
        <p className="text-gray-600">
          Sign up and set up your profile with ease.
        </p>
      </motion.div>
      <motion.div
        className="p-8 bg-white rounded-lg shadow-lg max-w-xs text-center hover:bg-blue-50 transition"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="mb-4">
          <ArrowRight className="w-12 h-12 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-blue-600 mb-4">2. Send Requests</h3>
        <p className="text-gray-600">
          Request money with a few clicks from your contacts.
        </p>
      </motion.div>
      <motion.div
        className="p-8 bg-white rounded-lg shadow-lg max-w-xs text-center hover:bg-blue-50 transition"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="mb-4">
          <ArrowRight className="w-12 h-12 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-blue-600 mb-4">3. Add Funds</h3>
        <p className="text-gray-600">
          Add funds seamlessly to your account from multiple sources.
        </p>
      </motion.div>
      <motion.div
        className="p-8 bg-white rounded-lg shadow-lg max-w-xs text-center hover:bg-blue-50 transition"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="mb-4">
          <ArrowRight className="w-12 h-12 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-blue-600 mb-4">4. Make Payments</h3>
        <p className="text-gray-600">
          Pay for services or send money with a simple click.
        </p>
      </motion.div>
    </motion.div>
  </div>
</section>


        {/* Testimonials Section */}
        <section id="testimonials" className="bg-blue-50 py-16">
  <div className="container mx-auto px-6">
    <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">What Our Users Say</h2>
    <motion.div
      className="flex flex-wrap justify-center gap-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="bg-white p-8 rounded-lg shadow-md text-center max-w-xs"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <p className="text-gray-600 mb-4">
          "This app made my payments so much easier! The process is smooth and intuitive."
        </p>
        <h4 className="font-bold text-blue-600">John Doe</h4>
        <p className="text-gray-500">Small Business Owner</p>
      </motion.div>
      <motion.div
        className="bg-white p-8 rounded-lg shadow-md text-center max-w-xs"
        initial={{ x: 100 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <p className="text-gray-600 mb-4">
          "I love the expense tracking feature! It's so easy to keep track of everything."
        </p>
        <h4 className="font-bold text-blue-600">Jane Smith</h4>
        <p className="text-gray-500">Freelancer</p>
      </motion.div>
    </motion.div>
  </div>
</section>

      </main>
    </div>
  );
}
