import React from "react";

const Hero = () => {
  return (
    <section className="bg-gray-50">
      <div className="container mx-auto px-6 py-10 text-center md:text-left sm:text-left">
        {/* Hero Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          Simple & Secure <span className="text-blue-600">Authentication</span>{" "}
          for Practice
        </h1>

        {/* Hero Subtext */}
        <p className="mt-6 text-lg text-gray-600 md:w-3/4">
          A lightweight authentication system built with modern web technologies. 
          Practice project featuring 
          <span className="font-semibold">JWT (JSON Web Token) authentication</span> 
          for secure login and session management.
        </p>

        {/* Features List (compact style) */}
        <ul className="mt-4 text-sm text-gray-700 space-y-1 md:w-3/4">
          <li>✅ User Registration with validation</li>
          <li>✅ Login with JWT authentication</li>
          <li>✅ Secure protected routes</li>
          <li>✅ Logout & token handling</li>
        </ul>

        {/* CTA Button */}
        <div className="mt-6 flex justify-center md:justify-start">
          <button className="px-4 py-2 bg-blue-900 cursor-pointer text-white font-medium rounded-lg shadow-lg hover:bg-blue-700 transition duration-300">
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
