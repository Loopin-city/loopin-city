import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
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