import React from 'react';
import Layout from '../components/layout/Layout';

const ContactPage: React.FC = () => (
  <Layout>
    <div className="min-h-screen py-16 px-2 flex flex-col items-center justify-center" style={{ backgroundImage: "url('/Sprinkle.svg')", backgroundRepeat: 'repeat', backgroundSize: '500px', backgroundPosition: 'center' }}>
      <div className="max-w-2xl w-full mx-auto bg-white rounded-3xl shadow-lg p-8 border border-accent-black/10">
        <h1 className="text-3xl font-bold text-accent-black mb-6 font-mono border-b border-accent-black/10 pb-4">Contact Us</h1>
        <p className="text-accent-black font-mono mb-4">
          Have questions, suggestions, or want to partner with us?<br />
          Email: <a href="mailto:support@loopin.city" className="underline">support@loopin.city</a><br />
          We love hearing from the community!
        </p>
      </div>
    </div>
  </Layout>
);

export default ContactPage; 