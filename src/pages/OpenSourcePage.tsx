import React from 'react';
import Layout from '../components/layout/Layout';
import { ExternalLink, Github, Heart, Code, Users, Target, Star, GitBranch, GitPullRequest, GitCommit, Zap, Shield, Globe, Palette, BookOpen, Bug, Rocket } from 'lucide-react';

const OpenSourcePage: React.FC = () => {
  const handleGitHubRedirect = () => {
    window.open('https://github.com/Loopin-city/loopin-city', '_blank');
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-12 sm:pb-16">
          <div className="text-center">
            {/* GitHub Icon with Enhanced Styling */}
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary-400 to-primary-500 rounded-3xl shadow-2xl mb-6 sm:mb-8 transform hover:scale-105 transition-transform duration-300">
              <Github className="h-10 w-10 sm:h-12 sm:w-12 text-accent-black" aria-hidden="true" />
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-accent-black mb-4 sm:mb-6 leading-tight">
              Open Source
              <span className="block text-primary-500">Contributions</span>
            </h1>
            
            {/* Value Proposition */}
            <p className="text-lg sm:text-xl lg:text-2xl text-accent-black font-medium mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed px-4">
              Built by the community, for the community. Join us in strengthening India's local tech ecosystem through collaborative development.
            </p>
          </div>
        </div>
      </div>

      {/* Why Open Source Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-accent-black mb-4 sm:mb-6 leading-tight">
                Why We Believe in Open Source
              </h2>
              <div className="space-y-3 sm:space-y-4 text-base sm:text-lg text-accent-black leading-relaxed">
                <p>
                  Loopin exists to serve India's vibrant tech communities. By making it open source, we ensure that every developer, community organizer, and tech enthusiast can contribute to building a platform that truly serves their needs.
                </p>
                <p>
                  This platform is built on the principle that when we build together, we build better. Every contribution helps make tech events more discoverable across India.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-primary-200">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary-400 rounded-full"></div>
                    <span className="text-xs sm:text-sm font-medium text-accent-black">Transparency</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary-400 rounded-full"></div>
                    <span className="text-xs sm:text-sm font-medium text-accent-black">Community Ownership</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary-400 rounded-full"></div>
                    <span className="text-xs sm:text-sm font-medium text-accent-black">Continuous Improvement</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary-400 rounded-full"></div>
                    <span className="text-xs sm:text-sm font-medium text-accent-black">Knowledge Sharing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What We're Building Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-accent-black mb-3 sm:mb-4">What We're Building</h2>
          <p className="text-lg sm:text-xl text-accent-black max-w-3xl mx-auto px-4">
            A comprehensive platform that connects tech communities, events, and venues across India
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
              <Target className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-accent-black mb-2 sm:mb-3">Event Discovery</h3>
            <p className="text-sm sm:text-base text-accent-black leading-relaxed">Centralized platform for discovering tech events across Indian cities with advanced filtering and search.</p>
          </div>
          
          <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-accent-black mb-2 sm:mb-3">Community Growth</h3>
            <p className="text-sm sm:text-base text-accent-black leading-relaxed">Helping local tech communities reach wider audiences and grow stronger through better visibility.</p>
          </div>
          
          <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
              <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-accent-black mb-2 sm:mb-3">Venue Recognition</h3>
            <p className="text-sm sm:text-base text-accent-black leading-relaxed">Celebrating companies that provide spaces for community events and supporting the ecosystem.</p>
          </div>
          
          <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
              <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-accent-black mb-2 sm:mb-3">Simple Submission</h3>
            <p className="text-sm sm:text-base text-accent-black leading-relaxed">Streamlined event submission process with admin verification to maintain quality standards.</p>
          </div>
        </div>
      </div>

      {/* How to Contribute Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 lg:p-12">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-accent-black mb-3 sm:mb-4">How You Can Contribute</h2>
            <p className="text-lg sm:text-xl text-accent-black max-w-3xl mx-auto px-4">
              Choose your area of expertise and help us build the future of tech event discovery
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="group">
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 border-l-4 border-primary-400 group-hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                    <Rocket className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-accent-black">Feature Development</h3>
                </div>
                <p className="text-sm sm:text-base text-accent-black leading-relaxed">Build new features that enhance event discovery and user experience across the platform.</p>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 border-l-4 border-primary-400 group-hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                    <Bug className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-accent-black">Bug Fixes</h3>
                </div>
                <p className="text-sm sm:text-base text-accent-black leading-relaxed">Identify and resolve issues to improve platform stability and performance for all users.</p>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 border-l-4 border-primary-400 group-hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                    <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-accent-black">Documentation</h3>
                </div>
                <p className="text-sm sm:text-base text-accent-black leading-relaxed">Help other developers understand and contribute to the project through clear documentation.</p>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 border-l-4 border-primary-400 group-hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                    <Palette className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-accent-black">UI/UX Improvements</h3>
                </div>
                <p className="text-sm sm:text-base text-accent-black leading-relaxed">Enhance the platform's visual design and user experience for better accessibility.</p>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 border-l-4 border-primary-400 group-hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                    <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-accent-black">Localization</h3>
                </div>
                <p className="text-sm sm:text-base text-accent-black leading-relaxed">Support more Indian cities and local languages to make the platform truly inclusive.</p>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 border-l-4 border-primary-400 group-hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center">
                    <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-accent-black">Security & Testing</h3>
                </div>
                <p className="text-sm sm:text-base text-accent-black leading-relaxed">Improve platform security and add comprehensive testing for better reliability.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        <div className="bg-gradient-to-r from-primary-400 to-primary-500 rounded-2xl sm:rounded-3xl p-8 sm:p-12 shadow-2xl text-center">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-accent-black rounded-full flex items-center justify-center">
              <Github className="h-6 w-6 sm:h-8 sm:w-8 text-primary-400" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-accent-black mb-4 sm:mb-6">Ready to Contribute?</h2>
          <p className="text-lg sm:text-xl text-accent-black mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
            Join hundreds of developers building the future of tech event discovery in India. Every contribution makes a difference.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6 sm:mb-8">
            <button
              onClick={handleGitHubRedirect}
              className="inline-flex items-center gap-3 bg-accent-black text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-lg hover:bg-gray-800 focus:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-primary-300 transition-all transform hover:scale-105 text-base sm:text-lg"
              aria-label="View Loopin City project on GitHub (opens in new tab)"
            >
              <Github className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
              View on GitHub
              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
            </button>
            
            <div className="flex items-center gap-2 text-accent-black">
              <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
              <span className="font-medium text-sm sm:text-base">Star the repository</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 text-xs sm:text-sm text-accent-black">
            <div className="flex items-center gap-3 sm:gap-2">
              <GitBranch className="h-5 w-5 sm:h-4 sm:w-4" />
              <span className="text-sm sm:text-xs font-medium">Fork & Clone</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-2">
              <GitCommit className="h-5 w-5 sm:h-4 sm:w-4" />
              <span className="text-sm sm:text-xs font-medium">Make Changes</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-2">
              <GitPullRequest className="h-5 w-5 sm:h-4 sm:w-4" />
              <span className="text-sm sm:text-xs font-medium">Submit PR</span>
            </div>
          </div>
        </div>
      </div>

      {/* Community Guidelines Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        <div className="bg-white/60 backdrop-blur-md rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg border border-primary-200/50">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-accent-black mb-3 sm:mb-4">Community Guidelines</h3>
            <p className="text-base sm:text-lg text-accent-black">Building together requires respect, collaboration, and shared values</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm sm:text-base text-accent-black">Be respectful and inclusive to all contributors</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm sm:text-base text-accent-black">Follow existing code style and conventions</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm sm:text-base text-accent-black">Write clear commit messages and PR descriptions</span>
              </div>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm sm:text-base text-accent-black">Test your changes before submitting</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm sm:text-base text-accent-black">Help review and provide feedback on others' work</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm sm:text-base text-accent-black">Celebrate and acknowledge contributions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OpenSourcePage; 