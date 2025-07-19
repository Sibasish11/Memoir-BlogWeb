
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AppRoutes } from '../constants';

const ProtectedRoute: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // Optional: Add a loading spinner/page here
    return <div className="flex justify-center items-center h-screen"><p className="text-xl">Loading...</p></div>;
  }

  if (!user) {
    return <Navigate to={AppRoutes.Home} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
