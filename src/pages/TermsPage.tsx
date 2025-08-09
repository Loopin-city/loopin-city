import React from 'react';
import Layout from '../components/layout/Layout';

const TermsPage: React.FC = () => (
  <Layout>
    <div className="min-h-screen py-16 px-2 flex flex-col items-center justify-center" style={{ backgroundColor: '#fef3c7' }}>
      <div className="max-w-2xl w-full mx-auto bg-white rounded-3xl shadow-lg p-8 border border-accent-black/10">
        <h1 className="text-3xl font-bold text-accent-black mb-6 font-mono border-b border-accent-black/10 pb-4">Terms of Service</h1>
        <p className="text-accent-black font-mono mb-4">
          By using Loopin, you agree to use the platform responsibly and respectfully. Event submissions must be accurate and not violate any laws or community guidelines. Loopin reserves the right to remove any content that is inappropriate or misleading. We are not responsible for the accuracy of event details submitted by users.
        </p>
      </div>
    </div>
  </Layout>
);

export default TermsPage; 