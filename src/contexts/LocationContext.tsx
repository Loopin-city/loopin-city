import React, { createContext, useContext, useState, useEffect } from 'react';
import { City } from '../types';

interface LocationContextType {
  selectedCity: City | null;
  setSelectedCity: (city: City | null) => void;
  showLocationModal: boolean;
  setShowLocationModal: (show: boolean) => void;
  resetLocationModal: () => void; 
  isFirstTimeUser: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);

  
  useEffect(() => {
    
    if (initialLoadComplete) return;
    
    const savedCity = localStorage.getItem('selectedCity');
    const hasSeenLocationModal = localStorage.getItem('hasSeenLocationModal');
    
    if (savedCity) {
      try {
        setSelectedCity(JSON.parse(savedCity));
        setInitialLoadComplete(true);
      } catch (error) {
        console.error('Error parsing saved city:', error);
        localStorage.removeItem('selectedCity');
        
        if (!hasSeenLocationModal) {
          setShowLocationModal(true);
          setIsFirstTimeUser(true);
        }
        setInitialLoadComplete(true);
      }
    } else {
      
      if (!hasSeenLocationModal) {
        setShowLocationModal(true);
        setIsFirstTimeUser(true);
      }
      setInitialLoadComplete(true);
    }
  }, [initialLoadComplete]);

  
  useEffect(() => {
    if (selectedCity) {
      localStorage.setItem('selectedCity', JSON.stringify(selectedCity));
    } else {
      localStorage.removeItem('selectedCity');
    }
  }, [selectedCity]);

  
  const handleSetShowLocationModal = (show: boolean) => {
    setShowLocationModal(show);
    
    
    if (!show) {
      localStorage.setItem('hasSeenLocationModal', 'true');
      setIsFirstTimeUser(false);
    }
  };

  
  const resetLocationModal = () => {
    localStorage.removeItem('hasSeenLocationModal');
    localStorage.removeItem('selectedCity');
    setSelectedCity(null);
    setShowLocationModal(true);
    setInitialLoadComplete(false);
    setIsFirstTimeUser(true);
  };

  
  useEffect(() => {
    (window as any).resetLocationModal = resetLocationModal;
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Development helper: Call resetLocationModal() in console to reset location modal');
    }
  }, []);

  return (
    <LocationContext.Provider
      value={{
        selectedCity,
        setSelectedCity,
        showLocationModal,
        setShowLocationModal: handleSetShowLocationModal,
        resetLocationModal,
        isFirstTimeUser,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};