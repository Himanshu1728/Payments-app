import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import AuthLayout from '../components/AuthLayout';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/user/signup", formData);
      navigate("/signin");
    } catch (error) {
      console.error('Error submitting the form:', error.response?.data || error.message);
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create your account">
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm -space-y-px">
          {[
            { name: "FirstName", label: "First Name", type: "text", autoComplete: "given-name" },
            { name: "LastName", label: "Last Name", type: "text", autoComplete: "family-name" },
            { name: "email", label: "Email address", type: "email", autoComplete: "email" },
            { name: "password", label: "Password", type: "password", autoComplete: "new-password" },
          ].map((field, index) => (
            <motion.div
              key={field.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <label htmlFor={field.name} className="sr-only">{field.label}</label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                autoComplete={field.autoComplete}
                required
                className={`appearance-none rounded-none relative block w-full px-3 mb-2 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${
                  index === 0 ? 'rounded-t-md' : index === 3 ? 'rounded-b-md' : ''
                } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder={field.label}
                value={formData[field.name]}
                onChange={handleChange}
              />
            </motion.div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700 text-sm rounded-md">
            {error}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            type="submit"
            disabled={loading}
            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105`}
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Sign up"
            )}
          </button>
        </motion.div>
      </form>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-2 text-center text-sm text-gray-600"
      >
        Already have an account?{' '}
        <Link to="/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
          Sign in
        </Link>
      </motion.p>
    </AuthLayout>
  );
}

export default Signup;
