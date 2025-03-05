import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@heroui/react";
import { 
  ChevronDown, 
  Menu, 
  X, 
  Building, 
  TrendingUp, 
  Lightbulb, 
  Users, 
  Globe, 
  Info, 
  BookOpen, 
  User, 
  Briefcase, 
  BarChart3, 
  Award, 
  LineChart, 
  Search, 
  HelpCircle, 
  MessageSquare, 
  Mail, 
  ChevronRight, 
  Home 
} from "lucide-react";

/**
 * Navigation Item component for consistent styling across different navigation areas
 */
const NavItem = ({ href, icon, children, className = "" }) => (
  <a 
    href={href} 
    className={`flex items-center text-gray-700 hover:text-indigo-700 font-medium px-3 py-2 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200 whitespace-nowrap ${className}`}
  >
    {icon && <span className="flex-shrink-0">{icon}</span>}
    <span className={icon ? "ml-1.5" : ""}>{children}</span>
  </a>
);

/**
 * Dropdown menu item component
 */
const DropdownItem = ({ href, icon, children }) => (
  <a 
    href={href} 
    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 border-l-2 border-transparent hover:border-indigo-500"
  >
    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-indigo-600 bg-indigo-100 rounded-md mr-3">
      {icon}
    </span>
    <span>{children}</span>
  </a>
);

/**
 * Mobile menu item component
 */
const MobileMenuItem = ({ href, icon, children }) => (
  <a
    href={href}
    className="flex items-center px-3 py-2.5 text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 rounded-md text-sm"
  >
    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-indigo-600 bg-indigo-100 rounded-md mr-2">
      {icon}
    </span>
    <span>{children}</span>
  </a>
);

/**
 * Resources dropdown menu component
 */
const ResourcesDropdown = ({ isOpen, resourcesItems }) => (
  <div className="absolute left-0 mt-1 w-72 bg-white rounded-lg shadow-xl border border-gray-100 z-50 py-1 overflow-hidden">
    <div className="py-2 px-3 bg-gradient-to-r from-indigo-50 to-indigo-100 border-b border-indigo-100">
      <h3 className="text-sm font-medium text-indigo-800">Platform Resources</h3>
      <p className="text-xs text-indigo-600 mt-0.5">Helpful guides to maximize your experience</p>
    </div>
    <div className="py-1">
      {resourcesItems.map((item) => (
        <DropdownItem key={item.name} href={item.href} icon={item.icon}>
          {item.name}
        </DropdownItem>
      ))}
    </div>
    <div className="mt-1 px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-t border-indigo-100">
      <a href="/all-resources" className="text-xs text-indigo-700 hover:text-indigo-900 font-medium flex items-center">
        View all resources
        <ChevronRight size={14} className="ml-1" />
      </a>
    </div>
  </div>
);

/**
 * Company dropdown menu component
 */
const CompanyDropdown = ({ isOpen, companyItems }) => (
  <div className="absolute right-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
    <div className="py-2 px-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
      <h3 className="text-sm font-medium text-indigo-800">Our Company</h3>
    </div>
    <div className="py-1">
      {companyItems.map((item) => (
        <DropdownItem key={item.name} href={item.href} icon={item.icon}>
          {item.name}
        </DropdownItem>
      ))}
    </div>
  </div>
);

/**
 * Desktop navigation component
 */
