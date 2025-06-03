import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MapPin } from 'lucide-react';
import { useLocation as useLocationContext } from '../../contexts/LocationContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { selectedCity, setShowLocationModal } = useLocationContext();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="bg-primary text-accent-black sticky top-0 z-50 shadow-sm">
      <div className="px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between h-12 sm:h-14 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <img src="/loopin-logo.svg" alt="Loopin Logo" className="h-16 sm:h-20 w-auto" />
              <span className="ml-2 text-xl sm:text-2xl font-extrabold text-accent-black group-hover:underline flex items-center" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif', lineHeight: 1 }}>Loopin</span>
            </Link>
          </div>
          <nav className="hidden sm:flex sm:space-x-4 lg:space-x-6 items-center">
            <Link
              to="/"
              className={`px-2 py-1 font-mono text-lg font-semibold transition-colors duration-200 border-b-2 border-transparent ${isActive('/') ? 'border-accent-black text-accent-black' : 'hover:border-accent-black hover:text-accent-black text-gray-700'}`}
            >
              Events
            </Link>
            <Link
              to="/communities"
              className={`px-2 py-1 font-mono text-lg font-semibold transition-colors duration-200 border-b-2 border-transparent ${isActive('/communities') ? 'border-accent-black text-accent-black' : 'hover:border-accent-black hover:text-accent-black text-gray-700'}`}
            >
              Communities
            </Link>
            <Link
              to="/venues"
              className={`px-2 py-1 font-mono text-lg font-semibold transition-colors duration-200 border-b-2 border-transparent ${isActive('/venues') ? 'border-accent-black text-accent-black' : 'hover:border-accent-black hover:text-accent-black text-gray-700'}`}
            >
              Venue Partners
            </Link>
            <Link
              to="/submit-event"
              className={`px-2 py-1 font-mono text-lg font-semibold transition-colors duration-200 border-b-2 border-transparent ${isActive('/submit-event') ? 'border-accent-black text-accent-black' : 'hover:border-accent-black hover:text-accent-black text-gray-700'}`}
            >
              Submit Event
            </Link>
            <Link
              to="/about"
              className={`px-2 py-1 font-mono text-lg font-semibold transition-colors duration-200 border-b-2 border-transparent ${isActive('/about') ? 'border-accent-black text-accent-black' : 'hover:border-accent-black hover:text-accent-black text-gray-700'}`}
            >
              About
            </Link>
            <Link
              to="/open-source"
              className={`px-2 py-1 font-mono text-lg font-semibold transition-colors duration-200 border-b-2 border-transparent ${isActive('/open-source') ? 'border-accent-black text-accent-black' : 'hover:border-accent-black hover:text-accent-black text-gray-700'}`}
            >
              Open Source
            </Link>
            <Link
              to="/alerts"
              className={`px-2 py-1 font-mono text-lg font-semibold transition-colors duration-200 border-b-2 border-transparent ${isActive('/alerts') ? 'border-accent-black text-accent-black' : 'hover:border-accent-black hover:text-accent-black text-gray-700'}`}
            >
              Get Alerts
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLocationModal(true)}
              className="flex items-center space-x-1 text-accent-black hover:bg-yellow-200 px-2 py-1 rounded transition-colors duration-200 border border-accent-black text-sm sm:text-base"
            >
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">{selectedCity?.name || 'Select City'}</span>
              <span className="sm:hidden">{selectedCity?.name ? selectedCity.name[0] : <span className='text-xs'>City</span>}</span>
            </button>
            <div className="flex items-center sm:hidden">
              <button
                type="button"
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-accent-black hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-accent-black focus:ring-inset transition-colors duration-200"
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <>
          <div className="fixed left-0 right-0 top-12 sm:top-14 bottom-0 z-30 bg-black/10 backdrop-blur-sm" onClick={toggleMenu}></div>
          <div className="sm:hidden fixed left-0 right-0 top-12 sm:top-14 z-50 bg-primary shadow-md border-t border-accent-black animate-slideDown">
            <nav className="flex flex-col">
              {[
                { to: '/', label: 'Events' },
                { to: '/communities', label: 'Communities' },
                { to: '/venues', label: 'Venue Partners' },
                { to: '/submit-event', label: 'Submit Event' },
                { to: '/about', label: 'About' },
                { to: '/open-source', label: 'Open Source' },
                { to: '/alerts', label: 'Get Alerts' },
              ].map((item, idx) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-4 py-3 text-base font-semibold text-left transition-colors duration-150 hover:bg-yellow-100 ${
                    isActive(item.to) ? 'text-accent-black font-bold' : 'text-accent-black'
                  } animate-menuItem`}
                  style={{ animationDelay: `${0.07 * idx + 0.08}s` }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;