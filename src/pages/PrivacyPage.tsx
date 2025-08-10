import React, { useState } from 'react';
import Layout from '../components/layout/Layout';

const PrivacyPage: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const privacySections = [
    {
      key: 'information-collection',
      title: 'Information We Collect',
      content: (
        <div className="space-y-4 text-gray-700 text-sm sm:text-base">
          <p>
            We collect information you provide directly to us and automatically through your use of our services:
          </p>
          
          <div>
            <h4 className="font-semibold text-accent-black text-base sm:text-lg mb-2">Information You Provide:</h4>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Event submissions and community information</li>
              <li>Communications with our support team</li>
              <li>Feedback, reviews, and survey responses</li>
              <li>Contact information when you reach out to us</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-accent-black text-base sm:text-lg mb-2">Automatically Collected Information:</h4>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Usage data (pages visited, time spent, features used)</li>
              <li>Location data (with your consent, for event discovery)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Our platform operates without user accounts or authentication. You can browse events and submit content without creating an account or providing personal information.
            </p>
          </div>
        </div>
      )
    },
    {
      key: 'legal-basis',
      title: 'Legal Basis & Purpose of Processing',
      content: (
        <div className="space-y-4 text-gray-700 text-sm sm:text-base">
          <p>
            We process your personal information based on the following legal grounds:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Legitimate Interest:</strong> To provide and improve our community event platform</li>
            <li><strong>Consent:</strong> For optional features and communications (withdrawable at any time)</li>
            <li><strong>Legal Obligation:</strong> To comply with applicable laws and regulations</li>
            <li><strong>Public Interest:</strong> To facilitate community engagement and event discovery</li>
          </ul>
        </div>
      )
    },
    {
      key: 'how-we-use',
      title: 'How We Use Your Information',
      content: (
        <div className="space-y-4 text-gray-700 text-sm sm:text-base">
          <p>
            We use the information we collect for the following specific purposes:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Process, display, and manage event submissions and community content</li>
            <li>Provide personalized event recommendations based on your location and interests</li>
            <li>Send essential service updates and platform notifications</li>
            <li>Improve our platform functionality, user experience, and service quality</li>
            <li>Provide customer support and respond to inquiries and requests</li>
            <li>Ensure platform security, prevent abuse, and enforce our community guidelines</li>
            <li>Comply with legal obligations and respond to lawful requests</li>
            <li>Facilitate community engagement and event discovery</li>
          </ul>
        </div>
      )
    },
    {
      key: 'data-sharing',
      title: 'Data Sharing & Third-Party Services',
      content: (
        <div className="space-y-4 text-gray-700 text-sm sm:text-base">
          <p>
            We may share your information in the following limited circumstances:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Service Providers:</strong> With trusted third-party services that help operate our platform (hosting via Supabase, analytics, customer support)</li>
            <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets (with notice)</li>
            <li><strong>Safety & Security:</strong> To protect our users, platform, or public safety</li>
            <li><strong>Community Protection:</strong> To prevent abuse and maintain community standards</li>
          </ul>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> We do not sell, rent, or trade your personal information to third parties for marketing purposes. All third-party service providers are contractually bound to protect your data and use it only for specified purposes.
            </p>
          </div>
        </div>
      )
    },
    {
      key: 'data-protection',
      title: 'Data Protection & Security',
      content: (
        <div className="space-y-4 text-gray-700 text-sm sm:text-base">
          <p>
            We implement industry-standard security measures to protect your personal information:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Encryption:</strong> AES-256 encryption for data in transit (HTTPS/TLS) and at rest</li>
            <li><strong>Secure Infrastructure:</strong> Hosted on Supabase with enterprise-grade security</li>
            <li><strong>Access Controls:</strong> Role-based access with secure authentication for staff</li>
            <li><strong>Security Monitoring:</strong> Continuous monitoring and threat detection</li>
            <li><strong>Data Minimization:</strong> We only collect and retain data necessary for our services</li>
            <li><strong>Incident Response:</strong> 24/7 monitoring and rapid response procedures</li>
          </ul>
        </div>
      )
    },
    {
      key: 'data-retention',
      title: 'Data Retention & Deletion',
      content: (
        <div className="space-y-4 text-gray-700 text-sm sm:text-base">
          <p>
            We retain your personal information until you request its deletion:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Event Submissions:</strong> Retained until you request removal or the event is no longer relevant</li>
            <li><strong>Communications:</strong> Retained for service quality improvement and support purposes</li>
            <li><strong>Usage Data:</strong> Retained to improve platform functionality and user experience</li>
            <li><strong>Analytics Data:</strong> Aggregated and anonymized for platform improvement</li>
            <li><strong>Legal Requirements:</strong> Retained longer if required by law or for legal proceedings</li>
          </ul>
          <p className="text-sm text-gray-600">
            <strong>Your Control:</strong> You can request deletion of your data at any time by contacting us directly. We will process deletion requests within 30 days.
          </p>
        </div>
      )
    },
    {
      key: 'cookies-tracking',
      title: 'Cookies & Tracking Technologies',
      content: (
        <div className="space-y-4 text-gray-700 text-sm sm:text-base">
          <p>
            We use cookies and similar technologies to enhance your experience on our platform:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Essential Cookies:</strong> Required for basic platform functionality (security, session management)</li>
            <li><strong>Performance Cookies:</strong> Help us understand how you use our platform to improve services</li>
            <li><strong>Functional Cookies:</strong> Remember your preferences and settings for better experience</li>
            <li><strong>Analytics Cookies:</strong> Provide insights into platform usage and performance optimization</li>
            <li><strong>Location Cookies:</strong> Store location preferences for event discovery (with your consent)</li>
          </ul>
          <p className="text-sm text-gray-600">
            <strong>No Authentication Required:</strong> Since we don't require user accounts, cookies are primarily used for platform functionality and improvement. You can control cookie preferences through your browser settings.
          </p>
        </div>
      )
    },
    {
      key: 'international-transfers',
      title: 'International Data Transfers',
      content: (
        <div className="space-y-4 text-gray-700 text-sm sm:text-base">
          <p>
            Your data may be processed in countries other than your own:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Primary Processing:</strong> United States (where our Supabase servers are located)</li>
            <li><strong>Data Protection:</strong> We ensure adequate protection through Standard Contractual Clauses (SCCs) and Supabase's compliance</li>
            <li><strong>Compliance:</strong> All transfers comply with GDPR and other applicable privacy laws</li>
            <li><strong>Your Rights:</strong> You maintain the same rights regardless of where your data is processed</li>
            <li><strong>Supabase Security:</strong> Our hosting provider maintains SOC 2 Type II compliance and GDPR readiness</li>
          </ul>
        </div>
      )
    },
    {
      key: 'privacy-rights',
      title: 'Your Privacy Rights',
      content: (
        <div className="space-y-4 text-gray-700 text-sm sm:text-base">
          <p>
            You have comprehensive rights regarding your personal information. Click on any right below to learn more:
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {[
              {
                key: 'access',
                title: 'Access',
                shortDesc: 'Request a copy of your personal information',
                fullDesc: 'You have the right to request and receive a copy of all personal information we hold about you, including details about how it was collected, used, and shared.'
              },
              {
                key: 'rectification',
                title: 'Rectification',
                shortDesc: 'Update or correct inaccurate information',
                fullDesc: 'If you find that any personal information we hold about you is inaccurate, incomplete, or outdated, you can request us to correct, update, or complete it.'
              },
              {
                key: 'erasure',
                title: 'Erasure',
                shortDesc: 'Request deletion of your data',
                fullDesc: 'You have the "right to be forgotten" - you can request us to delete your personal information. We will process deletion requests within 30 days, subject to legal requirements.'
              },
              {
                key: 'portability',
                title: 'Portability',
                shortDesc: 'Receive your data in structured format',
                fullDesc: 'You can request your personal information in a structured, commonly used, and machine-readable format that you can easily transfer to another service provider.'
              },
              {
                key: 'restriction',
                title: 'Restriction',
                shortDesc: 'Limit how we process your information',
                fullDesc: 'You can request us to restrict or limit how we process your personal information, such as temporarily stopping processing while we verify data accuracy.'
              },
              {
                key: 'objection',
                title: 'Objection',
                shortDesc: 'Object to processing based on legitimate interests',
                fullDesc: 'You can object to our processing of your personal information when we rely on legitimate interests, unless we can demonstrate compelling legitimate grounds that override your rights.'
              },
              {
                key: 'withdraw',
                title: 'Withdraw Consent',
                shortDesc: 'Revoke consent for consent-based processing',
                fullDesc: 'Where we process your data based on consent, you can withdraw that consent at any time. This will not affect the lawfulness of processing before withdrawal.'
              },
              {
                key: 'complaint',
                title: 'Complaint',
                shortDesc: 'Lodge a complaint with authorities',
                fullDesc: 'You have the right to lodge a complaint with your local data protection authority if you believe we have not properly addressed your privacy concerns.'
              }
            ].map((right) => (
              <div 
                key={right.key}
                className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 cursor-pointer transition-all duration-200 border border-gray-200 hover:border-primary-300"
                onClick={() => toggleSection(`right-${right.key}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-accent-black text-sm mb-1">
                      {right.title}
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {right.shortDesc}
                    </p>
                  </div>
                  <div className="ml-3 flex-shrink-0">
                    <svg 
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                        expandedSections[`right-${right.key}`] ? 'rotate-180' : ''
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                {expandedSections[`right-${right.key}`] && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {right.fullDesc}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <p className="text-sm text-gray-600 mt-4">
            To exercise these rights, contact us at support@loopin.city. We will respond within 30 days.
          </p>
        </div>
      )
    },
    {
      key: 'children-privacy',
      title: "Children's Privacy",
      content: (
        <div className="space-y-4 text-gray-700 text-sm sm:text-base">
          <p>
            We are committed to protecting children's privacy:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Age Requirement:</strong> Our services are not intended for children under 13 years of age</li>
            <li><strong>No Collection:</strong> We do not knowingly collect personal information from children under 13</li>
            <li><strong>Parental Rights:</strong> If we discover we have collected information from a child under 13, we will delete it immediately</li>
            <li><strong>Contact:</strong> Parents who believe we have collected their child's information should contact us immediately</li>
          </ul>
        </div>
      )
    },
    {
      key: 'data-breach',
      title: 'Data Breach Notification',
      content: (
        <div className="space-y-4 text-gray-700 text-sm sm:text-base">
          <p>
            In the unlikely event of a data breach:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Immediate Response:</strong> We will assess and contain the breach within 72 hours</li>
            <li><strong>User Notification:</strong> Affected users will be notified within 72 hours of breach confirmation</li>
            <li><strong>Regulatory Reporting:</strong> We will report to relevant authorities as required by law</li>
            <li><strong>Remediation:</strong> We will take immediate steps to prevent future breaches</li>
            <li><strong>Support:</strong> We will provide guidance and support to affected users</li>
          </ul>
        </div>
      )
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen py-4 sm:py-8 px-3 sm:px-4 lg:px-8" style={{ backgroundColor: '#fef3c7' }}>
        <div className="max-w-4xl w-full mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12 animate-fade-in-up">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-accent-black mb-3 sm:mb-4 font-mono">
              Privacy Policy
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
              Your privacy is fundamental to us. This comprehensive policy explains how we collect, use, protect, and manage your information in compliance with applicable privacy laws.
            </p>
            <div className="w-20 sm:w-24 h-1 bg-primary-400 mx-auto mt-4 sm:mt-6 rounded-full"></div>
          </div>

          {/* Main Content - Accordion Style Cards */}
          <div className="space-y-4 sm:space-y-6">
            {privacySections.map((section, index) => (
              <div 
                key={section.key}
                className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
              >
                {/* Section Header - Clickable */}
                <div 
                  className="p-5 sm:p-6 lg:p-8 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => toggleSection(section.key)}
                >
                  <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-3 sm:space-x-4">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-accent-black font-mono">
                      {section.title}
                    </h2>
                  </div>
                    <div className="flex-shrink-0">
                      <svg 
                        className={`w-5 h-5 sm:w-6 sm:h-6 text-gray-500 transition-transform duration-300 ${
                          expandedSections[section.key] ? 'rotate-180' : ''
                        }`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Expandable Content */}
                {expandedSections[section.key] && (
                  <div className="px-5 sm:px-6 lg:px-8 pb-5 sm:pb-6 lg:pb-8 border-t border-gray-100">
                    {section.content}
                  </div>
                )}
              </div>
            ))}

            {/* Contact Section - Always Visible */}
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl sm:rounded-2xl shadow-lg p-5 sm:p-6 lg:p-8 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-accent-black font-mono mb-3 sm:mb-4">Questions About Privacy?</h2>
                <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
                  Our dedicated privacy team is here to help. Contact us for any questions about this policy, 
                  to exercise your rights, or to report privacy concerns.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <a 
                    href="mailto:support@loopin.city" 
                    className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-primary-500 text-white font-medium rounded-full hover:bg-primary-600 transition-colors duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Privacy Team
                  </a>
                  <a 
                    href="/contact" 
                    className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-primary-600 font-medium rounded-full hover:bg-gray-50 transition-colors duration-200 border-2 border-primary-500 shadow-lg hover:shadow-xl text-sm sm:text-base"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    General Contact
                  </a>
                </div>
                <div className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-600">
                  <p><strong>Response Time:</strong> We aim to respond to all privacy inquiries within 48 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPage; 