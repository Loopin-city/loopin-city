import React from 'react';
import Layout from '../components/layout/Layout';
import { ExternalLink, Github, Heart, Code, Users, Target } from 'lucide-react';

const OpenSourcePage: React.FC = () => {
  const handleGitHubRedirect = () => {
    window.open('https://github.com/Loopin-city/loopin-city', '_blank');
  };

  return (
    <Layout>
      <div className="min-h-screen py-12 px-2 flex flex-col items-center justify-center bg-gradient-to-br from-white via-yellow-50 to-orange-50">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="flex justify-center mb-8">
            <div className="bg-yellow-400 p-6 rounded-full shadow-lg">
              <Github className="h-16 w-16 text-accent-black" aria-hidden="true" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-accent-black mb-6" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>
            Open Source Contributions
          </h1>
          <p className="text-lg sm:text-xl text-accent-black font-medium mb-8 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>
            Built by the community, for the community. Join us in strengthening India's local tech ecosystem.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-3xl shadow-xl p-10 mb-10">
            <div className="flex items-center gap-5 mb-8">
              <div className="bg-red-100 p-3 rounded-xl">
                <Heart className="h-10 w-10 text-red-500" aria-hidden="true" />
              </div>
              <h2 className="text-3xl font-bold text-accent-black" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>Why Open Source?</h2>
            </div>
            <div className="space-y-6">
              <p className="text-accent-black text-lg leading-relaxed" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>
                Loopin exists to serve India's vibrant tech communities. By making it open source, we ensure that every developer, community organizer, and tech enthusiast can contribute to building a platform that truly serves their needs.
              </p>
              <p className="text-accent-black text-lg leading-relaxed" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>
                This platform is built on the principle that when we build together, we build better. Every contribution helps make tech events more discoverable across India.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-3xl shadow-xl p-10">
            <div className="flex items-center gap-5 mb-8">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Target className="h-10 w-10 text-blue-500" aria-hidden="true" />
              </div>
              <h2 className="text-3xl font-bold text-accent-black" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>What We're Building</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-2xl border border-yellow-200">
                <h3 className="font-bold text-accent-black mb-4 text-lg" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>🎯 Event Discovery</h3>
                <p className="text-accent-black leading-relaxed" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>A centralized platform where tech enthusiasts can discover all upcoming events in their city.</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-2xl border border-yellow-200">
                <h3 className="font-bold text-accent-black mb-4 text-lg" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>🏢 Venue Recognition</h3>
                <p className="text-accent-black leading-relaxed" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>Celebrating companies that provide spaces for community events.</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-2xl border border-yellow-200">
                <h3 className="font-bold text-accent-black mb-4 text-lg" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>👥 Community Growth</h3>
                <p className="text-accent-black leading-relaxed" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>Helping local tech communities reach wider audiences and grow stronger.</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-2xl border border-yellow-200">
                <h3 className="font-bold text-accent-black mb-4 text-lg" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>🔗 Simple Submission</h3>
                <p className="text-accent-black leading-relaxed" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>Easy event submission process with admin verification to maintain quality.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-3xl shadow-xl p-10">
            <div className="flex items-center gap-5 mb-8">
              <div className="bg-green-100 p-3 rounded-xl">
                <Code className="h-10 w-10 text-green-500" aria-hidden="true" />
              </div>
              <h2 className="text-3xl font-bold text-accent-black" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>How You Can Contribute</h2>
            </div>
            <div className="space-y-6">
              <div className="border-l-4 border-yellow-400 pl-8 py-2">
                <h3 className="font-bold text-accent-black mb-3 text-lg" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>🚀 Feature Development</h3>
                <p className="text-accent-black leading-relaxed" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>Help us build new features that make event discovery even better.</p>
              </div>
              <div className="border-l-4 border-yellow-400 pl-8 py-2">
                <h3 className="font-bold text-accent-black mb-3 text-lg" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>🐛 Bug Fixes</h3>
                <p className="text-accent-black leading-relaxed" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>Found an issue? Help us fix it and improve the platform for everyone.</p>
              </div>
              <div className="border-l-4 border-yellow-400 pl-8 py-2">
                <h3 className="font-bold text-accent-black mb-3 text-lg" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>📖 Documentation</h3>
                <p className="text-accent-black leading-relaxed" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>Help other developers understand and contribute to the project.</p>
              </div>
              <div className="border-l-4 border-yellow-400 pl-8 py-2">
                <h3 className="font-bold text-accent-black mb-3 text-lg" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>🎨 UI/UX Improvements</h3>
                <p className="text-accent-black leading-relaxed" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>Make the platform more intuitive and beautiful for users.</p>
              </div>
              <div className="border-l-4 border-yellow-400 pl-8 py-2">
                <h3 className="font-bold text-accent-black mb-3 text-lg" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>🌍 Localization</h3>
                <p className="text-accent-black leading-relaxed" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>Help us support more Indian cities and local languages.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-3xl p-10 shadow-xl">
            <h2 className="text-3xl font-bold text-accent-black mb-6" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>Ready to Contribute?</h2>
            <p className="text-accent-black mb-8 text-xl leading-relaxed" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>
              Join hundreds of developers building the future of tech event discovery in India.
            </p>
            <button
              onClick={handleGitHubRedirect}
              className="inline-flex items-center gap-3 bg-accent-black text-white font-bold px-10 py-5 rounded-full shadow-lg hover:bg-gray-800 focus:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all transform hover:scale-105 text-xl"
              style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}
              aria-label="View Loopin City project on GitHub (opens in new tab)"
            >
              <Github className="h-6 w-6" aria-hidden="true" />
              View on GitHub
              <ExternalLink className="h-5 w-5" aria-hidden="true" />
            </button>
            <p className="text-accent-black mt-6 text-base" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>
              ⭐ Star the repository to show your support!
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-yellow-200/50">
            <h3 className="text-2xl font-bold text-accent-black mb-6" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>🤝 Community Guidelines</h3>
            <div className="text-accent-black space-y-3" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>
              <p className="flex items-center gap-3">• Be respectful and inclusive to all contributors</p>
              <p className="flex items-center gap-3">• Follow the existing code style and conventions</p>
              <p className="flex items-center gap-3">• Write clear commit messages and PR descriptions</p>
              <p className="flex items-center gap-3">• Test your changes before submitting</p>
              <p className="flex items-center gap-3">• Help review and provide feedback on others' contributions</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OpenSourcePage; 