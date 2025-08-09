import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import type { Sponsor } from '../../types';

interface SponsorsCarouselProps {
  sponsors: Sponsor[];
}

const SponsorsCarousel: React.FC<SponsorsCarouselProps> = ({ sponsors }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || sponsors.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === sponsors.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, sponsors.length]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(currentIndex === 0 ? sponsors.length - 1 : currentIndex - 1);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(currentIndex === sponsors.length - 1 ? 0 : currentIndex + 1);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handleSponsorClick = (sponsor: Sponsor) => {
    if (sponsor.website_url) {
      try {
        let url = sponsor.website_url.trim();
        if (!/^https?:\/\//i.test(url)) {
          url = `https://${url}`;
        }
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
        if (newWindow) {
          newWindow.opener = null;
        }
      } catch (e) {
        console.error('Error opening sponsor link:', e);
      }
    }
  };

  if (!sponsors || sponsors.length === 0) {
    return null;
  }

  return (
    <div 
      className="rounded-2xl shadow-sm p-6 bg-yellow-50 border border-yellow-200"
              style={{ backgroundColor: '#fef3c7' }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          Sponsored By
        </h3>
        {sponsors.length > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={goToPrevious}
              className="p-2 rounded-full bg-white/60 backdrop-blur-sm hover:bg-white transition-colors duration-200 shadow"
              aria-label="Previous sponsor"
            >
              <ChevronLeft className="w-4 h-4 text-gray-800" />
            </button>
            <button
              onClick={goToNext}
              className="p-2 rounded-full bg-white/60 backdrop-blur-sm hover:bg-white transition-colors duration-200 shadow"
              aria-label="Next sponsor"
            >
              <ChevronRight className="w-4 h-4 text-gray-800" />
            </button>
          </div>
        )}
      </div>

      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {sponsors.map((sponsor, index) => (
            <div
              key={sponsor.id || index}
              className="w-full flex-shrink-0"
            >
              <div
                className={`relative group ${
                  sponsor.website_url ? 'cursor-pointer' : ''
                }`}
                onClick={() => handleSponsorClick(sponsor)}
              >
                <div 
                  className="relative h-48 sm:h-56 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300 border-2 border-white/50"
                >
                  <img
                    src={sponsor.banner_url}
                    alt={`${sponsor.name} banner`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/default-sponsor-banner.jpg'; // A fallback image
                    }}
                  />
                  
                  {/* Overlay for clickable sponsors */}
                  {sponsor.website_url && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                        <ExternalLink className="w-5 h-5 text-gray-800" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Sponsor name and website info */}
                <div className="mt-4 text-center">
                  <h4 className="font-semibold text-gray-900 text-lg">
                    {sponsor.name}
                  </h4>
                  {sponsor.website_url && (
                    <p className="text-sm text-yellow-700 hover:text-yellow-800 font-semibold transition-colors duration-200 mt-1">
                      Visit Website →
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots indicator for multiple sponsors */}
      {sponsors.length > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {sponsors.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsAutoPlaying(false);
                setTimeout(() => setIsAutoPlaying(true), 10000);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-yellow-500 w-6' 
                  : 'bg-yellow-200 hover:bg-yellow-300'
              }`}
              aria-label={`Go to sponsor ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SponsorsCarousel; 