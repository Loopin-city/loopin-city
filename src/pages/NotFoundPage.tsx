import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';

const NotFoundPage: React.FC = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] py-16 px-4" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>
        <div className="bg-white/80 shadow-lg rounded-3xl p-10 max-w-xl w-full text-center border-4 border-yellow-400 animate-fade-in-up">
          <div className="text-7xl mb-6">🚧</div>
          <h1 className="text-4xl font-extrabold text-yellow-500 mb-4">404 - Page Not Found</h1>
          <p className="text-lg text-gray-700 mb-6 font-medium">
            Oops! The page you're looking for doesn't exist or has moved.<br />
            Let's get you back to discovering awesome tech events!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Link to="/" className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-full px-8 py-3 shadow transition-colors text-lg sm:px-6 sm:py-2 sm:text-base sm:min-w-[160px]">Go to Home</Link>
            <Link to="/submit-event" className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-full px-8 py-3 shadow transition-colors text-lg sm:px-6 sm:py-2 sm:text-base sm:min-w-[160px]">Submit an Event</Link>
            <Link to="/communities" className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-full px-8 py-3 shadow transition-colors text-lg sm:px-6 sm:py-2 sm:text-base sm:min-w-[160px]">Communities</Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFoundPage; 