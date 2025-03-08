import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { APP_ROUTES } from '../../utils/constants';

/**
 * SiteFooter Component
 * The main footer for public-facing pages
 */
function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-[#0031AC] to-[#0045AC] text-white">
      <div className="max-w-[2560px] mx-auto px-4 sm:px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          <div className="col-span-2">
            <Link to={APP_ROUTES.HOME}>
              <img 
                src="/src/logo.png" 
                alt="Business Options Logo" 
                className="h-10 mb-4 filter brightness-0 invert" 
              />
            </Link>
            <p className="text-blue-100 mb-4 text-sm max-w-md">
              Empowering entrepreneurs and investors with comprehensive business discovery, 
              analysis, and networking solutions.
            </p>
            
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-200 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-200 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-200 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-200 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 text-sm">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link to={APP_ROUTES.MARKETPLACE.BUSINESS} className="text-blue-200 hover:text-white text-xs transition-colors">
                  Businesses
                </Link>
              </li>
              <li>
                <Link to={APP_ROUTES.MARKETPLACE.FRANCHISE} className="text-blue-200 hover:text-white text-xs transition-colors">
                  Franchises
                </Link>
              </li>
              <li>
                <Link to={APP_ROUTES.MARKETPLACE.STARTUP} className="text-blue-200 hover:text-white text-xs transition-colors">
                  Startups
                </Link>
              </li>
              <li>
                <Link to={APP_ROUTES.MARKETPLACE.INVESTOR} className="text-blue-200 hover:text-white text-xs transition-colors">
                  Investors
                </Link>
              </li>
              <li>
                <Link to={APP_ROUTES.MARKETPLACE.DIGITAL_ASSET} className="text-blue-200 hover:text-white text-xs transition-colors">
                  Digital Assets
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 text-sm">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/market-insights" className="text-blue-200 hover:text-white text-xs transition-colors">
                  Market Insights
                </Link>
              </li>
              <li>
                <Link to="/guides" className="text-blue-200 hover:text-white text-xs transition-colors">
                  Guides
                </Link>
              </li>
              <li>
                <Link to="/ecosystem" className="text-blue-200 hover:text-white text-xs transition-colors">
                  Ecosystem
                </Link>
              </li>
              <li>
                <Link to="/tools" className="text-blue-200 hover:text-white text-xs transition-colors">
                  Tools
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-blue-200 hover:text-white text-xs transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 text-sm">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to={APP_ROUTES.STATIC.ABOUT} className="text-blue-200 hover:text-white text-xs transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-blue-200 hover:text-white text-xs transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/press" className="text-blue-200 hover:text-white text-xs transition-colors">
                  Press
                </Link>
              </li>
              <li>
                <Link to={APP_ROUTES.STATIC.CONTACT} className="text-blue-200 hover:text-white text-xs transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/partners" className="text-blue-200 hover:text-white text-xs transition-colors">
                  Partners
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-blue-700 mt-8 pt-4 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-blue-300 text-xs mb-4 md:mb-0">
              © {currentYear} Business Options. All Rights Reserved.
            </p>
            <div className="flex space-x-6">
              <Link to={APP_ROUTES.STATIC.TERMS} className="text-blue-300 hover:text-white text-xs transition-colors">
                Terms of Service
              </Link>
              <Link to={APP_ROUTES.STATIC.PRIVACY} className="text-blue-300 hover:text-white text-xs transition-colors">
                Privacy Policy
              </Link>
              <Link to={APP_ROUTES.STATIC.FAQ} className="text-blue-300 hover:text-white text-xs transition-colors">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;