import React from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
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
  
  // Get the openAuthModal function from outlet context
  const { openAuthModal } = useOutletContext() || {};
  
  // Function to handle authentication modal opening
  const handleOpenAuthModal = (tab = 'login') => {
    if (typeof openAuthModal === 'function') {
      // If we have the function from context, use it
      openAuthModal(tab);
    } else {
      // Fallback to navigation if the function is not available
      console.warn('openAuthModal function not available in context');
      navigate(tab === 'login' ? APP_ROUTES.AUTH.LOGIN : APP_ROUTES.AUTH.REGISTER);
    }
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
      />
    </div>
  );
}

export default Homepage;