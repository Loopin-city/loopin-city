import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MapPin } from 'lucide-react';
import { useLocation as useLocationContext } from '../../contexts/LocationContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { selectedCity, setShowLocationModal } = useLocationContext();
  
  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  // Handle escape key to close menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMenu();
      }
    };
    
    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMenuOpen]);
  
  return (
    <header className="bg-primary text-accent-black sticky top-0 z-50 shadow-sm">
      <div className="px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between h-12 sm:h-14 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group" onClick={closeMenu}>
              <img src="/loopin-logo.svg" alt="Loopin Logo" className="h-16 sm:h-20 w-auto" />
              <span className="ml-2 text-xl sm:text-2xl font-extrabold text-accent-black group-hover:underline flex items-center" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif', lineHeight: 1 }}>Loopin</span>
            </Link>
          </div>
          <nav className="hidden sm:flex sm:space-x-4 lg:space-x-6 items-center" role="navigation" aria-label="Main navigation">
            <Link
              to="/"
              className={`px-2 py-1 font-mono text-lg font-semibold transition-colors duration-200 border-b-2 border-transparent ${isActive('/') ? 'border-accent-black text-accent-black' : 'hover:border-accent-black hover:text-accent-black text-gray-700'}`}
              aria-current={isActive('/') ? 'page' : undefined}
            >
              Events
            </Link>
            <Link
              to="/communities"
              className={`px-2 py-1 font-mono text-lg font-semibold transition-colors duration-200 border-b-2 border-transparent ${isActive('/communities') ? 'border-accent-black text-accent-black' : 'hover:border-accent-black hover:text-accent-black text-gray-700'}`}
              aria-current={isActive('/communities') ? 'page' : undefined}
            >
              Communities
            </Link>
            <Link
              to="/venues"
              className={`px-2 py-1 font-mono text-lg font-semibold transition-colors duration-200 border-b-2 border-transparent ${isActive('/venues') ? 'border-accent-black text-accent-black' : 'hover:border-accent-black hover:text-accent-black text-gray-700'}`}
              aria-current={isActive('/venues') ? 'page' : undefined}
            >
              Venue Partners
            </Link>
            <Link
              to="/submit-event"
              className={`px-2 py-1 font-mono text-lg font-semibold transition-colors duration-200 border-b-2 border-transparent ${isActive('/submit-event') ? 'border-accent-black text-accent-black' : 'hover:border-accent-black hover:text-accent-black text-gray-700'}`}
              aria-current={isActive('/submit-event') ? 'page' : undefined}
            >
              Submit Event
            </Link>
            <Link
              to="/about"
              className={`px-2 py-1 font-mono text-lg font-semibold transition-colors duration-200 border-b-2 border-transparent ${isActive('/about') ? 'border-accent-black text-accent-black' : 'hover:border-accent-black hover:text-accent-black text-gray-700'}`}
              aria-current={isActive('/about') ? 'page' : undefined}
            >
              About
            </Link>
            <Link
              to="/open-source"
              className={`px-2 py-1 font-mono text-lg font-semibold transition-colors duration-200 border-b-2 border-transparent ${isActive('/open-source') ? 'border-accent-black text-accent-black' : 'hover:border-accent-black hover:text-accent-black text-gray-700'}`}
              aria-current={isActive('/open-source') ? 'page' : undefined}
            >
              Open Source
            </Link>
            <Link
              to="/alerts"
              className={`px-2 py-1 font-mono text-lg font-semibold transition-colors duration-200 border-b-2 border-transparent ${isActive('/alerts') ? 'border-accent-black text-accent-black' : 'hover:border-accent-black hover:text-accent-black text-gray-700'}`}
              aria-current={isActive('/alerts') ? 'page' : undefined}
            >
              Get Alerts
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLocationModal(true)}
              className="flex items-center space-x-1 text-accent-black hover:bg-yellow-200 px-2 py-1 rounded transition-colors duration-200 border border-accent-black text-sm sm:text-base min-h-[44px] min-w-[44px] justify-center"
              aria-label={`Select city. Current city: ${selectedCity?.name || 'None selected'}`}
            >
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">{selectedCity?.name || 'Select City'}</span>
              <span className="sm:hidden">{selectedCity?.name ? selectedCity.name[0] : <span className='text-xs'>City</span>}</span>
            </button>
            <div className="flex items-center sm:hidden">
              <button
                type="button"
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-3 rounded-md text-accent-black hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-accent-black focus:ring-offset-2 transition-all duration-200 min-h-[44px] min-w-[44px]"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
                aria-label={isMenuOpen ? 'Close main menu' : 'Open main menu'}
              >
                <span className="sr-only">{isMenuOpen ? 'Close main menu' : 'Open main menu'}</span>
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
      
      {/* Enhanced Mobile Navigation */}
      {isMenuOpen && (
        <>
          {/* Backdrop with improved accessibility */}
          <div 
            className="fixed left-0 right-0 top-12 sm:top-14 bottom-0 z-30 bg-black/20 backdrop-blur-sm transition-opacity duration-200" 
            onClick={closeMenu}
            aria-hidden="true"
          />
          
          {/* Mobile Menu with enhanced animations and accessibility */}
          <div 
            id="mobile-menu"
            className="sm:hidden fixed left-0 right-0 top-12 sm:top-14 z-50 bg-primary shadow-xl border-t-2 border-accent-black animate-slideDown"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <nav className="flex flex-col py-2">
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
                  className={`px-6 py-4 text-lg font-semibold text-left transition-all duration-200 hover:bg-yellow-100 active:bg-yellow-200 border-l-4 border-transparent ${
                    isActive(item.to) 
                      ? 'text-accent-black font-bold border-l-accent-black bg-yellow-50' 
                      : 'text-accent-black hover:border-l-yellow-300'
                  } animate-menuItem min-h-[56px] flex items-center`}
                  style={{ animationDelay: `${0.05 * idx + 0.1}s` }}
                  onClick={closeMenu}
                  aria-current={isActive(item.to) ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            
            {/* Enhanced close button for better UX */}
            <div className="border-t border-accent-black p-4">
              <button
                onClick={closeMenu}
                className="w-full py-3 px-6 bg-accent-black text-yellow-400 rounded-lg font-medium hover:bg-gray-800 active:bg-gray-900 transition-colors duration-200 min-h-[44px]"
                aria-label="Close menu"
              >
                Close Menu
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;