const DesktopNavigation = ({ 
  mainNavItems, 
  resourcesOpen, 
  setResourcesOpen, 
  companyOpen, 
  setCompanyOpen, 
  resourcesRef, 
  companyRef, 
  resourcesItems, 
  companyItems 
}) => (
  <nav className="flex items-center space-x-1">
    {mainNavItems.map((item) => (
      <NavItem key={item.name} href={item.href} icon={item.icon}>
        {item.name}
      </NavItem>
    ))}
    
    {/* Resources Dropdown */}
    <div className="relative" ref={resourcesRef}>
      <button 
        className={`flex items-center text-gray-700 hover:text-indigo-700 font-medium px-3 py-2 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200 whitespace-nowrap ${resourcesOpen ? 'text-indigo-700 bg-white shadow-sm' : ''}`}
        onClick={() => {
          setResourcesOpen(!resourcesOpen);
          setCompanyOpen(false);
        }}
      >
        <BookOpen className="w-4 h-4 flex-shrink-0" />
        <span className="ml-1.5">Resources</span>
        <ChevronDown className={`ml-1.5 w-4 h-4 transition-transform ${resourcesOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {resourcesOpen && <ResourcesDropdown isOpen={resourcesOpen} resourcesItems={resourcesItems} />}
    </div>
    
    {/* Company Dropdown */}
    <div className="relative" ref={companyRef}>
      <button 
        className={`flex items-center text-gray-700 hover:text-indigo-700 font-medium px-3 py-2 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200 whitespace-nowrap ${companyOpen ? 'text-indigo-700 bg-white shadow-sm' : ''}`}
        onClick={() => {
          setCompanyOpen(!companyOpen);
          setResourcesOpen(false);
        }}
      >
        <Info className="w-4 h-4 flex-shrink-0" />
        <span className="ml-1.5">Company</span>
        <ChevronDown className={`ml-1.5 w-4 h-4 transition-transform ${companyOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {companyOpen && <CompanyDropdown isOpen={companyOpen} companyItems={companyItems} />}
    </div>
  </nav>
);

/**
 * Mobile navigation menu component
 */
const MobileNavMenu = ({ isOpen, mainNavItems, resourcesItems, companyItems }) => (
  <div className={`xl:hidden bg-white border-t border-gray-200 shadow-lg animate-slideDown ${isOpen ? 'block' : 'hidden'}`}>
    <div className="px-4 pt-2 pb-6 space-y-1">
      {/* Become an Advisor button at top for small screens only */}
      <div className="md:hidden pt-2 pb-2">
        <Button 
          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-sm hover:shadow-md items-center text-sm flex justify-center" 
          variant="flat"
        >
          <Briefcase className="w-4 h-4 mr-1.5" />
          <span>Become an Advisor</span>
        </Button>
      </div>
      
      {/* Main Navigation Items */}
      <div className="py-2">
        <div className="flex items-center px-3 py-2 text-indigo-700 font-medium">
          <span>Explore Opportunities</span>
        </div>
        <div className="ml-4 pl-4 border-l-2 border-indigo-100">
          {mainNavItems.map((item) => (
            <MobileMenuItem key={item.name} href={item.href} icon={item.icon}>
              {item.name}
            </MobileMenuItem>
          ))}
        </div>
      </div>
      
      {/* Resources Section */}
      <div className="py-2">
        <div className="flex items-center px-3 py-2 text-indigo-700 font-medium">
          <BookOpen className="w-5 h-5 mr-2" />
          <span>Resources</span>
        </div>
        <div className="ml-4 pl-4 border-l-2 border-indigo-100">
          {resourcesItems.map((item) => (
            <MobileMenuItem key={item.name} href={item.href} icon={item.icon}>
              {item.name}
            </MobileMenuItem>
          ))}
        </div>
      </div>
      
      {/* Company Section */}
      <div className="py-2">
        <div className="flex items-center px-3 py-2 text-indigo-700 font-medium">
          <Info className="w-5 h-5 mr-2" />
          <span>Company</span>
        </div>
        <div className="ml-4 pl-4 border-l-2 border-indigo-100">
          {companyItems.map((item) => (
            <MobileMenuItem key={item.name} href={item.href} icon={item.icon}>
              {item.name}
            </MobileMenuItem>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/**
 * Authentication buttons component
 */
const AuthButtons = ({ showMobileMenu, setShowMobileMenu }) => (
  <div className="flex items-center gap-1 sm:gap-3 ml-auto">
    {/* Become an Advisor - visible on medium and large screens */}
    <Button 
      className="hidden md:flex bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-sm hover:shadow-md items-center text-xs lg:text-sm whitespace-nowrap"
      variant="flat"
    >
      <Briefcase className="w-3.5 h-3.5 lg:w-4 lg:h-4 mr-1 lg:mr-1.5" />
      <span>Become an Advisor</span>
    </Button>
    
    <div className="hidden md:block h-8 w-[1px] bg-gray-200 mx-1"></div>
    
    {/* Login Button */}
    <Button 
      className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-all duration-200 items-center text-xs sm:text-sm flex whitespace-nowrap px-2 sm:px-3"
      variant="flat"
    >
      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
      <span>Login</span>
    </Button>
    
    {/* Register Button */}
    <Button 
      className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-sm hover:shadow-md text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3"
    >
      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 md:hidden" />
      <span>Register</span>
    </Button>
    
    {/* Mobile/Tablet Menu Button - visible on 2xl screens and below */}
    <button
      type="button"
      className="2xl:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 focus:outline-none ml-1"
      onClick={() => setShowMobileMenu(!showMobileMenu)}
    >
      <span className="sr-only">Open main menu</span>
      {showMobileMenu ? (
        <X className="block h-6 w-6" aria-hidden="true" />
      ) : (
        <Menu className="block h-6 w-6" aria-hidden="true" />
      )}
    </button>
  </div>
);

/**
 * Secondary navigation for xl screens
 */
const SecondaryNavigation = ({ 
  mainNavItems, 
  resourcesRef, 
  companyRef, 
  resourcesOpen, 
  setResourcesOpen, 
  companyOpen, 
  setCompanyOpen 
}) => (
  <div className="hidden xl:block 2xl:hidden border-b border-gray-200 bg-gradient-to-r from-indigo-50 via-white to-indigo-50">
    <div className="max-w-[2560px] mx-auto px-8 xl:px-12">
      <div className="flex items-center justify-center h-12">
        <nav className="flex items-center space-x-2">
          {mainNavItems.map((item) => (
            <NavItem key={item.name} href={item.href} icon={item.icon} className="px-4">
              {item.name}
            </NavItem>
          ))}
          
          {/* Resources Dropdown */}
          <div className="relative" ref={resourcesRef}>
            <button 
              className={`flex items-center text-gray-700 hover:text-indigo-700 font-medium px-4 py-2 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200 whitespace-nowrap ${resourcesOpen ? 'text-indigo-700 bg-white shadow-sm' : ''}`}
              onClick={() => {
                setResourcesOpen(!resourcesOpen);
                setCompanyOpen(false);
              }}
            >
              <BookOpen className="w-4 h-4 flex-shrink-0" />
              <span className="ml-1.5">Resources</span>
              <ChevronDown className={`ml-1.5 w-4 h-4 transition-transform ${resourcesOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          {/* Company Dropdown */}
          <div className="relative" ref={companyRef}>
            <button 
              className={`flex items-center text-gray-700 hover:text-indigo-700 font-medium px-4 py-2 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200 whitespace-nowrap ${companyOpen ? 'text-indigo-700 bg-white shadow-sm' : ''}`}
              onClick={() => {
                setCompanyOpen(!companyOpen);
                setResourcesOpen(false);
              }}
            >
              <Info className="w-4 h-4 flex-shrink-0" />
              <span className="ml-1.5">Company</span>
              <ChevronDown className={`ml-1.5 w-4 h-4 transition-transform ${companyOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </nav>
      </div>
    </div>
  </div>
);

/**
 * Main site header component with responsive navigation
 */
const SiteHeader = () => {
  // State for mobile menu and dropdowns
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  
  // Refs for dropdown menus (for detecting clicks outside)
  const resourcesRef = useRef(null);
  const companyRef = useRef(null);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resourcesRef.current && !resourcesRef.current.contains(event.target)) {
        setResourcesOpen(false);
      }
      if (companyRef.current && !companyRef.current.contains(event.target)) {
        setCompanyOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Resources dropdown items - platform-focused content
  const resourcesItems = [
    { name: "How to List Your Business", href: "/guides/list-business", icon: <Briefcase size={16} /> },
    { name: "How to Find Investments", href: "/guides/find-investments", icon: <Search size={16} /> },
    { name: "How to Value Your Business", href: "/tools/valuation", icon: <BarChart3 size={16} /> },
    { name: "Platform Guide", href: "/platform-guide", icon: <HelpCircle size={16} /> },
    { name: "Success Stories", href: "/success-stories", icon: <Award size={16} /> },
    { name: "Market Insights", href: "/market-insights", icon: <LineChart size={16} /> }
  ];
  
  // Company dropdown items - original structure
  const companyItems = [
    { name: "About Us", href: "/about", icon: <Info size={16} /> },
    { name: "Our Team", href: "/team", icon: <Users size={16} /> },
    { name: "Testimonials", href: "/testimonials", icon: <MessageSquare size={16} /> },
    { name: "Contact Us", href: "/contact", icon: <Mail size={16} /> }
  ];
  
  // Main navigation items - using your existing categories plus Home
  const mainNavItems = [
    { name: "Home", href: "/", icon: <Home className="w-4 h-4" /> },
    { name: "Businesses", href: "#businesses", icon: <Building className="w-4 h-4" /> },
    { name: "Franchises", href: "#franchises", icon: <TrendingUp className="w-4 h-4" /> },
    { name: "Startups", href: "#startups", icon: <Lightbulb className="w-4 h-4" /> },
    { name: "Investors", href: "#investors", icon: <Users className="w-4 h-4" /> },
    { name: "Digital Assets", href: "#digitalassets", icon: <Globe className="w-4 h-4" /> }
  ];
  
  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      {/* Main header row */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-white via-white to-indigo-50">
        <div className="max-w-[2560px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center mr-2 sm:mr-4">
              <img src="src/logo.png" alt="Business Options Logo" className="h-8 sm:h-10 md:h-12" />
            </div>
            
            {/* Desktop Navigation - visible on 2xl screens */}
            <div className="hidden 2xl:flex items-center space-x-1 mx-4 flex-grow justify-center">
              <DesktopNavigation 
                mainNavItems={mainNavItems}
                resourcesOpen={resourcesOpen}
                setResourcesOpen={setResourcesOpen}
                companyOpen={companyOpen}
                setCompanyOpen={setCompanyOpen}
                resourcesRef={resourcesRef}
                companyRef={companyRef}
                resourcesItems={resourcesItems}
                companyItems={companyItems}
              />
            </div>
            
            {/* Auth Buttons */}
            <AuthButtons 
              showMobileMenu={mobileMenuOpen} 
              setShowMobileMenu={setMobileMenuOpen} 
            />
          </div>
        </div>
      </div>
      
      {/* Secondary Navigation Row - Only visible on xl screens */}
      <SecondaryNavigation 
        mainNavItems={mainNavItems}
        resourcesRef={resourcesRef}
        companyRef={companyRef}
        resourcesOpen={resourcesOpen}
        setResourcesOpen={setResourcesOpen}
        companyOpen={companyOpen}
        setCompanyOpen={setCompanyOpen}
      />
      
      {/* Mobile/Tablet Menu */}
      <MobileNavMenu 
        isOpen={mobileMenuOpen}
        mainNavItems={mainNavItems}
        resourcesItems={resourcesItems}
        companyItems={companyItems}
      />
    </header>
  );
};

export default SiteHeader;