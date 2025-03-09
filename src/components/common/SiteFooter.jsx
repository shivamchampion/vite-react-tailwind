import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { animateScroll as scroll } from 'react-scroll';
import { Facebook, Twitter, Instagram, Linkedin, ArrowUp, Mail, MapPin, Phone } from "lucide-react";
import { APP_ROUTES } from '../../utils/constants';

/**
 * ScrollToTop Component - Scrolls to top on route change
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  
  useEffect(() => {
    // Only scroll to top if there's no hash
    if (!hash) {
      // Use react-scroll's animateScroll for smooth scrolling to top
      scroll.scrollToTop({
        duration: 500,
        smooth: true,
        delay: 100 // Small delay to ensure it happens after route change
      });
    }
  }, [pathname, hash]);
  
  return null;
};

/**
 * SiteFooter Component
 * The main footer for public-facing pages with professional smooth scrolling
 */
function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const location = useLocation();
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Track scroll position to show/hide the scroll button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Professional smooth scroll to top using react-scroll
  const scrollToTop = () => {
    scroll.scrollToTop({
      duration: 800,
      smooth: 'easeInOutQuart',
      offset: 0
    });
  };

  // Enhanced navigation with smooth scroll
  const handleNavigation = (to, e) => {
    e.preventDefault();
    
    // If it's the same page, just scroll to top
    if (to === location.pathname) {
      scrollToTop();
    } else {
      // Navigate to the new page
      navigate(to);
      
      // Use react-scroll after navigation
      setTimeout(() => {
        scroll.scrollToTop({
          duration: 500, 
          smooth: true
        });
      }, 100);
    }
  };

  // Scroll to section if hash exists
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      scroll.scrollTo(section.offsetTop - 80, {
        duration: 800,
        smooth: 'easeInOutQuart',
        offset: -80 // Offset for fixed header
      });
    }
  };

  // Check for hash in URL on load
  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.replace('#', '');
      // Small delay to ensure DOM is loaded
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 300);
    }
  }, [location.hash]);

  return (
    <>
      {/* ScrollToTop component to handle route changes */}
      <ScrollToTop />
      
      <footer className="bg-white border-t border-gray-200 relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white opacity-70 pointer-events-none"></div>
        
        <div className="max-w-[2560px] mx-auto px-4 sm:px-6 lg:px-12 py-12 relative">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-8">
            {/* Company Information */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <a 
                href={APP_ROUTES.HOME} 
                onClick={(e) => handleNavigation(APP_ROUTES.HOME, e)}
                className="block mb-6 transition-transform hover:translate-y-[-2px] duration-300"
              >
                <img 
                  src="/src/logo.png" 
                  alt="Business Options Logo" 
                  className="h-10" 
                />
              </a>
              <p className="text-gray-600 mb-6 text-sm max-w-md leading-relaxed">
                Empowering entrepreneurs and investors with comprehensive business discovery, 
                analysis, and networking solutions.
              </p>
              
              {/* Contact Information */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600 text-xs">
                  <MapPin size={16} className="text-indigo-600 mr-2 flex-shrink-0" />
                  <span>123 Business Avenue, Suite 500, New York, NY 10001</span>
                </div>
                <div className="flex items-center text-gray-600 text-xs">
                  <Phone size={16} className="text-indigo-600 mr-2 flex-shrink-0" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center text-gray-600 text-xs">
                  <Mail size={16} className="text-indigo-600 mr-2 flex-shrink-0" />
                  <span>info@businessoptions.com</span>
                </div>
              </div>
              
              {/* Social Media Links */}
              <div className="flex space-x-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                  className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors duration-300">
                  <Facebook size={18} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                  className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors duration-300">
                  <Twitter size={18} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                  className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors duration-300">
                  <Instagram size={18} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" 
                  className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors duration-300">
                  <Linkedin size={18} />
                </a>
              </div>
            </div>
            
            {/* Navigation Columns */}
            <div className="lg:col-span-1">
              <h4 className="font-semibold mb-4 text-sm text-gray-800 uppercase tracking-wider">Explore</h4>
              <ul className="space-y-2">
                <li>
                  <a href={APP_ROUTES.MARKETPLACE.BUSINESS}
                    onClick={(e) => handleNavigation(APP_ROUTES.MARKETPLACE.BUSINESS, e)}
                    className="text-gray-600 hover:text-indigo-700 text-xs transition-colors hover:translate-x-1 inline-block duration-300">
                    Businesses
                  </a>
                </li>
                <li>
                  <a href={APP_ROUTES.MARKETPLACE.FRANCHISE}
                    onClick={(e) => handleNavigation(APP_ROUTES.MARKETPLACE.FRANCHISE, e)}
                    className="text-gray-600 hover:text-indigo-700 text-xs transition-colors hover:translate-x-1 inline-block duration-300">
                    Franchises
                  </a>
                </li>
                <li>
                  <a href={APP_ROUTES.MARKETPLACE.STARTUP}
                    onClick={(e) => handleNavigation(APP_ROUTES.MARKETPLACE.STARTUP, e)}
                    className="text-gray-600 hover:text-indigo-700 text-xs transition-colors hover:translate-x-1 inline-block duration-300">
                    Startups
                  </a>
                </li>
                <li>
                  <a href={APP_ROUTES.MARKETPLACE.INVESTOR}
                    onClick={(e) => handleNavigation(APP_ROUTES.MARKETPLACE.INVESTOR, e)}
                    className="text-gray-600 hover:text-indigo-700 text-xs transition-colors hover:translate-x-1 inline-block duration-300">
                    Investors
                  </a>
                </li>
                <li>
                  <a href={APP_ROUTES.MARKETPLACE.DIGITAL_ASSET}
                    onClick={(e) => handleNavigation(APP_ROUTES.MARKETPLACE.DIGITAL_ASSET, e)}
                    className="text-gray-600 hover:text-indigo-700 text-xs transition-colors hover:translate-x-1 inline-block duration-300">
                    Digital Assets
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="lg:col-span-1">
              <h4 className="font-semibold mb-4 text-sm text-gray-800 uppercase tracking-wider">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/market-insights"
                    onClick={(e) => handleNavigation("/market-insights", e)}
                    className="text-gray-600 hover:text-indigo-700 text-xs transition-colors hover:translate-x-1 inline-block duration-300">
                    Market Insights
                  </a>
                </li>
                <li>
                  <a href="/guides"
                    onClick={(e) => handleNavigation("/guides", e)}
                    className="text-gray-600 hover:text-indigo-700 text-xs transition-colors hover:translate-x-1 inline-block duration-300">
                    Guides
                  </a>
                </li>
                <li>
                  <a href="/ecosystem"
                    onClick={(e) => handleNavigation("/ecosystem", e)}
                    className="text-gray-600 hover:text-indigo-700 text-xs transition-colors hover:translate-x-1 inline-block duration-300">
                    Ecosystem
                  </a>
                </li>
                <li>
                  <a href="/tools"
                    onClick={(e) => handleNavigation("/tools", e)}
                    className="text-gray-600 hover:text-indigo-700 text-xs transition-colors hover:translate-x-1 inline-block duration-300">
                    Tools
                  </a>
                </li>
                <li>
                  <a href="/blog"
                    onClick={(e) => handleNavigation("/blog", e)}
                    className="text-gray-600 hover:text-indigo-700 text-xs transition-colors hover:translate-x-1 inline-block duration-300">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="lg:col-span-1">
              <h4 className="font-semibold mb-4 text-sm text-gray-800 uppercase tracking-wider">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href={APP_ROUTES.STATIC.ABOUT}
                    onClick={(e) => handleNavigation(APP_ROUTES.STATIC.ABOUT, e)}
                    className="text-gray-600 hover:text-indigo-700 text-xs transition-colors hover:translate-x-1 inline-block duration-300">
                    About
                  </a>
                </li>
                <li>
                  <a href="/careers"
                    onClick={(e) => handleNavigation("/careers", e)}
                    className="text-gray-600 hover:text-indigo-700 text-xs transition-colors hover:translate-x-1 inline-block duration-300">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="/press"
                    onClick={(e) => handleNavigation("/press", e)}
                    className="text-gray-600 hover:text-indigo-700 text-xs transition-colors hover:translate-x-1 inline-block duration-300">
                    Press
                  </a>
                </li>
                <li>
                  <a href={APP_ROUTES.STATIC.CONTACT}
                    onClick={(e) => handleNavigation(APP_ROUTES.STATIC.CONTACT, e)}
                    className="text-gray-600 hover:text-indigo-700 text-xs transition-colors hover:translate-x-1 inline-block duration-300">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="/partners"
                    onClick={(e) => handleNavigation("/partners", e)}
                    className="text-gray-600 hover:text-indigo-700 text-xs transition-colors hover:translate-x-1 inline-block duration-300">
                    Partners
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Newsletter Signup */}
            <div className="lg:col-span-1">
              <h4 className="font-semibold mb-4 text-sm text-gray-800 uppercase tracking-wider">Stay Updated</h4>
              <p className="text-gray-600 text-xs mb-3">Subscribe to our newsletter for the latest insights and opportunities.</p>
              <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-2 rounded-r-md transition-colors duration-300"
                  >
                    Subscribe
                  </button>
                </div>
                <p className="text-gray-500 text-xs">We respect your privacy. Unsubscribe at any time.</p>
              </form>
            </div>
          </div>
          
          {/* Footer Bottom */}
          <div className="border-t border-gray-200 mt-10 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 text-xs mb-4 md:mb-0">
                © {currentYear} Business Options. All Rights Reserved.
              </p>
              <div className="flex flex-wrap justify-center space-x-4 md:space-x-6">
                <a href={APP_ROUTES.STATIC.TERMS}
                  onClick={(e) => handleNavigation(APP_ROUTES.STATIC.TERMS, e)}
                  className="text-gray-500 hover:text-indigo-700 text-xs transition-colors">
                  Terms of Service
                </a>
                <a href={APP_ROUTES.STATIC.PRIVACY}
                  onClick={(e) => handleNavigation(APP_ROUTES.STATIC.PRIVACY, e)}
                  className="text-gray-500 hover:text-indigo-700 text-xs transition-colors">
                  Privacy Policy
                </a>
                <a href={APP_ROUTES.STATIC.FAQ}
                  onClick={(e) => handleNavigation(APP_ROUTES.STATIC.FAQ, e)}
                  className="text-gray-500 hover:text-indigo-700 text-xs transition-colors">
                  FAQ
                </a>
                <a href="/sitemap"
                  onClick={(e) => handleNavigation("/sitemap", e)}
                  className="text-gray-500 hover:text-indigo-700 text-xs transition-colors">
                  Sitemap
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Back to top button with professional smooth scroll */}
        <button 
          onClick={scrollToTop}
          className={`fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 z-40 ${
            showScrollButton 
              ? 'opacity-100 transform translate-y-0' 
              : 'opacity-0 transform translate-y-10 pointer-events-none'
          }`}
          aria-label="Back to top"
          id="back-to-top-button"
        >
          <ArrowUp size={20} />
        </button>
      </footer>
    </>
  );
}

export default SiteFooter;