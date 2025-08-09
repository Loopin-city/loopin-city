import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LocationModal from './components/location/LocationModal';
import { LocationProvider } from './contexts/LocationContext';
import './App.css';


import HomePage from './pages/HomePage';
import EventDetailPage from './pages/EventDetailPage';
import SubmitEventPage from './pages/SubmitEventPage';
import CommunitiesPage from './pages/CommunitiesPage';
import VenuePartnersPage from './pages/VenuePartnersPage';
import AboutPage from './pages/AboutPage';
import OpenSourcePage from './pages/OpenSourcePage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import ContactPage from './pages/ContactPage';
import SubscribeAlertsPage from './pages/SubscribeAlertsPage';
import AdminDebugPage from './pages/AdminDebugPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <LocationProvider>
      <div className="App viewport-fill">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/event/:id" element={<EventDetailPage />} />
          <Route path="/submit-event" element={<SubmitEventPage />} />
          <Route path="/communities" element={<CommunitiesPage />} />
          <Route path="/venues" element={<VenuePartnersPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/open-source" element={<OpenSourcePage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/alerts" element={<SubscribeAlertsPage />} />
          <Route path="/admin-debug" element={<AdminDebugPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <LocationModal />
      </div>
    </LocationProvider>
  );
}

export default App;