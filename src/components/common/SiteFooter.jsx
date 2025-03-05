import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-react';
import { APP_ROUTES } from '../../utils/constants';

/**
 * SiteFooter Component
 * Footer for the website with links and contact information
 */
function SiteFooter() {
  const currentYear = new Date().getFullYear();
  
  // Footer link groups
  const footerLinks = [
    {
      title: 'Marketplace',
      links: [
        { name: 'Businesses', href: APP_ROUTES.MARKETPLACE.BUSINESS },
        { name: 'Franchises', href: APP_ROUTES.MARKETPLACE.FRANCHISE },
        { name: 'Startups', href: APP_ROUTES.MARKETPLACE.STARTUP },
        { name: 'Investors', href: APP_ROUTES.MARKETPLACE.INVESTOR },
        { name: 'Digital Assets', href: APP_ROUTES.MARKETPLACE.DIGITAL_ASSET }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: APP_ROUTES.STATIC.ABOUT },
        { name: 'How It Works', href: APP_ROUTES.STATIC.HOW_IT_WORKS },
        { name: 'Contact Us', href: APP_ROUTES.STATIC.CONTACT },
        { name: 'FAQ', href: APP_ROUTES.STATIC.FAQ }
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Terms of Service', href: APP_ROUTES.STATIC.TERMS },
        { name: 'Privacy Policy', href: APP_ROUTES.STATIC.PRIVACY },
        { name: 'Cookie Policy', href: '#' },
        { name: 'Disclaimer', href: '#' }
      ]
    }
  ];
  
  // Social media links
  const socialLinks = [
    { name: 'Facebook', icon: <Facebook size={20} />, href: 'https://facebook.com' },
    { name: 'Twitter', icon: <Twitter size={20} />, href: 'https://twitter.com' },
    { name: 'Instagram', icon: <Instagram size={20} />, href: 'https://instagram.com' },
    { name: 'LinkedIn', icon: <Linkedin size={20} />, href: 'https://linkedin.com' }
  ];
  
  // Contact information
  const contactInfo = [
    { icon: <MapPin size={20} />, text: '123 Business Street, New Delhi, India' },
    { icon: <Phone size={20} />, text: '+91 98765 43210' },
    { icon: <Mail size={20} />, text: 'contact@businessoptions.in' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link to={APP_ROUTES.HOME} className="text-xl font-bold text-white mb-4 inline-block">
              BusinessOptions
            </Link>
            <p className="text-gray-400 mb-4">
              Connect with the right business opportunities across India. Buy, sell, or invest in businesses, franchises, startups, and digital assets.
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-4 mt-4">
              {socialLinks.map((social, index) => (
                <a 
                  key={index} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          
          {/* Footer Link Groups */}
          {footerLinks.map((group, groupIndex) => (
            <div key={groupIndex}>
              <h3 className="text-lg font-semibold mb-4">{group.title}</h3>
              <ul className="space-y-2">
                {group.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      to={link.href} 
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Contact Information */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contactInfo.map((info, index) => (
              <div key={index} className="flex items-center text-gray-400">
                <span className="mr-2">{info.icon}</span>
                <span>{info.text}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-gray-400 text-center">
          <p>© {currentYear} BusinessOptions. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;