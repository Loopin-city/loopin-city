import React, { memo, useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Instagram, Linkedin, Facebook, MapPin, Users, Calendar } from 'lucide-react';

// Memoized social media links with enhanced micro-interactions
const SocialMediaLinks = memo(() => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const socialLinks = [
    {
      href: "https://www.linkedin.com/company/city-loopin/",
      label: "Visit our LinkedIn page",
      icon: Linkedin,
      color: "hover:bg-blue-600"
    },
    {
      href: "https://www.instagram.com/loopin.city?igsh=bnZ4dm9hOHNrMnFl",
      label: "Follow us on Instagram",
      icon: Instagram,
      color: "hover:bg-pink-600"
    },
    {
      href: "https://www.facebook.com/share/1UsXT81666/?mibextid=wwXIfr",
      label: "Like us on Facebook",
      icon: Facebook,
      color: "hover:bg-blue-700"
    },
    {
      href: "mailto:support@loopin.city",
      label: "Send us an email",
      icon: Mail,
      color: "hover:bg-red-600"
    }
  ];

  return (
    <div className="flex space-x-4 sm:space-x-3">
      {socialLinks.map((link, index) => {
        const Icon = link.icon;
        return (
          <a 
            key={index}
            href={link.href} 
            className={`text-accent-black hover:text-white ${link.color} p-3 sm:p-2 rounded-xl sm:rounded-lg transition-all duration-300 hover:scale-110 active:scale-95 touch-manipulation transform-gpu shadow-lg hover:shadow-xl`}
            aria-label={link.label}
            target={link.href.startsWith('http') ? "_blank" : undefined}
            rel={link.href.startsWith('http') ? "noopener noreferrer" : undefined}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Icon className={`h-6 w-6 sm:h-5 sm:w-5 transition-transform duration-300 ${hoveredIndex === index ? 'rotate-12' : ''}`} />
          </a>
        );
      })}
    </div>
  );
});

