import React, { useMemo, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { createRouter } from './router';
import { useAuth } from './contexts/AuthContext';
import LoadingSpinner from './components/common/LoadingSpinner';
import AuthModal from './components/auth/AuthModal';
import { Toaster } from 'react-hot-toast';

function App() {
  const { isAuthenticated, loading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');
  
  // Function to open auth modal from anywhere in the app
  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  // Create router with current auth state
  const router = useMemo(() => 
    createRouter(isAuthenticated), 
    [isAuthenticated]
  );
  
  // Pass openAuthModal function to routes via router context
  const routerWithContext = useMemo(() => {
    if (!router) return null;
    
    // Enhance router context with auth modal functions
    const existingLoader = router.routes[0].loader;
    
    const enhancedLoader = (args) => {
      // If there's an existing loader, call it
      const existingLoaderData = existingLoader ? existingLoader(args) : {};
      
      // Add our context
      return {
        ...existingLoaderData,
        openAuthModal
      };
    };
    
    // Create a new router with the enhanced loader
    const enhancedRouter = {
      ...router,
      routes: router.routes.map(route => {
        if (route.path === '/') {
          return {
            ...route,
            loader: enhancedLoader
          };
        }
        return route;
      })
    };
    
    return enhancedRouter;
  }, [router]);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <>
      <RouterProvider 
      router={routerWithContext} 
      hydrateFallback={<LoadingSpinner />} // Add this line
    />
      
      {/* Global Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        activeTab={authModalTab}
        setActiveTab={setAuthModalTab}
      />
      
      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#333',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
}

export default App;