import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
const Signin = () => {
  const navigate=useNavigate();
    const [formData,setFormData]=useState({
     
      email:"",
      password:"",
    })
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log('Form submitted:', formData);
    
      try {
        const response = await axios.post("http://localhost:8080/api/v1/user/signin", formData);
        console.log('Server Response:', response.data);
       navigate("/dashboard");
      } catch (error) {
        console.error('Error submitting the form:', error.response?.data || error.message);
      }
    };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-4">Sign In</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
       
      
        <div className="flex flex-col">
          <label htmlFor="email" className="text-sm font-medium text-gray-700" >Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={handleChange}
           value={formData.password}
            placeholder="The password must be at least 6 characters long"
            required
            className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button
          type="submit"
         
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-200"
        >
          Sign In
        </button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-4">
        Do not have an account? <Link to="/signup" className="text-green-500 hover:underline">SignUp</Link>
      </p>
    </div>
  </div>
  );
};

export default Signin;
