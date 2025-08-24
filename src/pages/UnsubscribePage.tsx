import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { unsubscribeFromEmailLink } from '../api/alerts';
import Layout from '../components/layout/Layout';

const UnsubscribePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [cityId, setCityId] = useState('');

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const cityParam = searchParams.get('city');
    
    if (emailParam && cityParam) {
      setEmail(emailParam);
      setCityId(cityParam);
    } else {
      setError('Invalid unsubscribe link. Missing required parameters.');
    }
  }, [searchParams]);

  const handleUnsubscribe = async () => {
    if (!email || !cityId) {
      setError('Missing required parameters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await unsubscribeFromEmailLink(email, cityId);
      setSuccess(true);
    } catch (err) {
      console.error('Unsubscribe error:', err);
      setError('Failed to unsubscribe. Please try again or contact support.');
    } finally {
      setLoading(false);
    }
  };

  const handleResubscribe = () => {
    navigate('/alerts');
  };

  if (success) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Successfully Unsubscribed</h1>
            <p className="text-gray-600 mb-6">
              You have been successfully unsubscribed from event alerts for this city. 
              You will no longer receive email notifications about new tech events.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={handleResubscribe}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Subscribe to Other Cities
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-4">Unsubscribe from Alerts</h1>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          <div className="mb-6">
            <p className="text-gray-600 text-center mb-4">
              Are you sure you want to unsubscribe from event alerts?
            </p>
            
            {email && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> {email}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>City:</strong> {cityId}
                </p>
              </div>
            )}
            
            <p className="text-sm text-gray-500 text-center">
              You can always resubscribe later by visiting our alerts page.
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={handleUnsubscribe}
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Unsubscribing...' : 'Yes, Unsubscribe Me'}
            </button>
            
            <button
              onClick={() => navigate('/alerts')}
              className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UnsubscribePage;
