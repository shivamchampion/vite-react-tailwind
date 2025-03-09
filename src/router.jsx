import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { APP_ROUTES } from './utils/constants';
import LoadingSpinner from './components/common/LoadingSpinner';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages - Lazy loaded for better performance
const Homepage = React.lazy(() => import('./pages/home'));
const MarketplaceListingsPage = React.lazy(() => import('./pages/marketplace/MarketplaceListings'));
const ListingDetailPage = React.lazy(() => import('./pages/marketplace/ListingDetail'));
const DashboardPage = React.lazy(() => import('./pages/dashboard'));
const ProfilePage = React.lazy(() => import('./pages/dashboard/Profile'));
const ListingsPage = React.lazy(() => import('./pages/dashboard/Listings'));
const AddListingPage = React.lazy(() => import('./pages/dashboard/AddListing'));
const EditListingPage = React.lazy(() => import('./pages/dashboard/EditListing'));
const ConnectsPage = React.lazy(() => import('./pages/dashboard/Connects'));
const MessagesPage = React.lazy(() => import('./pages/dashboard/Messages'));
const SettingsPage = React.lazy(() => import('./pages/dashboard/Settings'));
const NotFoundPage = React.lazy(() => import('./pages/NotFound'));

// New dashboard pages
const SavedSearchesPage = React.lazy(() => import('./pages/dashboard/SavedSearches'));
const FavoritesPage = React.lazy(() => import('./pages/dashboard/Favorites'));
const RecentlyViewedPage = React.lazy(() => import('./pages/dashboard/RecentlyViewed'));
const AnalyticsPage = React.lazy(() => import('./pages/dashboard/Analytics'));

// Static Pages
const AboutPage = React.lazy(() => import('./pages/static/About'));
const ContactPage = React.lazy(() => import('./pages/static/Contact'));
const FAQPage = React.lazy(() => import('./pages/static/FAQ'));
const PrivacyPage = React.lazy(() => import('./pages/static/Privacy'));
const TermsPage = React.lazy(() => import('./pages/static/Terms'));
const HowItWorksPage = React.lazy(() => import('./pages/static/HowItWorks'));

// Protected route component
const ProtectedRoute = ({ element, isAuthenticated, redirectPath = APP_ROUTES.HOME }) => {
  return isAuthenticated ? element : <Navigate to={redirectPath} replace />;
};

// Router creator function (accepts auth state)
export const createRouter = (isAuthenticated) => {
  return createBrowserRouter([
    {
      path: '/',
      element: <MainLayout />,
      errorElement: <NotFoundPage />,
      loader: () => ({ openAuthModal: true }),
      children: [
        {
          index: true,
          element: <Homepage />
        },
        {
          path: APP_ROUTES.MARKETPLACE.BUSINESS,
          element: <MarketplaceListingsPage type="business" />
        },
        {
          path: APP_ROUTES.MARKETPLACE.FRANCHISE,
          element: <MarketplaceListingsPage type="franchise" />
        },
        {
          path: APP_ROUTES.MARKETPLACE.STARTUP,
          element: <MarketplaceListingsPage type="startup" />
        },
        {
          path: APP_ROUTES.MARKETPLACE.INVESTOR,
          element: <MarketplaceListingsPage type="investor" />
        },
        {
          path: APP_ROUTES.MARKETPLACE.DIGITAL_ASSET,
          element: <MarketplaceListingsPage type="digital_asset" />
        },
        {
          path: `${APP_ROUTES.MARKETPLACE.DETAIL}/:id`,
          element: <ListingDetailPage />
        },
        {
          path: APP_ROUTES.STATIC.ABOUT,
          element: <AboutPage />
        },
        {
          path: APP_ROUTES.STATIC.CONTACT,
          element: <ContactPage />
        },
        {
          path: APP_ROUTES.STATIC.PRIVACY,
          element: <PrivacyPage />
        },
        {
          path: APP_ROUTES.STATIC.TERMS,
          element: <TermsPage />
        },
        {
          path: APP_ROUTES.STATIC.FAQ,
          element: <FAQPage />
        },
        {
          path: APP_ROUTES.STATIC.HOW_IT_WORKS,
          element: <HowItWorksPage />
        }
      ]
    },
    {
      path: APP_ROUTES.DASHBOARD.ROOT,
      element: (
        <ProtectedRoute
          element={<DashboardLayout />}
          isAuthenticated={isAuthenticated}
          redirectPath={APP_ROUTES.HOME}
        />
      ),
      children: [
        {
          index: true,
          element: <DashboardPage />
        },
        {
          path: APP_ROUTES.DASHBOARD.PROFILE.split('/dashboard/')[1],
          element: <ProfilePage />
        },
        {
          path: APP_ROUTES.DASHBOARD.LISTINGS.split('/dashboard/')[1],
          element: <ListingsPage />
        },
        {
          path: APP_ROUTES.DASHBOARD.ADD_LISTING.split('/dashboard/')[1],
          element: <AddListingPage />
        },
        {
          path: `${APP_ROUTES.DASHBOARD.EDIT_LISTING.split('/dashboard/')[1]}/:id`,
          element: <EditListingPage />
        },
        {
          path: APP_ROUTES.DASHBOARD.CONNECTS.split('/dashboard/')[1],
          element: <ConnectsPage />
        },
        {
          path: APP_ROUTES.DASHBOARD.MESSAGES.split('/dashboard/')[1],
          element: <MessagesPage />
        },
        {
          path: APP_ROUTES.DASHBOARD.SETTINGS.split('/dashboard/')[1],
          element: <SettingsPage />
        },
        // New dashboard routes
        {
          path: APP_ROUTES.DASHBOARD.SAVED_SEARCHES.split('/dashboard/')[1],
          element: <SavedSearchesPage />
        },
        {
          path: APP_ROUTES.DASHBOARD.FAVORITES.split('/dashboard/')[1],
          element: <FavoritesPage />
        },
        {
          path: APP_ROUTES.DASHBOARD.RECENTLY_VIEWED.split('/dashboard/')[1],
          element: <RecentlyViewedPage />
        },
        {
          path: APP_ROUTES.DASHBOARD.ANALYTICS.split('/dashboard/')[1],
          element: <AnalyticsPage />
        }
      ]
    },
    {
      path: '*',
      element: <NotFoundPage />
    }
  ]);
};

export default createRouter;