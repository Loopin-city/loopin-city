import React, { useState, useEffect, memo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MapPin } from 'lucide-react';
import { useLocation as useLocationContext } from '../../contexts/LocationContext';
import { City } from '../../types';

// Helper function to scroll to top
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Memoized navigation items for performance
const navigationItems = [
  { to: '/', label: 'Events' },
  { to: '/communities', label: 'Communities' },
  { to: '/venues', label: 'Venue Partners' },
  { to: '/submit-event', label: 'Submit Event' },
  { to: '/about', label: 'About' },
  { to: '/open-source', label: 'Open Source' },
  { to: '/alerts', label: 'Get Alerts' },
];

// Memoized navigation link component
const NavigationLink = memo(({ to, label, isActive, onClick }: { 
  to: string; 
  label: string; 
  isActive: boolean; 
  onClick?: () => void;
}) => (
  <Link
    to={to}
    className={`group relative px-4 py-2.5 font-mono text-base font-semibold transition-all duration-300 border-b-2 border-transparent hover:scale-105 transform-gpu rounded-lg ${
      isActive 
        ? 'border-accent-black text-accent-black bg-yellow-50/80 shadow-sm' 
        : 'hover:border-accent-black hover:text-accent-black text-gray-700 hover:bg-yellow-50/50 hover:shadow-md'
    }`}
    onClick={() => {
      scrollToTop();
      onClick?.();
    }}
    aria-current={isActive ? 'page' : undefined}
  >
    <span className="relative">
      {label}
      {isActive && (
        <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-accent-black rounded-full animate-pulse" />
      )}
    </span>
  </Link>
));

// Memoized mobile menu item component
const MobileMenuItem = memo(({ to, label, isActive, onClick, index }: { 
  to: string; 
  label: string; 
  isActive: boolean; 
  onClick: () => void;
  index: number;
}) => (
  <Link
    to={to}
    className={`group relative px-6 py-4 text-lg font-semibold text-left transition-all duration-300 hover:bg-yellow-100 active:bg-yellow-200 border-l-4 border-transparent min-h-[56px] flex items-center ${
      isActive 
        ? 'text-accent-black font-bold border-l-accent-black bg-yellow-50 shadow-lg' 
        : 'text-accent-black hover:border-l-yellow-300 hover:shadow-md'
    } animate-menuItem transform-gpu hover:scale-[1.02]`}
    style={{ animationDelay: `${0.05 * index + 0.1}s` }}
    onClick={() => {
      scrollToTop();
      onClick();
    }}
    aria-current={isActive ? 'page' : undefined}
  >
    <span className="relative">
      {label}
      {isActive && (
        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent-black rounded-full animate-pulse" />
      )}
    </span>
  </Link>
));

