import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-primary border-t border-accent-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
          <div className="flex flex-col items-start gap-3 md:gap-4">
            <div className="flex items-center group">
              <img src="/loopin-logo.svg" alt="Loopin Logo" className="h-24 w-auto" />
              <span className="ml-2 text-2xl font-extrabold font-mono text-accent-black group-hover:underline" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>Loopin</span>
            </div>
            <p className="text-accent-black text-sm max-w-xs font-mono">
              Discover, share, and join the best tech events happening in your city. Stay connected with your local tech community and never miss what's happening around you.
            </p>
            <div className="flex space-x-4 mt-2">
              <a href="https://www.linkedin.com/company/city-loopin/" className="text-accent-black hover:text-accent-white hover:bg-accent-black p-1 rounded transition-colors duration-200">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z" />
                </svg>
              </a>
              <a href="mailto:support@loopin.city" className="text-accent-black hover:text-accent-white hover:bg-accent-black p-1 rounded transition-colors duration-200">
                <span className="sr-only">Email</span>
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div className="flex flex-col items-start gap-2">
            <h3 className="text-xs font-semibold text-accent-black tracking-wider uppercase font-mono">Navigate</h3>
            <ul className="mt-2 space-y-2">
              <li><Link to="/" className="text-sm text-accent-black hover:underline font-mono">Events</Link></li>
              <li><Link to="/communities" className="text-sm text-accent-black hover:underline font-mono">Communities</Link></li>
              <li><Link to="/venues" className="text-sm text-accent-black hover:underline font-mono">Venue Partners</Link></li>
              <li><Link to="/submit-event" className="text-sm text-accent-black hover:underline font-mono">Submit Event</Link></li>
              <li><Link to="/about" className="text-sm text-accent-black hover:underline font-mono">About</Link></li>
              <li><Link to="/alerts" className="text-sm text-accent-black hover:underline font-mono">Get Alerts</Link></li>
            </ul>
          </div>
          <div className="flex flex-col items-start gap-2">
            <h3 className="text-xs font-semibold text-accent-black tracking-wider uppercase font-mono">Legal</h3>
            <ul className="mt-2 space-y-2">
              <li><Link to="/privacy" className="text-sm text-accent-black hover:underline font-mono">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-accent-black hover:underline font-mono">Terms of Service</Link></li>
              <li><Link to="/contact" className="text-sm text-accent-black hover:underline font-mono">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-accent-black pt-4">
          <p className="text-xs text-accent-black font-mono">
            &copy; {currentYear} Loopin. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;