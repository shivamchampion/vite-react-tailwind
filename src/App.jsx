import React, {useMemo} from 'react';
import { RouterProvider } from 'react-router-dom';
import { createRouter } from './router';
import { useAuth } from './contexts/AuthContext';
import LoadingSpinner from './components/common/LoadingSpinner';

function App() {
  const { isAuthenticated, loading } = useAuth();
  
  const router = useMemo(() => createRouter(isAuthenticated), [isAuthenticated]);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return <RouterProvider router={router} />;
}

export default App;