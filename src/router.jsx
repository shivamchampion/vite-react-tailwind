import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { APP_ROUTES } from './utils/constants';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages - Lazy loaded for better performance
const Homepage = React.lazy(() => import('./pages/home'));
const BusinessListingsPage = React.lazy(() => import('./pages/marketplace/BusinessListings'));
const EntityDetailPage = React.lazy(() => import('./pages/marketplace/EntityDetail'));
const DashboardPage = React.lazy(() => import('./pages/dashboard'));
const ProfilePage = React.lazy(() => import('./pages/dashboard/Profile'));
const EntitiesPage = React.lazy(() => import('./pages/dashboard/Entities'));
const AddEntityPage = React.lazy(() => import('./pages/dashboard/AddEntity'));
const EditEntityPage = React.lazy(() => import('./pages/dashboard/EditEntity'));
const ConnectsPage = React.lazy(() => import('./pages/dashboard/Connects'));
const MessagesPage = React.lazy(() => import('./pages/dashboard/Messages'));
const SettingsPage = React.lazy(() => import('./pages/dashboard/Settings'));
const NotFoundPage = React.lazy(() => import('./pages/NotFound'));

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
      children: [
        {
          index: true,
          element: <Homepage />
        },
        {
          path: APP_ROUTES.MARKETPLACE.BUSINESS,
          element: <BusinessListingsPage type="business" />
        },
        {
          path: APP_ROUTES.MARKETPLACE.FRANCHISE,
          element: <BusinessListingsPage type="franchise" />
        },
        {
          path: APP_ROUTES.MARKETPLACE.STARTUP,
          element: <BusinessListingsPage type="startup" />
        },
        {
          path: APP_ROUTES.MARKETPLACE.INVESTOR,
          element: <BusinessListingsPage type="investor" />
        },
        {
          path: APP_ROUTES.MARKETPLACE.DIGITAL_ASSET,
          element: <BusinessListingsPage type="digital_asset" />
        },
        {
          path: `${APP_ROUTES.MARKETPLACE.DETAIL}/:id`,
          element: <EntityDetailPage />
        },
        {
          path: APP_ROUTES.STATIC.ABOUT,
          element: <div>About Page</div>
        },
        {
          path: APP_ROUTES.STATIC.CONTACT,
          element: <div>Contact Page</div>
        },
        {
          path: APP_ROUTES.STATIC.PRIVACY,
          element: <div>Privacy Policy</div>
        },
        {
          path: APP_ROUTES.STATIC.TERMS,
          element: <div>Terms of Service</div>
        },
        {
          path: APP_ROUTES.STATIC.FAQ,
          element: <div>FAQ Page</div>
        },
        {
          path: APP_ROUTES.STATIC.HOW_IT_WORKS,
          element: <div>How It Works</div>
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
          path: APP_ROUTES.DASHBOARD.ENTITIES.split('/dashboard/')[1],
          element: <EntitiesPage />
        },
        {
          path: APP_ROUTES.DASHBOARD.ADD_ENTITY.split('/dashboard/')[1],
          element: <AddEntityPage />
        },
        {
          path: `${APP_ROUTES.DASHBOARD.EDIT_ENTITY.split('/dashboard/')[1]}/:id`,
          element: <EditEntityPage />
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