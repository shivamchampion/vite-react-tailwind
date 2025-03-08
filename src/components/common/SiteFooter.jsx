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
    "Marketplace": [
      { label: "Businesses", href: APP_ROUTES.MARKETPLACE.BUSINESS },
      { label: "Franchises", href: APP_ROUTES.MARKETPLACE.FRANCHISE },
      { label: "Startups", href: APP_ROUTES.MARKETPLACE.STARTUP },
      { label: "Investors", href: APP_ROUTES.MARKETPLACE.INVESTOR },
      { label: "Digital Assets", href: APP_ROUTES.MARKETPLACE.DIGITAL_ASSET }
    ],
    "Resources": [
      { label: "How It Works", href: APP_ROUTES.STATIC.HOW_IT_WORKS },
      { label: "Business Valuation", href: "/tools/valuation" },
      { label: "Market Insights", href: "/market-insights" },
      { label: "Success Stories", href: "/success-stories" },
      { label: "Blog", href: "/blog" }
    ],
    "Company": [
      { label: "About Us", href: APP_ROUTES.STATIC.ABOUT },
      { label: "Our Team", href: "/team" },
      { label: "Careers", href: "/careers" },
      { label: "Partner With Us", href: "/partners" },
      { label: "Contact Us", href: APP_ROUTES.STATIC.CONTACT }
    ],
    "Support": [
      { label: "Help Center", href: "/help" },
      { label: "FAQs", href: APP_ROUTES.STATIC.FAQ },
      { label: "Advisor Network", href: "/advisors" },
      { label: "Seller Guide", href: "/seller-guide" },
      { label: "Buyer Guide", href: "/buyer-guide" }
    ]
  };

  const socialLinks = [
    { Icon: Facebook, href: "https://facebook.com/businessoptions", ariaLabel: "Facebook" },
    { Icon: Twitter, href: "https://twitter.com/businessoptions", ariaLabel: "Twitter" },
    { Icon: Instagram, href: "https://instagram.com/businessoptions", ariaLabel: "Instagram" },
    { Icon: Linkedin, href: "https://linkedin.com/company/businessoptions", ariaLabel: "LinkedIn" },
    { Icon: Youtube, href: "https://youtube.com/c/businessoptions", ariaLabel: "YouTube" }
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: APP_ROUTES.STATIC.PRIVACY },
    { label: "Terms of Service", href: APP_ROUTES.STATIC.TERMS },
    { label: "Cookie Policy", href: "/cookie-policy" },
    { label: "Sitemap", href: "/sitemap" }
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
              India's premier marketplace for buying, selling, and investing in businesses.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map(({ Icon, href, ariaLabel }, index) => (
                <a 
                  key={index} 
                  href={href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={ariaLabel}
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