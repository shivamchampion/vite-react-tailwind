import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { APP_ROUTES } from '../../utils/constants';

/**
 * SiteHeader Component
 * Main header for the website with navigation and authentication controls
 */
function SiteHeader({ openAuthModal }) {
  const { currentUser, userProfile, signout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Toggle user dropdown menu
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signout();
      setUserMenuOpen(false);
      navigate(APP_ROUTES.HOME);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Change header style on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Navigation links configuration
  const navigationLinks = [
    { name: 'Home', href: APP_ROUTES.HOME },
    { 
      name: 'Marketplace', 
      href: '#',
      dropdown: [
        { name: 'Businesses', href: APP_ROUTES.MARKETPLACE.BUSINESS },
        { name: 'Franchises', href: APP_ROUTES.MARKETPLACE.FRANCHISE },
        { name: 'Startups', href: APP_ROUTES.MARKETPLACE.STARTUP },
        { name: 'Investors', href: APP_ROUTES.MARKETPLACE.INVESTOR },
        { name: 'Digital Assets', href: APP_ROUTES.MARKETPLACE.DIGITAL_ASSET },
      ] 
    },
    { name: 'How It Works', href: APP_ROUTES.STATIC.HOW_IT_WORKS },
    { name: 'About Us', href: APP_ROUTES.STATIC.ABOUT },
    { name: 'Contact', href: APP_ROUTES.STATIC.CONTACT },
  ];

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md py-2' : 'bg-white py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to={APP_ROUTES.HOME} className="flex items-center">
              <span className="text-xl font-bold text-blue-600">BusinessOptions</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigationLinks.map((link, index) => (
              link.dropdown ? (
                <div key={index} className="relative group">
                  <button className="group flex items-center text-gray-700 hover:text-blue-600 font-medium">
                    {link.name}
                    <ChevronDown size={16} className="ml-1" />
                  </button>
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    {link.dropdown.map((sublink, subindex) => (
                      <Link 
                        key={subindex} 
                        to={sublink.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {sublink.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={index}
                  to={link.href}
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  {link.name}
                </Link>
              )
            ))}
          </nav>
          
          {/* Authentication Buttons or User Menu */}
          <div className="flex items-center">
            {currentUser ? (
              <div className="relative ml-3">
                <button
                  className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
                  onClick={toggleUserMenu}
                >
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2">
                    {userProfile?.displayName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden md:block">{userProfile?.displayName || 'User'}</span>
                  <ChevronDown size={16} className="ml-1" />
                </button>
                
                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to={APP_ROUTES.DASHBOARD.ROOT}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User size={16} className="mr-2" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4">
                <button
                  onClick={() => openAuthModal('login')}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Login
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Register
                </button>
              </div>
            )}
            
            {/* Mobile menu button */}
            <button
              className="ml-4 md:hidden"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? (
                <X size={24} className="text-gray-600" />
              ) : (
                <Menu size={24} className="text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden p-4 bg-white border-t">
          <nav className="flex flex-col space-y-4">
            {navigationLinks.map((link, index) => (
              link.dropdown ? (
                <div key={index} className="space-y-2">
                  <div className="font-medium text-gray-700">{link.name}</div>
                  <div className="pl-4 flex flex-col space-y-2">
                    {link.dropdown.map((sublink, subindex) => (
                      <Link 
                        key={subindex} 
                        to={sublink.href}
                        className="text-gray-600 hover:text-blue-600"
                        onClick={toggleMobileMenu}
                      >
                        {sublink.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={index}
                  to={link.href}
                  className="text-gray-700 hover:text-blue-600 font-medium"
                  onClick={toggleMobileMenu}
                >
                  {link.name}
                </Link>
              )
            ))}
            
            {!currentUser && (
              <div className="pt-4 mt-4 border-t border-gray-200 flex flex-col space-y-2">
                <button
                  onClick={() => {
                    openAuthModal('login');
                    toggleMobileMenu();
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    openAuthModal('register');
                    toggleMobileMenu();
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-center"
                >
                  Register
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default SiteHeader;