import React from 'react';
import { Link } from 'react-router-dom';
import { APP_ROUTES } from '../utils/constants';

/**
 * NotFound Component
 * 404 page displayed when a route isn't found
 */
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-extrabold text-blue-600">404</h1>
        <h2 className="mt-6 text-3xl font-bold text-gray-900">Page not found</h2>
        <p className="mt-2 text-lg text-gray-600">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <Link
            to={APP_ROUTES.HOME}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;