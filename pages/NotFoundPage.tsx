import React from 'react';
import { Link } from 'react-router-dom';
import { AppRoutes } from '../constants';
import Button from '../components/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-4">
      <img src="https://picsum.photos/seed/404page/400/300" alt="Lost astronaut" className="w-64 h-auto mb-8 rounded-lg shadow-xl"/>
      <h1 className="text-6xl font-extrabold text-slate-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-600 mb-6">Oops! Page Not Found.</h2>
      <p className="text-gray-700 mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved. 
        Maybe you mistyped the URL?
      </p>
      <Button 
        variant="primary" 
        size="lg"
        className="shadow-lg"
      >
        <Link to={AppRoutes.Home}>Go Back Home</Link>
      </Button>
    </div>
  );
};

export default NotFoundPage;