// Memoized quick stats with loading animation
const QuickStats = memo(() => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { icon: Calendar, text: "100+ Events Monthly", delay: 0 },
    { icon: Users, text: "50+ Communities", delay: 100 },
    { icon: MapPin, text: "25+ Cities", delay: 200 }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div 
            key={index}
            className={`flex items-center gap-2 text-xs text-accent-black font-mono bg-white/20 rounded-lg p-2 sm:p-1 transition-all duration-500 transform ${
              isLoaded 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: `${stat.delay}ms` }}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{stat.text}</span>
          </div>
        );
      })}
    </div>
  );
});

// Enhanced navigation link component with micro-interactions and auto-scroll
const NavigationLink = memo(({ to, children, icon: Icon }: { to: string; children: React.ReactNode; icon?: React.ComponentType<{ className?: string }> }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = () => {
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <li>
      <Link 
        to={to} 
        className="text-sm text-accent-black hover:text-accent-white hover:bg-accent-black px-3 py-2.5 sm:py-2 rounded-lg transition-all duration-300 font-mono block touch-manipulation active:scale-95 transform-gpu group relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <span className="relative z-10 flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />}
          {children}
        </span>
        <div 
          className={`absolute inset-0 bg-accent-black transform transition-transform duration-300 ease-out ${
            isHovered ? 'translate-x-0' : '-translate-x-full'
          }`}
        />
      </Link>
    </li>
  );
});

// Loading skeleton for footer content
const FooterSkeleton = () => (
  <div className="animate-pulse">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
      <div className="sm:col-span-2">
        <div className="bg-white/20 rounded-xl p-4 sm:p-6 h-48"></div>
      </div>
      <div className="bg-white/20 rounded-xl p-4 sm:p-6 h-32"></div>
      <div className="bg-white/20 rounded-xl p-4 sm:p-6 h-32"></div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
      <div className="bg-white/10 rounded-xl p-4 sm:p-6 h-24"></div>
      <div className="bg-white/10 rounded-xl p-4 sm:p-6 h-24"></div>
      <div className="sm:col-span-2 lg:col-span-1 bg-white/20 rounded-xl p-4 sm:p-6 h-24"></div>
    </div>
  </div>
);

const Footer: React.FC = () => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Simulate loading time for smooth appearance
    const loadingTimer = setTimeout(() => setIsLoading(false), 500);
    const visibilityTimer = setTimeout(() => setIsVisible(true), 100);
    
    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(visibilityTimer);
    };
  }, []);

  if (isLoading) {
    return (
      <footer className="bg-primary border-t border-accent-black" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <FooterSkeleton />
        </div>
      </footer>
    );
  }

  return (
    <footer 
      className={`bg-primary border-t border-accent-black transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`} 
      role="contentinfo" 
      aria-label="Footer navigation and company information"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        
        {/* Main Footer Content - Mobile First Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          
          {/* Brand & Mission Section - Full width on mobile */}
          <div className="sm:col-span-2">
            <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-accent-black/10 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
              <div className="flex items-center group mb-4">
                <img 
                  src="/loopin-logo.svg" 
                  alt="Loopin Logo" 
                  className="h-14 w-auto sm:h-16 transition-transform duration-300 group-hover:rotate-3" 
                  loading="lazy"
                />
                <span className="ml-3 text-lg sm:text-xl font-extrabold font-mono text-accent-black group-hover:underline transition-all duration-200" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>
                  Loopin
                </span>
              </div>
              <p className="text-accent-black text-sm font-mono leading-relaxed mb-4 max-w-md">
                Discover, share, and join the best tech events happening in your city. Stay connected with your local tech community and never miss what's happening around you.
              </p>
              
              <QuickStats />
              <SocialMediaLinks />
            </div>
          </div>

          {/* Discover Section - Mobile optimized */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-accent-black/10 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
            <h3 className="text-sm font-semibold text-accent-black tracking-wider uppercase font-mono mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              Discover
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <NavigationLink to="/">Events</NavigationLink>
              <NavigationLink to="/communities">Communities</NavigationLink>
              <NavigationLink to="/venues">Venue Partners</NavigationLink>
            </ul>
          </div>

          {/* Participate Section - Mobile optimized */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-accent-black/10 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
            <h3 className="text-sm font-semibold text-accent-black tracking-wider uppercase font-mono mb-4 flex items-center gap-2">
              <Users className="h-4 w-4 flex-shrink-0" />
              Participate
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <NavigationLink to="/submit-event">Submit Event</NavigationLink>
              <NavigationLink to="/alerts">Get Alerts</NavigationLink>
              <NavigationLink to="/about">About Us</NavigationLink>
            </ul>
          </div>
        </div>

        {/* Secondary Footer Content - Mobile optimized grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
          
          {/* Resources Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-accent-black/10 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
            <h3 className="text-sm font-semibold text-accent-black tracking-wider uppercase font-mono mb-4">Resources</h3>
            <ul className="space-y-2 sm:space-y-3">
              <NavigationLink to="/open-source">Open Source</NavigationLink>
              <NavigationLink to="/contact">Contact Support</NavigationLink>
            </ul>
          </div>

          {/* Legal Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-accent-black/10 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
            <h3 className="text-sm font-semibold text-accent-black tracking-wider uppercase font-mono mb-4">Legal</h3>
            <ul className="space-y-2 sm:space-y-3">
              <NavigationLink to="/privacy">Privacy Policy</NavigationLink>
              <NavigationLink to="/terms">Terms of Service</NavigationLink>
            </ul>
          </div>

          {/* Quick Action Section - Full width on mobile */}
          <div className="sm:col-span-2 lg:col-span-1 bg-white/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-accent-black/10 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
            <h3 className="text-sm font-semibold text-accent-black tracking-wider uppercase font-mono mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              <Link 
                to="/submit-event" 
                className="inline-block bg-accent-black text-white text-sm font-bold px-4 py-3 sm:py-2 rounded-lg hover:bg-gray-800 transition-all duration-300 font-mono text-center w-full touch-manipulation active:scale-95 transform-gpu shadow-lg hover:shadow-xl hover:scale-105"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Submit Event
              </Link>
              <Link 
                to="/alerts" 
                className="inline-block border border-accent-black text-accent-black text-sm font-bold px-4 py-3 sm:py-2 rounded-lg hover:bg-accent-black hover:text-white transition-all duration-300 font-mono text-center w-full touch-manipulation active:scale-95 transform-gpu shadow-lg hover:shadow-xl hover:scale-105"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Get Alerts
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright Section - Mobile optimized */}
        <div className="mt-8 sm:mt-10 border-t border-accent-black/20 pt-4 sm:pt-6">
          <div className="flex justify-center">
            <p className="text-sm text-accent-black/80 font-medium text-center">
              &copy; {currentYear} Loopin. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Memoize the entire footer component for performance
export default memo(Footer);