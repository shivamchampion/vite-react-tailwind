import React from 'react';
import { Button } from "@heroui/react";
import { User, Briefcase, ChevronDown, Menu, X } from 'lucide-react';
import { APP_ROUTES } from '../../utils/constants';
import { UserDropdownMenu } from './UserDropdownMenu';

/**
 * Header Authentication Buttons Component
 * Renders login/register buttons or user dropdown based on auth state
 */
export const HeaderAuthButtons = ({
  isAuthenticated,
  userProfile,
  mobileMenuOpen,
  setMobileMenuOpen,
  openAuthModal,
  handleLogoutClick,
  userDropdownOpen,
  toggleUserDropdown,
  userDropdownRef
}) => {
  return (
    <div className="flex items-center gap-1 sm:gap-3 ml-auto">
      {/* Become an Advisor - visible on medium and large screens */}
      <Button
        className="hidden md:flex bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-sm hover:shadow-md items-center text-xs lg:text-sm whitespace-nowrap"
        variant="flat"
        onPress={() => window.location.href = APP_ROUTES.BECOME_ADVISOR}
        aria-label="Become an Advisor"
      >
        <Briefcase className="w-3.5 h-3.5 lg:w-4 lg:h-4 mr-1 lg:mr-1.5" />
        <span>Become an Advisor</span>
      </Button>

      <div className="hidden md:block h-8 w-[1px] bg-gray-200 mx-1"></div>

      {isAuthenticated ? (
        <div className="relative" ref={userDropdownRef}>
          <button
            className={`flex items-center text-gray-700 hover:text-indigo-700 font-medium px-3 py-2 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200 ${
              userDropdownOpen ? 'text-indigo-700 bg-white shadow-sm' : ''
            }`}
            onClick={(e) => {
              e.preventDefault();
              toggleUserDropdown();
            }}
            aria-expanded={userDropdownOpen}
            id="user-menu-button"
            aria-haspopup="menu"
            aria-controls="user-dropdown-menu"
          >
            <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white mr-2">
              {userProfile?.displayName?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className="hidden md:block">{userProfile?.displayName || 'User'}</span>
            <ChevronDown className={`ml-1.5 w-4 h-4 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* User Dropdown Menu */}
          {userDropdownOpen && (
            <UserDropdownMenu
              userProfile={userProfile}
              handleLogoutClick={handleLogoutClick}
            />
          )}
        </div>
      ) : (
        <>
          {/* Login Button */}
          <Button
            className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-all duration-200 items-center text-xs sm:text-sm flex whitespace-nowrap px-2 sm:px-3"
            variant="flat"
            onPress={() => openAuthModal('login')}
            aria-label="Login"
          >
            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
            <span>Login</span>
          </Button>

          {/* Register Button */}
          <Button
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-sm hover:shadow-md text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3"
            onPress={() => openAuthModal('register')}
            aria-label="Register"
          >
            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 md:hidden" />
            <span>Register</span>
          </Button>
        </>
      )}

      {/* Mobile/Tablet Menu Button - visible on 2xl screens and below */}
      <button
        type="button"
        className="2xl:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 focus:outline-none ml-1"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-expanded={mobileMenuOpen}
        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
      >
        <span className="sr-only">Open main menu</span>
        {mobileMenuOpen ? (
          <X className="block h-6 w-6" aria-hidden="true" />
        ) : (
          <Menu className="block h-6 w-6" aria-hidden="true" />
        )}
      </button>
    </div>
  );
};