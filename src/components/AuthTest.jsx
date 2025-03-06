import React from 'react';
import { Card, CardHeader, CardBody, Button } from "@heroui/react";
import { useAuth } from '../contexts/AuthContext';

// Simple component to test authentication
const AuthTest = ({ openAuthModal }) => {
  const { user, isLoading, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto my-8 p-4 text-center">
        <p>Loading authentication status...</p>
      </div>
    );
  }

  return (
    <Card className="max-w-md mx-auto my-8">
      <CardHeader className="bg-indigo-50 p-4 border-b">
        <h2 className="text-lg font-semibold text-indigo-800">Authentication Test</h2>
      </CardHeader>
      <CardBody className="p-4">
        {user ? (
          <div>
            <p className="mb-4"><span className="font-semibold">Status:</span> Authenticated</p>
            <div className="bg-green-50 p-4 rounded-md mb-4">
              <p className="text-green-800"><span className="font-semibold">User ID:</span> {user.id}</p>
              <p className="text-green-800"><span className="font-semibold">Name:</span> {user.displayName}</p>
              <p className="text-green-800"><span className="font-semibold">Email:</span> {user.email}</p>
              <p className="text-green-800"><span className="font-semibold">Account Type:</span> {user.accountType}</p>
            </div>
            <Button
              className="w-full bg-red-600 text-white hover:bg-red-700"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        ) : (
          <div>
            <p className="mb-4"><span className="font-semibold">Status:</span> Not Authenticated</p>
            <div className="bg-yellow-50 p-4 rounded-md mb-4">
              <p className="text-yellow-800">You are not logged in.</p>
            </div>
            <div className="flex gap-4">
              <Button
                className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700"
                onClick={() => openAuthModal('login')}
              >
                Login
              </Button>
              <Button
                className="flex-1 bg-green-600 text-white hover:bg-green-700"
                onClick={() => openAuthModal('register')}
              >
                Register
              </Button>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default AuthTest;