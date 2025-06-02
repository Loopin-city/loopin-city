import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { City } from '../types';
import { Mail, Clock, MapPin, Bell } from 'lucide-react';
import { useLocation } from '../contexts/LocationContext';


const AnimatedClock: React.FC = () => {
  return (
    <div className="relative w-8 h-8">
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-accent-black"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline
          points="12,6 12,12 9,15"
          className="origin-center"
          style={{ 
            animation: 'spin 12s linear infinite',
            transformOrigin: '12px 12px'
          }}
        />
      </svg>
    </div>
  );
};


const citiesByState: { [key: string]: City[] } = {
  'Andhra Pradesh': [
    { id: 'AP1', name: 'Visakhapatnam', state: 'Andhra Pradesh' },
    { id: 'AP2', name: 'Vijayawada', state: 'Andhra Pradesh' },
    { id: 'AP3', name: 'Guntur', state: 'Andhra Pradesh' },
    { id: 'AP4', name: 'Nellore', state: 'Andhra Pradesh' },
    { id: 'AP5', name: 'Kurnool', state: 'Andhra Pradesh' }
  ],
  'Arunachal Pradesh': [
    { id: 'AR1', name: 'Itanagar', state: 'Arunachal Pradesh' },
    { id: 'AR2', name: 'Naharlagun', state: 'Arunachal Pradesh' }
  ],
  'Assam': [
    { id: 'AS1', name: 'Guwahati', state: 'Assam' },
    { id: 'AS2', name: 'Silchar', state: 'Assam' },
    { id: 'AS3', name: 'Dibrugarh', state: 'Assam' }
  ],
  'Bihar': [
    { id: 'BR1', name: 'Patna', state: 'Bihar' },
    { id: 'BR2', name: 'Gaya', state: 'Bihar' },
    { id: 'BR3', name: 'Bhagalpur', state: 'Bihar' }
  ],
  'Chhattisgarh': [
    { id: 'CG1', name: 'Raipur', state: 'Chhattisgarh' },
    { id: 'CG2', name: 'Bhilai', state: 'Chhattisgarh' },
    { id: 'CG3', name: 'Bilaspur', state: 'Chhattisgarh' }
  ],
  'Goa': [
    { id: 'GA1', name: 'Panaji', state: 'Goa' },
    { id: 'GA2', name: 'Margao', state: 'Goa' }
  ],
  'Gujarat': [
    { id: 'GJ1', name: 'Ahmedabad', state: 'Gujarat' },
    { id: 'GJ2', name: 'Surat', state: 'Gujarat' },
    { id: 'GJ3', name: 'Vadodara', state: 'Gujarat' },
    { id: 'GJ4', name: 'Rajkot', state: 'Gujarat' },
    { id: 'GJ5', name: 'Gandhinagar', state: 'Gujarat' }
  ],
  'Haryana': [
    { id: 'HR1', name: 'Gurgaon', state: 'Haryana' },
    { id: 'HR2', name: 'Faridabad', state: 'Haryana' },
    { id: 'HR3', name: 'Panipat', state: 'Haryana' },
    { id: 'HR4', name: 'Ambala', state: 'Haryana' }
  ],
  'Himachal Pradesh': [
    { id: 'HP1', name: 'Shimla', state: 'Himachal Pradesh' },
    { id: 'HP2', name: 'Dharamshala', state: 'Himachal Pradesh' },
    { id: 'HP3', name: 'Solan', state: 'Himachal Pradesh' }
  ],
  'Jharkhand': [
    { id: 'JH1', name: 'Ranchi', state: 'Jharkhand' },
    { id: 'JH2', name: 'Jamshedpur', state: 'Jharkhand' },
    { id: 'JH3', name: 'Dhanbad', state: 'Jharkhand' }
  ],
  'Karnataka': [
    { id: 'KA1', name: 'Bangalore', state: 'Karnataka' },
    { id: 'KA2', name: 'Mysore', state: 'Karnataka' },
    { id: 'KA3', name: 'Hubli', state: 'Karnataka' },
    { id: 'KA4', name: 'Mangalore', state: 'Karnataka' },
    { id: 'KA5', name: 'Belgaum', state: 'Karnataka' }
  ],
  'Kerala': [
    { id: 'KL1', name: 'Thiruvananthapuram', state: 'Kerala' },
    { id: 'KL2', name: 'Kochi', state: 'Kerala' },
    { id: 'KL3', name: 'Kozhikode', state: 'Kerala' }
  ],
  'Madhya Pradesh': [
    { id: 'MP1', name: 'Bhopal', state: 'Madhya Pradesh' },
    { id: 'MP2', name: 'Indore', state: 'Madhya Pradesh' },
    { id: 'MP3', name: 'Jabalpur', state: 'Madhya Pradesh' },
    { id: 'MP4', name: 'Gwalior', state: 'Madhya Pradesh' }
  ],
  'Maharashtra': [
    { id: 'MH1', name: 'Mumbai', state: 'Maharashtra' },
    { id: 'MH2', name: 'Pune', state: 'Maharashtra' },
    { id: 'MH3', name: 'Nashik', state: 'Maharashtra' },
    { id: 'MH4', name: 'Nagpur', state: 'Maharashtra' },
    { id: 'MH5', name: 'Thane', state: 'Maharashtra' },
    { id: 'MH6', name: 'Aurangabad', state: 'Maharashtra' },
    { id: 'MH7', name: 'Solapur', state: 'Maharashtra' },
    { id: 'MH8', name: 'Amravati', state: 'Maharashtra' },
    { id: 'MH9', name: 'Kolhapur', state: 'Maharashtra' },
    { id: 'MH10', name: 'Sangli', state: 'Maharashtra' }
  ],
  'Manipur': [
    { id: 'MN1', name: 'Imphal', state: 'Manipur' }
  ],
  'Meghalaya': [
    { id: 'ML1', name: 'Shillong', state: 'Meghalaya' }
  ],
  'Mizoram': [
    { id: 'MZ1', name: 'Aizawl', state: 'Mizoram' }
  ],
  'Nagaland': [
    { id: 'NL1', name: 'Kohima', state: 'Nagaland' },
    { id: 'NL2', name: 'Dimapur', state: 'Nagaland' }
  ],
  'Odisha': [
    { id: 'OR1', name: 'Bhubaneswar', state: 'Odisha' },
    { id: 'OR2', name: 'Cuttack', state: 'Odisha' },
    { id: 'OR3', name: 'Rourkela', state: 'Odisha' }
  ],
  'Punjab': [
    { id: 'PB1', name: 'Chandigarh', state: 'Punjab' },
    { id: 'PB2', name: 'Ludhiana', state: 'Punjab' },
    { id: 'PB3', name: 'Amritsar', state: 'Punjab' }
  ],
  'Rajasthan': [
    { id: 'RJ1', name: 'Jaipur', state: 'Rajasthan' },
    { id: 'RJ2', name: 'Jodhpur', state: 'Rajasthan' },
    { id: 'RJ3', name: 'Udaipur', state: 'Rajasthan' },
    { id: 'RJ4', name: 'Kota', state: 'Rajasthan' }
  ],
  'Sikkim': [
    { id: 'SK1', name: 'Gangtok', state: 'Sikkim' }
  ],
  'Tamil Nadu': [
    { id: 'TN1', name: 'Chennai', state: 'Tamil Nadu' },
    { id: 'TN2', name: 'Coimbatore', state: 'Tamil Nadu' },
    { id: 'TN3', name: 'Madurai', state: 'Tamil Nadu' },
    { id: 'TN4', name: 'Salem', state: 'Tamil Nadu' },
    { id: 'TN5', name: 'Tiruchirappalli', state: 'Tamil Nadu' }
  ],
  'Telangana': [
    { id: 'TS1', name: 'Hyderabad', state: 'Telangana' },
    { id: 'TS2', name: 'Warangal', state: 'Telangana' },
    { id: 'TS3', name: 'Karimnagar', state: 'Telangana' }
  ],
  'Tripura': [
    { id: 'TR1', name: 'Agartala', state: 'Tripura' }
  ],
  'Uttar Pradesh': [
    { id: 'UP1', name: 'Lucknow', state: 'Uttar Pradesh' },
    { id: 'UP2', name: 'Kanpur', state: 'Uttar Pradesh' },
    { id: 'UP3', name: 'Ghaziabad', state: 'Uttar Pradesh' },
    { id: 'UP4', name: 'Agra', state: 'Uttar Pradesh' },
    { id: 'UP5', name: 'Varanasi', state: 'Uttar Pradesh' },
    { id: 'UP6', name: 'Prayagraj', state: 'Uttar Pradesh' }
  ],
  'Uttarakhand': [
    { id: 'UK1', name: 'Dehradun', state: 'Uttarakhand' },
    { id: 'UK2', name: 'Haridwar', state: 'Uttarakhand' },
    { id: 'UK3', name: 'Haldwani', state: 'Uttarakhand' }
  ],
  'West Bengal': [
    { id: 'WB1', name: 'Kolkata', state: 'West Bengal' },
    { id: 'WB2', name: 'Siliguri', state: 'West Bengal' },
    { id: 'WB3', name: 'Durgapur', state: 'West Bengal' }
  ],
  
  'Andaman and Nicobar Islands': [
    { id: 'AN1', name: 'Port Blair', state: 'Andaman and Nicobar Islands' }
  ],
  'Chandigarh': [
    { id: 'CH1', name: 'Chandigarh', state: 'Chandigarh' }
  ],
  'Dadra and Nagar Haveli and Daman and Diu': [
    { id: 'DN1', name: 'Daman', state: 'Dadra and Nagar Haveli and Daman and Diu' },
    { id: 'DN2', name: 'Silvassa', state: 'Dadra and Nagar Haveli and Daman and Diu' }
  ],
  'Delhi': [
    { id: 'DL1', name: 'New Delhi', state: 'Delhi' }
  ],
  'Jammu and Kashmir': [
    { id: 'JK1', name: 'Srinagar', state: 'Jammu and Kashmir' },
    { id: 'JK2', name: 'Jammu', state: 'Jammu and Kashmir' }
  ],
  'Ladakh': [
    { id: 'LA1', name: 'Leh', state: 'Ladakh' },
    { id: 'LA2', name: 'Kargil', state: 'Ladakh' }
  ],
  'Lakshadweep': [
    { id: 'LD1', name: 'Kavaratti', state: 'Lakshadweep' }
  ],
  'Puducherry': [
    { id: 'PY1', name: 'Puducherry', state: 'Puducherry' },
    { id: 'PY2', name: 'Karaikal', state: 'Puducherry' }
  ]
};

