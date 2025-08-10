import React from 'react';
import { Mail, MapPin, Clock, Linkedin, Instagram, Facebook } from 'lucide-react';
import Layout from '../components/layout/Layout';

const ContactPage: React.FC = () => (
  <Layout>
    <div className="min-h-screen py-16 px-4" style={{ backgroundColor: '#fef3c7' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-accent-black mb-6 font-mono">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Have questions about Loopin City? Want to partner with us? Need technical support? 
            We're here to help build amazing local tech communities together.
          </p>
        </div>

        {/* Contact Methods Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Email Contact */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-accent-black/10 hover:shadow-2xl transition-all duration-300 hover:scale-105 transform-gpu">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-primary-500 rounded-2xl">
                <Mail className="h-8 w-8 text-accent-black" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-accent-black mb-3 font-mono text-center">Email Us</h3>
            <p className="text-gray-600 text-center mb-4">
              Get in touch via email for any inquiries
            </p>
            <a
              href="mailto:support@loopin.city"
              className="block text-center bg-primary-500 text-accent-black px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 transition-all duration-300 hover:scale-105 transform-gpu shadow-lg hover:shadow-xl"
            >
              support@loopin.city
            </a>
          </div>

          {/* Response Time */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-accent-black/10 hover:shadow-2xl transition-all duration-300 hover:scale-105 transform-gpu">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-primary-500 rounded-2xl">
                <Clock className="h-8 w-8 text-accent-black" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-accent-black mb-3 font-mono text-center">Response Time</h3>
            <p className="text-gray-600 text-center mb-4">
              We aim to respond within 24-48 hours
            </p>
            <div className="text-center">
              <span className="inline-block bg-primary-100 text-accent-black px-4 py-2 rounded-lg font-medium">
                Quick Response
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-accent-black/10 hover:shadow-2xl transition-all duration-300 hover:scale-105 transform-gpu">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-primary-500 rounded-2xl">
                <MapPin className="h-8 w-8 text-accent-black" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-accent-black mb-3 font-mono text-center">Our Location</h3>
            <p className="text-gray-600 text-center mb-4">
              Based in Nashik, Maharashtra
            </p>
            <div className="text-center">
              <span className="inline-block bg-primary-100 text-accent-black px-4 py-2 rounded-lg font-medium">
                Nashik, India
              </span>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-accent-black/10">
          <h2 className="text-2xl font-bold text-accent-black mb-6 font-mono text-center">
            Connect With Us
          </h2>
          <p className="text-gray-600 mb-8 text-center max-w-2xl mx-auto">
            Stay updated with the latest community news, events, and opportunities. 
            Follow us on social media for real-time updates and community engagement.
          </p>
          
          {/* Mobile-optimized grid: 2x2 on mobile, 4 in a row on larger screens */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/company/city-loopin/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center p-4 lg:p-6 bg-white rounded-2xl shadow-lg border border-accent-black/5 hover:shadow-xl transition-all duration-300 hover:scale-105 transform-gpu aspect-square"
            >
              <div className="p-3 lg:p-4 bg-primary-500 rounded-2xl mb-3 lg:mb-4 group-hover:bg-primary-600 transition-colors duration-300">
                <Linkedin className="h-6 w-6 lg:h-8 lg:w-8 text-accent-black" />
              </div>
              <span className="font-semibold text-accent-black text-sm lg:text-base text-center">LinkedIn</span>
              <span className="text-xs lg:text-sm text-gray-600 mt-1 text-center">Company Updates</span>
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/share/1UsXT81666/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center p-4 lg:p-6 bg-white rounded-2xl shadow-lg border border-accent-black/5 hover:shadow-xl transition-all duration-300 hover:scale-105 transform-gpu aspect-square"
            >
              <div className="p-3 lg:p-4 bg-primary-500 rounded-2xl mb-3 lg:mb-4 group-hover:bg-primary-600 transition-colors duration-300">
                <Facebook className="h-6 w-6 lg:h-8 lg:w-8 text-accent-black" />
              </div>
              <span className="font-semibold text-accent-black text-sm lg:text-base text-center">Facebook</span>
              <span className="text-xs lg:text-sm text-gray-600 mt-1 text-center">Community Events</span>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/loopin.city"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center p-4 lg:p-6 bg-white rounded-2xl shadow-lg border border-accent-black/5 hover:shadow-xl transition-all duration-300 hover:scale-105 transform-gpu aspect-square"
            >
              <div className="p-3 lg:p-4 bg-primary-500 rounded-2xl mb-3 lg:mb-4 group-hover:bg-primary-600 transition-colors duration-300">
                <Instagram className="h-6 w-6 lg:h-8 lg:w-8 text-accent-black" />
              </div>
              <span className="font-semibold text-accent-black text-sm lg:text-base text-center">Instagram</span>
              <span className="text-xs lg:text-sm text-gray-600 mt-1 text-center">Community Stories</span>
            </a>

            {/* Email */}
            <a
              href="mailto:support@loopin.city"
              className="group flex flex-col items-center p-4 lg:p-6 bg-white rounded-2xl shadow-lg border border-accent-black/5 hover:shadow-xl transition-all duration-300 hover:scale-105 transform-gpu aspect-square"
            >
              <div className="p-3 lg:p-4 bg-primary-500 rounded-2xl mb-3 lg:mb-4 group-hover:bg-primary-600 transition-colors duration-300">
                <Mail className="h-6 w-6 lg:h-8 lg:w-8 text-accent-black" />
              </div>
              <span className="font-semibold text-accent-black text-sm lg:text-base text-center">Email</span>
              <span className="text-xs lg:text-sm text-gray-600 mt-1 text-center">Direct Contact</span>
            </a>
          </div>

          {/* Additional Contact Info - Mobile Optimized */}
          <div className="mt-12">
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-6 border border-primary-200">
              <h3 className="text-xl font-semibold text-accent-black mb-6 font-mono text-center">
                Response Time Expectations
              </h3>
              <p className="text-gray-700 mb-6 text-center text-sm lg:text-base">
                We're committed to providing excellent support to our community. Here's what you can expect:
              </p>
              
              {/* Mobile-optimized response time cards */}
              <div className="space-y-4">
                {/* General Inquiries */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-primary-200/50">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-primary-500 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-accent-black text-sm lg:text-base">
                        General Inquiries
                      </h4>
                      <p className="text-gray-600 text-sm">
                        We'll get back to you within <span className="font-medium text-primary-600">24-48 hours</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Technical Support */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-primary-200/50">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-primary-500 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-accent-black text-sm lg:text-base">
                        Technical Support
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Priority response within <span className="font-medium text-primary-600">12-24 hours</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Partnership Requests */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-primary-200/50">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-primary-500 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-accent-black text-sm lg:text-base">
                        Partnership Requests
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Detailed review within <span className="font-medium text-primary-600">2-3 business days</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  <span className="font-medium">Need urgent help?</span> Email us directly at{' '}
                  <a href="mailto:support@loopin.city" className="text-primary-600 hover:text-primary-700 underline">
                    support@loopin.city
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
);

export default ContactPage; 