import React from 'react';
import Layout from '../components/layout/Layout';

const AboutPage: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-white via-yellow-50 to-white py-12 px-2 flex flex-col items-center justify-center" style={{ backgroundImage: "url('/Sprinkle.svg')", backgroundRepeat: 'repeat', backgroundSize: '500px', backgroundPosition: 'center' }}>
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-accent-black mb-4" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>
            Why Loopin?
          </h1>
          <p className="text-lg sm:text-xl text-accent-black font-medium mb-2" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>
            The story, the mission, and the vision behind India's most community-driven tech events platform.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl shadow-lg p-8 mb-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-48 h-48 rounded-full border-4 border-yellow-400 overflow-hidden">
                <img 
                  src="/founder.png" 
                  alt="Mehul Pardeshi - Founder of Loopin"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-accent-black font-mono">Mehul Pardeshi</h2>
                <p className="text-accent-black font-mono mt-2">Founder of Loopin</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-accent-black font-mono mb-6">Our Story</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-accent-black font-mono mb-6">
                As someone deeply embedded in various tech communities, I've experienced firsthand the challenges of connecting local tech enthusiasts with meaningful events. Having led and participated in numerous communities, I recognized a significant gap in our ecosystem: there was no centralized platform for local communities to reach their target audience effectively.
              </p>
              <p className="text-accent-black font-mono mb-6">
                Tech enthusiasts in cities often miss out on valuable technical events simply because they don't know about them. The problem of reach has been a persistent challenge, making it difficult for both event organizers and potential attendees to connect.
              </p>
              <p className="text-accent-black font-mono mb-6">
                Another crucial aspect I noticed was the need to recognize and appreciate our venue partners. Many companies generously provide spaces for community events, supporting the growth of local tech ecosystems. It's our responsibility to give them the recognition they deserve for their invaluable contribution to the community.
              </p>
              <p className="text-accent-black font-mono mb-6">
                This is why I created Loopin: to bridge these gaps, to make tech events more discoverable, to help communities grow, and to celebrate the entire ecosystem that makes it all possible. Our mission is to strengthen local tech communities by making event discovery and organization seamless, while ensuring every contributor gets the recognition they deserve.
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-2xl mx-auto text-center mb-12 mt-16">
          <div className="bg-white/60 backdrop-blur-md rounded-xl px-6 py-6 inline-block">
            <h2 className="text-2xl font-bold text-accent-black mb-4">Our Mission</h2>
            <p className="text-lg text-accent-black mb-6">
              To be the go-to platform for discovering, sharing, and supporting tech events and communities across India, empowering organizers, enthusiasts, and venue partners alike.
            </p>
            <h2 className="text-2xl font-bold text-accent-black mb-4">Our Vision</h2>
            <p className="text-lg text-accent-black">
              A future where every tech enthusiast, community, and venue partner is connected, recognized, and thriving, no matter the city.
            </p>
          </div>
        </div>
        <div className="text-center mt-8">
          <a href="/" className="inline-block bg-yellow-400 text-accent-black font-bold px-8 py-4 rounded-full shadow-lg hover:bg-yellow-500 transition-colors text-xl" style={{ fontFamily: 'Urbanist, Inter, Space Grotesk, Arial, sans-serif' }}>
            Join the Movement
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage; 