const SubscribeAlertsPage: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 bg-accent-cream" style={{ backgroundImage: "url('/Sprinkle.svg')", backgroundRepeat: 'repeat', backgroundSize: '500px', backgroundPosition: 'center' }}>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full flex flex-col items-center text-center">
          <div className="bg-yellow-400 text-accent-black rounded-full px-6 py-3 mb-8 flex items-center gap-3 shadow-sm">
            <AnimatedClock />
            <span className="font-semibold text-lg">Coming Soon</span>
          </div>

          <h1 className="text-2xl font-bold text-accent-black mb-3 flex items-center gap-2">
            <Mail className="h-6 w-6 text-yellow-400" /> 
            Event Alerts
          </h1>
          
          <div className="text-accent-black text-center space-y-3">
            <p className="flex items-center justify-center gap-2 font-semibold">
              <MapPin className="h-5 w-5 text-yellow-400" />
              <span>City-Specific Subscriptions</span>
            </p>
            <p className="text-sm leading-relaxed max-w-sm text-gray-600">
              Subscribe to city-specific events and get email notifications when a new event occurs in your city.
            </p>
          </div>

          <div className="mt-6 bg-accent-cream rounded-lg p-4 w-full border border-yellow-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Bell className="h-4 w-4 text-yellow-500" />
              <span className="text-accent-black font-semibold text-sm">Stay Tuned</span>
            </div>
            <p className="text-sm text-gray-600">
              We're working on bringing you personalized event alerts. Subscribe to our newsletter to be notified when this feature launches.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </Layout>
  );
};

export default SubscribeAlertsPage; 