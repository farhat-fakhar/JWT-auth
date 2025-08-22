import React from "react";

const Welcome = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-100">
 

      {/* Hero Section */}
      <main className="flex flex-1 items-center justify-center px-6 text-center">
        <div className="max-w-2xl">
          <h2 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
           Secure Your Journey with <span className="text-blue-600">JWT</span>
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            A modern authentication practice app built with React & Node.js.
            Learn how JSON Web Tokens make login and signup secure & scalable.
          </p>
          
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-gray-500 text-sm">
        © {new Date().getFullYear()} AuthApp — Built for learning JWT Auth 🔑
      </footer>
    </div>
  );
};

export default Welcome;
