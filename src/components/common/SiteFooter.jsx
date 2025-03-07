import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { APP_ROUTES } from '../../utils/constants';

/**
 * SiteFooter Component
 * Main site footer with links and copyright information
 */
function SiteFooter() {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = {
    "Platform": [
      { label: "How It Works", href: APP_ROUTES.STATIC.HOW_IT_WORKS },
      { label: "Browse Businesses", href: APP_ROUTES.MARKETPLACE.BUSINESS },
      { label: "Market Intelligence", href: "#market-insights" },
      { label: "Verified Listings", href: "#verified-listings" }
    ],
    "Resources": [
      { label: "Business Valuation", href: "#valuation" },
      { label: "Investment Guides", href: "#guides" },
      { label: "Market Reports", href: "#reports" },
      { label: "Expert Advisors", href: "#advisors" }
    ],
    "Company": [
      { label: "About Us", href: APP_ROUTES.STATIC.ABOUT },
      { label: "Our Team", href: "#team" },
      { label: "Careers", href: "#careers" },
      { label: "Press", href: "#press" }
    ],
    "Support": [
      { label: "Contact Us", href: APP_ROUTES.STATIC.CONTACT },
      { label: "Help Center", href: "#help" },
      { label: "FAQs", href: APP_ROUTES.STATIC.FAQ },
      { label: "Feedback", href: "#feedback" }
    ]
  };

  const socialLinks = [
    { Icon: Facebook, href: "#" },
    { Icon: Twitter, href: "#" },
    { Icon: Instagram, href: "#" },
    { Icon: Linkedin, href: "#" },
    { Icon: Youtube, href: "#" }
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: APP_ROUTES.STATIC.PRIVACY },
    { label: "Terms of Service", href: APP_ROUTES.STATIC.TERMS },
    { label: "Cookie Policy", href: "#" },
    { label: "Sitemap", href: "#" }
  ];

  return (
    <footer className="bg-gray-50 text-gray-800 pt-12 pb-6">
      <div className="max-w-[2560px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Link to={APP_ROUTES.HOME}>
                <img src="/src/logo.png" alt="Business Options Logo" className="h-8" />
              </Link>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Connecting entrepreneurs, investors, and business opportunities across India.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map(({ Icon, href }, index) => (
                <a 
                  key={index} 
                  href={href} 
                  className="text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.href} 
                      className="text-gray-600 text-sm hover:text-indigo-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-200 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-500 text-xs">
                © {currentYear} Business Options. All Rights Reserved.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {legalLinks.map((item, index) => (
                <Link 
                  key={index} 
                  to={item.href} 
                  className="text-gray-500 hover:text-indigo-600 text-xs transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;