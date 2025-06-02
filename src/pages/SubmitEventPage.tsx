import React from 'react';
import Layout from '../components/layout/Layout';
import EventSubmissionForm from '../components/events/EventSubmissionForm';

const SubmitEventPage: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={{ backgroundImage: "url('/Sprinkle.svg')", backgroundRepeat: 'repeat', backgroundSize: '500px', backgroundPosition: 'center' }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Submit Your Event</h1>
          <p className="mt-1 text-sm text-gray-500">
            Share your tech event with the community. Our team will review your submission and get back to you soon.
          </p>
        </div>
        
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <EventSubmissionForm />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SubmitEventPage; 