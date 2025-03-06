import React from 'react';
import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom';
import { APP_ROUTES } from './utils/constants';
import { useAuth } from './contexts/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages (Lazy loaded)
const Homepage = React.lazy(() => import('./pages/home'));
const DashboardPage = React.lazy(() => import('./pages/dashboard'));
const NotFoundPage = React.lazy(() => import('./pages/NotFound'));
const BusinessListingsPage = React.lazy(() => import('./pages/marketplace/BusinessListings'));
const ProfilePage = React.lazy(() => import('./pages/dashboard/Profile'));
const EntitiesPage = React.lazy(() => import('./pages/dashboard/Entities'));

// Enhanced Protected Route Component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { currentUser, userProfile, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  // Not authenticated - redirect to home
  if (!currentUser) {
    return <Navigate 
      to={APP_ROUTES.HOME} 
      replace 
      state={{ 
        from: location, 
        authRequired: true 
      }} 
    />;
  }

  // Check role if required
  if (requiredRole && userProfile?.role !== requiredRole) {
    return <Navigate to={APP_ROUTES.HOME} replace />;
  }

  return children;
};

// Create Router with Enhanced Authentication
export const createRouter = () => {
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
        // Public marketplace routes
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
        }
      ]
    },
    {
      path: APP_ROUTES.DASHBOARD.ROOT,
      element: (
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
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