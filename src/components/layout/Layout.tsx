import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* Spacer to prevent content from being hidden behind fixed header */}
      <div className="h-16 sm:h-18"></div>
      <main className="flex-grow">
        <div style={{ backgroundColor: '#fef3c7', minHeight: '100%' }}>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;