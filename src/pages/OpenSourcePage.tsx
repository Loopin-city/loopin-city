import React from 'react';
import Layout from '../components/layout/Layout';
import { ExternalLink, Github, Heart, Code, Users, Target } from 'lucide-react';

const OpenSourcePage: React.FC = () => {
  const handleGitHubRedirect = () => {
    window.open('https://github.com/Loopin-city/loopin-city', '_blank');
  };

  return (
    <Layout>
      <div className="min-h-screen py-12 px-2 flex flex-col items-center justify-center" style={{ backgroundColor: '#fef3c7' }}>
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-yellow-400 p-4 rounded-full">
              <Github className="h-12 w-12 text-accent-black" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-accent-black mb-4" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>
            Open Source Contributions
          </h1>
          <p className="text-lg sm:text-xl text-accent-black font-medium mb-6" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>
            Built by the community, for the community. Join us in strengthening India's local tech ecosystem.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Heart className="h-8 w-8 text-red-500" />
              <h2 className="text-2xl font-bold text-accent-black font-mono">Why Open Source?</h2>
            </div>
            <p className="text-accent-black font-mono mb-4 text-lg leading-relaxed">
              Loopin exists to serve India's vibrant tech communities. By making it open source, we ensure that every developer, community organizer, and tech enthusiast can contribute to building a platform that truly serves their needs.
            </p>
            <p className="text-accent-black font-mono text-lg leading-relaxed">
              This platform is built on the principle that when we build together, we build better. Every contribution helps make tech events more discoverable across India.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <div className="flex items-center gap-4 mb-6">
              <Target className="h-8 w-8 text-blue-500" />
              <h2 className="text-2xl font-bold text-accent-black font-mono">What We're Building</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-yellow-50 p-6 rounded-xl">
                <h3 className="font-bold text-accent-black font-mono mb-3">🎯 Event Discovery</h3>
                <p className="text-accent-black font-mono">A centralized platform where tech enthusiasts can discover all upcoming events in their city.</p>
              </div>
              <div className="bg-yellow-50 p-6 rounded-xl">
                <h3 className="font-bold text-accent-black font-mono mb-3">🏢 Venue Recognition</h3>
                <p className="text-accent-black font-mono">Celebrating companies that provide spaces for community events.</p>
              </div>
              <div className="bg-yellow-50 p-6 rounded-xl">
                <h3 className="font-bold text-accent-black font-mono mb-3">👥 Community Growth</h3>
                <p className="text-accent-black font-mono">Helping local tech communities reach wider audiences and grow stronger.</p>
              </div>
              <div className="bg-yellow-50 p-6 rounded-xl">
                <h3 className="font-bold text-accent-black font-mono mb-3">🔗 Simple Submission</h3>
                <p className="text-accent-black font-mono">Easy event submission process with admin verification to maintain quality.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <div className="flex items-center gap-4 mb-6">
              <Code className="h-8 w-8 text-green-500" />
              <h2 className="text-2xl font-bold text-accent-black font-mono">How You Can Contribute</h2>
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-yellow-400 pl-6">
                <h3 className="font-bold text-accent-black font-mono mb-2">🚀 Feature Development</h3>
                <p className="text-accent-black font-mono">Help us build new features that make event discovery even better.</p>
              </div>
              <div className="border-l-4 border-yellow-400 pl-6">
                <h3 className="font-bold text-accent-black font-mono mb-2">🐛 Bug Fixes</h3>
                <p className="text-accent-black font-mono">Found an issue? Help us fix it and improve the platform for everyone.</p>
              </div>
              <div className="border-l-4 border-yellow-400 pl-6">
                <h3 className="font-bold text-accent-black font-mono mb-2">📖 Documentation</h3>
                <p className="text-accent-black font-mono">Help other developers understand and contribute to the project.</p>
              </div>
              <div className="border-l-4 border-yellow-400 pl-6">
                <h3 className="font-bold text-accent-black font-mono mb-2">🎨 UI/UX Improvements</h3>
                <p className="text-accent-black font-mono">Make the platform more intuitive and beautiful for users.</p>
              </div>
              <div className="border-l-4 border-yellow-400 pl-6">
                <h3 className="font-bold text-accent-black font-mono mb-2">🌍 Localization</h3>
                <p className="text-accent-black font-mono">Help us support more Indian cities and local languages.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-3xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-accent-black mb-4 font-mono">Ready to Contribute?</h2>
            <p className="text-accent-black mb-6 font-mono text-lg">
              Join hundreds of developers building the future of tech event discovery in India.
            </p>
            <button
              onClick={handleGitHubRedirect}
              className="inline-flex items-center gap-3 bg-accent-black text-white font-bold px-8 py-4 rounded-full shadow-lg hover:bg-gray-800 transition-all transform hover:scale-105 text-xl"
              style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}
            >
              <Github className="h-6 w-6" />
              View on GitHub
              <ExternalLink className="h-5 w-5" />
            </button>
            <p className="text-accent-black mt-4 font-mono text-sm">
              ⭐ Star the repository to show your support!
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-16">
          <div className="bg-white/60 backdrop-blur-md rounded-xl p-6">
            <h3 className="text-xl font-bold text-accent-black mb-4 font-mono">🤝 Community Guidelines</h3>
            <div className="text-accent-black font-mono space-y-2">
              <p>• Be respectful and inclusive to all contributors</p>
              <p>• Follow the existing code style and conventions</p>
              <p>• Write clear commit messages and PR descriptions</p>
              <p>• Test your changes before submitting</p>
              <p>• Help review and provide feedback on others' contributions</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OpenSourcePage; 