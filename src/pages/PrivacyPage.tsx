import React from 'react';
import Layout from '../components/layout/Layout';

const PrivacyPage: React.FC = () => (
  <Layout>
    <div className="min-h-screen py-16 px-2 flex flex-col items-center justify-center" style={{ backgroundColor: '#fef3c7' }}>
      <div className="max-w-2xl w-full mx-auto bg-white rounded-3xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-accent-black mb-6 font-mono">Privacy Policy</h1>
        <p className="text-accent-black font-mono mb-4">
          We value your privacy. Loopin only collects the information necessary to provide you with the best event discovery experience. We do not sell your data to third parties. Any information you provide (such as your email for event submissions or contact) is used solely for communication and platform improvement. For any privacy concerns, please contact us at <a href="mailto:contact@loopin.com" className="underline">contact@loopin.com</a>.
        </p>
      </div>
    </div>
  </Layout>
);

export default PrivacyPage; 