// Enhanced location button component
const LocationButton = memo(({ selectedCity, setShowLocationModal }: { 
  selectedCity: City | null; 
  setShowLocationModal: (show: boolean) => void;
}) => (
  <button
    onClick={() => setShowLocationModal(true)}
    className="group flex items-center space-x-2 text-accent-black hover:bg-yellow-200 hover:shadow-lg px-4 py-2.5 rounded-xl transition-all duration-300 border-2 border-accent-black text-sm sm:text-base min-h-[44px] justify-center transform-gpu hover:scale-105 active:scale-95 bg-white/80 backdrop-blur-sm shadow-md hover:shadow-xl"
    aria-label={`${selectedCity ? `Change city from ${selectedCity.name}` : 'Select your city'} to discover local tech events`}
    title={selectedCity ? `Currently viewing events in ${selectedCity.name}. Click to change city.` : 'Click to select your city and discover local tech events'}
  >
    <MapPin className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
    <span className="hidden md:inline font-semibold">{selectedCity?.name || 'Select City'}</span>
    <span className="hidden sm:inline md:hidden font-semibold">{selectedCity?.name ? selectedCity.name.substring(0, 8) : 'Select'}</span>
    <span className="sm:hidden font-semibold">{selectedCity?.name || 'City'}</span>
  </button>
));

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { selectedCity, setShowLocationModal } = useLocationContext();
  
  // Enhanced body scroll prevention when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      // Store current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    
    return () => {
      // Cleanup: restore body scroll
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Enhanced scroll effect for consistent header behavior
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMenu = useCallback(() => {
    setIsMenuOpen(!isMenuOpen);
  }, [isMenuOpen]);
  
  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);
  
  const isActive = useCallback((path: string) => {
    return location.pathname === path;
  }, [location.pathname]);
  
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
  }, [isMenuOpen, closeMenu]);
  
  return (
    <header 
      className={`bg-primary text-accent-black fixed top-0 left-0 right-0 z-50 transition-all duration-300 header-safe-area ${
        isScrolled 
          ? 'shadow-xl border-b-2 border-accent-black/20' 
          : 'shadow-md'
      }`}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 sm:h-18 items-center">
          
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex-shrink-0 flex items-center group transform-gpu hover:scale-105 transition-transform duration-300" 
              onClick={() => {
                scrollToTop();
                closeMenu();
              }}
            >
              <img 
                src="/loopin-logo.svg" 
                alt="Loopin Logo" 
                className="h-16 sm:h-20 w-auto transition-transform duration-300 group-hover:rotate-3" 
              />
              <span 
                className="ml-2 sm:ml-3 text-xl sm:text-2xl font-extrabold text-accent-black group-hover:underline transition-all duration-300 flex items-center" 
                style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif', lineHeight: 1 }}
              >
                Loopin
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav 
            className="hidden lg:flex lg:space-x-3 xl:space-x-5 items-center" 
            role="navigation" 
            aria-label="Main navigation"
          >
            {navigationItems.map((item) => (
              <NavigationLink
                key={item.to}
                to={item.to}
                label={item.label}
                isActive={isActive(item.to)}
                onClick={() => {}} // Empty function to trigger scrollToTop
              />
            ))}
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center gap-3">
            <LocationButton 
              selectedCity={selectedCity} 
              setShowLocationModal={setShowLocationModal} 
            />
            
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={toggleMenu}
                className="group inline-flex items-center justify-center p-3 rounded-xl text-accent-black hover:bg-yellow-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-accent-black focus:ring-offset-2 transition-all duration-300 min-h-[44px] min-w-[44px] transform-gpu hover:scale-105 active:scale-95 bg-white/80 backdrop-blur-sm shadow-md hover:shadow-xl"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
                aria-label={isMenuOpen ? 'Close main menu' : 'Open main menu'}
              >
                <span className="sr-only">{isMenuOpen ? 'Close main menu' : 'Open main menu'}</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6 group-hover:rotate-90 transition-transform duration-300" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6 group-hover:rotate-90 transition-transform duration-300" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Mobile Navigation */}
      {isMenuOpen && (
        <>
          {/* Enhanced Backdrop - Fixed positioning to prevent scroll */}
          <div 
            className="fixed left-0 right-0 top-16 sm:top-18 bottom-0 z-30 bg-black/30 backdrop-blur-sm transition-opacity duration-300" 
            onClick={closeMenu}
            aria-hidden="true"
            style={{ touchAction: 'none' }}
          />
          
          {/* Enhanced Mobile Menu */}
          <div 
            id="mobile-menu"
            className="lg:hidden fixed left-0 right-0 top-16 sm:top-18 z-50 bg-primary shadow-2xl border-t-2 border-accent-black animate-slideDown"
            role="navigation"
            aria-label="Mobile navigation"
            style={{ touchAction: 'none' }}
          >
            <nav className="flex flex-col py-4">
              {navigationItems.map((item, idx) => (
                <MobileMenuItem
                  key={item.to}
                  to={item.to}
                  label={item.label}
                  isActive={isActive(item.to)}
                  onClick={closeMenu}
                  index={idx}
                />
              ))}
            </nav>
            
            {/* Enhanced Close Button */}
            <div className="border-t border-accent-black/20 p-4 bg-white/10">
              <button
                onClick={closeMenu}
                className="w-full py-3 px-6 bg-accent-black text-yellow-400 rounded-lg font-medium hover:bg-gray-800 active:bg-gray-900 transition-all duration-300 min-h-[44px] transform-gpu hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
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

export default memo(Header);