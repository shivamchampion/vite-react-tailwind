import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchSection from "./SearchSection";
import MarketplaceCarousels from "./MarketplaceCarousels";
import WhyChooseUs from "./WhyChooseUs";
import HowItWorks from "./HowItWorks";
import Testimonials from "./Testimonials";
import Statistics from "./Statistics";
import CtaSection from "./CtaSection";
import { APP_ROUTES } from '../../utils/constants';

/**
 * Enhanced Homepage Component
 * Properly connected and functional main page of the application
 */
function Homepage() {
  const navigate = useNavigate();
  
  // Function to handle authentication modal opening
  // This function is passed from MainLayout via useOutletContext
  const handleOpenAuthModal = (tab = 'login') => {
    // Get the openAuthModal function from MainLayout if available
    const openAuthModal = window.openAuthModal || (() => {
      console.warn('openAuthModal function not available');
      navigate(tab === 'login' ? APP_ROUTES.AUTH.LOGIN : APP_ROUTES.AUTH.REGISTER);
    });
    
    // Call the function with the specified tab
    openAuthModal(tab);
  };

  return (
    <div className="min-h-screen bg-white">
      <SearchSection />
      
      <MarketplaceCarousels 
        onContactClick={() => handleOpenAuthModal('login')}
      />
      
      <WhyChooseUs />
      
      <HowItWorks 
        onGetStartedClick={() => handleOpenAuthModal('register')}
      />
      
      <Testimonials 
        onReadMoreClick={() => navigate(APP_ROUTES.STATIC.ABOUT)}
      />
      
      <Statistics />
      
      <CtaSection 
        onRegisterClick={() => handleOpenAuthModal('register')}
        onLearnMoreClick={() => navigate(APP_ROUTES.STATIC.HOW_IT_WORKS)}
        onSubscribeClick={(email) => {
          // Here you would handle newsletter subscription
          alert(`Thank you for subscribing with ${email}! You'll receive our weekly newsletter.`);
        }}
      />
    </div>
  );
}

export default Homepage;