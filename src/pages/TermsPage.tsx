import React, { useState } from 'react';
import Layout from '../components/layout/Layout';

const TermsPage: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const termsSections = [
    {
      key: 'acceptance',
      title: 'Acceptance of Terms',
      content: (
        <div className="space-y-4 text-gray-700 text-sm sm:text-base">
          <p>
            By accessing and using Loopin City ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
            <p className="text-sm text-blue-800">
              <strong>Important:</strong> These Terms of Service constitute a legally binding agreement between you and Loopin City. By using our platform, you acknowledge that you have read, understood, and agree to be bound by these terms.
            </p>
          </div>
        </div>
      )
    },
    {
      key: 'service-description',
      title: 'Description of Service',
      content: (
        <div className="space-y-4 text-gray-700 text-sm sm:text-base">
          <p>
            Loopin City is a community-driven platform that facilitates the discovery and sharing of local tech events, meetups, and community activities. Our services include:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Event discovery and browsing by location and category</li>
            <li>Community event submission and management</li>
            <li>Community leaderboards and recognition systems</li>
            <li>Venue partnership and verification services</li>
            <li>Location-based event recommendations</li>
            <li>Community engagement and networking tools</li>
          </ul>
          <p className="text-sm text-gray-600">
            <strong>Note:</strong> We do not provide ticketing services, user accounts, or attendee management. Users interact directly with event organizers for registration and participation.
          </p>
        </div>
      )
    },
    {
      key: 'user-eligibility',
      title: 'User Eligibility & Registration',
      content: (
        <div className="space-y-4 text-gray-700 text-sm sm:text-base">
          <p>
            To use our services, you must meet the following requirements:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Age Requirement:</strong> You must be at least 13 years old to use our services</li>
            <li><strong>Legal Capacity:</strong> You must have the legal capacity to enter into binding agreements</li>
            <li><strong>Compliance:</strong> You must comply with all applicable laws and regulations</li>
            <li><strong>No Authentication Required:</strong> You can browse events without creating an account</li>
          </ul>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <p className="text-sm text-yellow-800">
              <strong>Community Focus:</strong> Our platform is designed for tech enthusiasts, community organizers, and venue partners. We reserve the right to restrict access to users who violate our community guidelines.
            </p>
          </div>
        </div>
      )
    },
    {
      key: 'user-responsibilities',
      title: 'User Responsibilities & Conduct',
      content: (
        <div className="space-y-4 text-gray-700 text-sm sm:text-base">
          <p>
            As a user of Loopin City, you agree to:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Accurate Information:</strong> Provide accurate, truthful, and complete information when submitting events or community details</li>
            <li><strong>Respectful Behavior:</strong> Use the platform respectfully and not engage in harassment, discrimination, or harmful behavior</li>
            <li><strong>Content Compliance:</strong> Ensure all submitted content complies with applicable laws and community guidelines</li>
            <li><strong>Intellectual Property:</strong> Only submit content you have the right to share and use</li>
            <li><strong>Platform Security:</strong> Not attempt to compromise the security or integrity of our platform</li>
            <li><strong>Community Guidelines:</strong> Follow our community guidelines and respect other users</li>
          </ul>
          <p className="text-sm text-gray-600">
            <strong>Prohibited Activities:</strong> Spam, fraud, impersonation, and any illegal activities are strictly prohibited and may result in immediate account suspension.
          </p>
        </div>
      )
    },
    {
      key: 'event-submissions',
      title: 'Event & Community Submissions',
      content: (
        <div className="space-y-4 text-gray-700 text-sm sm:text-base">
          <p>
            When submitting events or community information to Loopin City:
          </p>
          <div>
            <h4 className="font-semibold text-accent-black text-base sm:text-lg mb-2">Submission Requirements:</h4>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Events must be real, legitimate tech community activities</li>
              <li>All information must be accurate and up-to-date</li>
              <li>Events must comply with local laws and regulations</li>
              <li>Community information must be verifiable and authentic</li>
              <li>Contact information must be valid and accessible</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-accent-black text-base sm:text-lg mb-2">Content Ownership & Licensing:</h4>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>You retain ownership of your submitted content</li>
              <li>You grant Loopin City a non-exclusive license to display and distribute your content</li>
              <li>You represent that you have the right to grant this license</li>
              <li>You can request removal of your content at any time</li>
            </ul>
          </div>
          
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
            <p className="text-sm text-red-800">
              <strong>Important:</strong> Loopin City reserves the right to review, modify, or remove any submitted content that violates our terms or community guidelines. We are not responsible for the accuracy of user-submitted content.
            </p>
          </div>
        </div>
      )
    },
    {
      key: 'intellectual-property',
      title: 'Intellectual Property Rights',
      content: (
        <div className="space-y-4 text-gray-700 text-sm sm:text-base">
          <p>
            Intellectual property rights on our platform are protected as follows:
          </p>
          <div>
            <h4 className="font-semibold text-accent-black text-base sm:text-lg mb-2">Loopin City Rights:</h4>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>The Platform, including its design, functionality, and content, is owned by Loopin City</li>
              <li>Our trademarks, logos, and brand elements are protected intellectual property</li>
              <li>Platform code, algorithms, and technical implementations are proprietary</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-accent-black text-base sm:text-lg mb-2">User Content Rights:</h4>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Users retain ownership of their submitted content</li>
              <li>Users grant us a license to use their content for platform purposes</li>
              <li>Users are responsible for ensuring they have rights to submitted content</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-accent-black text-base sm:text-lg mb-2">Third-Party Rights:</h4>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>We respect third-party intellectual property rights</li>
              <li>Users must not infringe on others' intellectual property</li>
              <li>We will respond to legitimate copyright infringement notices</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      key: 'privacy-data',
      title: 'Privacy & Data Protection',
      content: (
        <div className="space-y-4 text-gray-700 text-sm sm:text-base">
          <p>
            Your privacy is important to us. Our data practices are governed by our Privacy Policy:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Data Collection:</strong> We collect information necessary to provide our services</li>
            <li><strong>Data Usage:</strong> Your data is used to improve platform functionality and user experience</li>
            <li><strong>Data Sharing:</strong> We do not sell your personal information to third parties</li>
            <li><strong>Data Security:</strong> We implement industry-standard security measures</li>
            <li><strong>Your Rights:</strong> You have rights to access, modify, and delete your data</li>
          </ul>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
            <p className="text-sm text-blue-800">
              <strong>Privacy Policy:</strong> Our comprehensive Privacy Policy is incorporated into these Terms by reference. Please review it to understand how we handle your information.
            </p>
          </div>
        </div>
      )
    },
    {
      key: 'limitation-liability',
      title: 'Limitation of Liability & Disclaimers',
      content: (
        <div className="space-y-4 text-gray-700 text-sm sm:text-base">
          <p>
            Loopin City provides its services "as is" with the following limitations:
          </p>
          <div>
            <h4 className="font-semibold text-accent-black text-base sm:text-lg mb-2">Service Disclaimers:</h4>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>We do not guarantee uninterrupted or error-free service</li>
              <li>We are not responsible for third-party content or services</li>
              <li>We do not verify the accuracy of user-submitted information</li>
              <li>We do not guarantee the success or quality of events</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-accent-black text-base sm:text-lg mb-2">Liability Limitations:</h4>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Our total liability is limited to the amount you paid for our services (if any)</li>
              <li>We are not liable for indirect, incidental, or consequential damages</li>
              <li>We are not liable for events beyond our reasonable control</li>
              <li>These limitations apply to the maximum extent permitted by law</li>
            </ul>
          </div>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> Some jurisdictions do not allow liability limitations. In such cases, our liability will be limited to the maximum extent permitted by applicable law.
            </p>
          </div>
        </div>
      )
    },
    {
      key: 'indemnification',
      title: 'User Indemnification',
      content: (
        <div className="space-y-4 text-gray-700 text-sm sm:text-base">
          <p>
            You agree to indemnify and hold harmless Loopin City from any claims arising from your use of our services:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Content Violations:</strong> Claims related to content you submit that violates laws or rights</li>
            <li><strong>Platform Misuse:</strong> Claims arising from your violation of these Terms</li>
            <li><strong>Third-Party Claims:</strong> Claims from other users or third parties due to your actions</li>
            <li><strong>Legal Compliance:</strong> Claims related to your failure to comply with applicable laws</li>
            <li><strong>Intellectual Property:</strong> Claims of intellectual property infringement by your content</li>
          </ul>
          <p className="text-sm text-gray-600">
            <strong>Defense Cooperation:</strong> You agree to cooperate with us in defending against any such claims and to reimburse us for reasonable legal expenses.
          </p>
        </div>
      )
    },
    {
      key: 'termination',
      title: 'Termination & Suspension',
      content: (
        <div className="space-y-4 text-gray-700 text-sm sm:text-base">
          <p>
            We may terminate or suspend access to our services under certain circumstances:
          </p>
          <div>
            <h4 className="font-semibold text-accent-black text-base sm:text-lg mb-2">Grounds for Termination:</h4>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Violation of these Terms of Service</li>
              <li>Engagement in fraudulent or illegal activities</li>
              <li>Repeated submission of inappropriate or misleading content</li>
              <li>Harassment or abuse of other users</li>
              <li>Attempts to compromise platform security</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-accent-black text-base sm:text-lg mb-2">Termination Process:</h4>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>We will provide notice of termination when possible</li>
              <li>Immediate termination may occur for serious violations</li>
              <li>Your content may be removed upon termination</li>
              <li>Certain terms survive termination (privacy, liability, etc.)</li>
            </ul>
          </div>
          
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
            <p className="text-sm text-green-800">
              <strong>Appeal Process:</strong> If you believe your access was terminated in error, you may contact us to request review of the decision.
            </p>
          </div>
        </div>
      )
    },
    {
      key: 'governing-law',
      title: 'Governing Law & Dispute Resolution',
      content: (
        <div className="space-y-4 text-gray-700 text-sm sm:text-base">
          <p>
            These Terms are governed by the following legal framework:
          </p>
          <div>
            <h4 className="font-semibold text-accent-black text-base sm:text-lg mb-2">Governing Law:</h4>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>These Terms are governed by the laws of India</li>
              <li>Any disputes will be resolved in Indian courts</li>
              <li>International users agree to submit to Indian jurisdiction</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-accent-black text-base sm:text-lg mb-2">Dispute Resolution:</h4>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>We encourage informal resolution of disputes</li>
              <li>Contact us first to attempt resolution</li>
              <li>Legal action should be a last resort</li>
              <li>Class action lawsuits are not permitted</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
            <p className="text-sm text-blue-800">
              <strong>Contact First:</strong> Before pursuing legal action, please contact us at support@loopin.city to discuss your concerns. We're committed to resolving issues amicably.
            </p>
          </div>
        </div>
      )
    },
    {
      key: 'modifications',
      title: 'Modifications to Terms',
      content: (
        <div className="space-y-4 text-gray-700 text-sm sm:text-base">
          <p>
            We may modify these Terms of Service from time to time:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Notification:</strong> We will notify users of significant changes to these Terms</li>
            <li><strong>Continued Use:</strong> Continued use after changes constitutes acceptance</li>
            <li><strong>Material Changes:</strong> Major changes will be prominently communicated</li>
            <li><strong>Version History:</strong> Previous versions will be archived for reference</li>
            <li><strong>Effective Date:</strong> Changes become effective upon posting</li>
          </ul>
          <p className="text-sm text-gray-600">
            <strong>Your Responsibility:</strong> It's your responsibility to review these Terms periodically for changes. Your continued use of the platform after any modifications indicates your acceptance of the updated Terms.
          </p>
        </div>
      )
    },
    {
      key: 'contact-information',
      title: 'Contact Information & Support',
      content: (
        <div className="space-y-4 text-gray-700 text-sm sm:text-base">
          <p>
            For questions about these Terms of Service or to report violations:
          </p>
                      <div className="bg-gray-50 p-4 rounded-lg max-w-md mx-auto">
              <h4 className="font-semibold text-accent-black text-base mb-2">General Support</h4>
              <p className="text-sm text-gray-600 mb-2">For general questions and platform support</p>
              <a href="mailto:support@loopin.city" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                support@loopin.city
              </a>
            </div>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <p className="text-sm text-yellow-800">
              <strong>Response Time:</strong> We aim to respond to all inquiries within 48 hours. For urgent legal matters, please include "URGENT" in your subject line.
            </p>
          </div>
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
              Terms of Service
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
              These terms govern your use of Loopin City. By using our platform, you agree to be bound by these conditions.
            </p>
            <div className="w-20 sm:w-24 h-1 bg-primary-400 mx-auto mt-4 sm:mt-6 rounded-full"></div>
          </div>

          {/* Main Content - Accordion Style Cards */}
          <div className="space-y-4 sm:space-y-6">
            {termsSections.map((section, index) => (
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
                <h2 className="text-xl sm:text-2xl font-bold text-accent-black font-mono mb-3 sm:mb-4">Questions About These Terms?</h2>
                <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
                  Our legal team is here to help clarify any terms or address concerns about your rights and responsibilities on our platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <a 
                    href="mailto:support@loopin.city" 
                    className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-primary-500 text-white font-medium rounded-full hover:bg-primary-600 transition-colors duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Legal Team
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
                  <p><strong>Response Time:</strong> We aim to respond to all legal inquiries within 48 hours</p>
                  <p><strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  </Layout>
);
};

export default TermsPage; 