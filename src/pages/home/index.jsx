import React from 'react';
import { useOutletContext } from 'react-router-dom';
import SearchSection from "./SearchSection";
import MarketplaceCarousels from "./MarketplaceCarousels";
import WhyChooseUs from "./WhyChooseUs";
import HowItWorks from "./HowItWorks";
import Testimonials from "./Testimonials";
import Statistics from "./Statistics";
import CtaSection from "./CtaSection";
import SiteFooter from "@/components/common/SiteFooter";


/**
 * Homepage Component
 * Main page of the application
 */
function Homepage() {
  return (
    <div className="min-h-screen bg-white">
      
      <SearchSection />
      <MarketplaceCarousels />
      <WhyChooseUs />
      <HowItWorks />
      <Testimonials />
      <Statistics />
      <CtaSection />
    </div>
  );
}

export default Homepage;