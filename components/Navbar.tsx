import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';
import { AppRoutes } from '../constants';
import ArrowLeftOnRectangleIcon from './icons/ArrowLeftOnRectangleIcon';
import CogIcon from './icons/CogIcon';
import BookOpenIcon from './icons/BookOpenIcon';
import UserIcon from './icons/UserIcon';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        const buttonEl = document.getElementById('user-menu-button');
        if (buttonEl && buttonEl.contains(event.target as Node)) {
            return;
        }
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false); 
  }

  const handleDropdownLinkClick = (route: AppRoutes) => {
    navigate(route);
    setIsProfileDropdownOpen(false);
  }

  return (
    <nav className="bg-slate-800 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link 
              to={user ? AppRoutes.Dashboard : AppRoutes.Home} 
              className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
              onClick={() => setIsProfileDropdownOpen(false)} 
            >
              <span className="text-5xl font-whispering font-bold">
                MEMOIR
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-4">
            {!user && (
              <Link 
                to={AppRoutes.Reading} 
                className="text-slate-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Explore Stories
              </Link>
            )}
            {user ? (
              <>
                <Button 
                  onClick={() => { navigate(AppRoutes.Dashboard); setIsProfileDropdownOpen(false); }}
                  variant="outline" 
                  size="sm"
                  className="text-white border-white hover:bg-slate-700 focus:ring-white hidden sm:flex"
                >
                  Dashboard
                </Button>
                
                <div className="relative">
                  <div>
                    <button
                      type="button"
                      className="max-w-xs bg-slate-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white"
                      id="user-menu-button"
                      aria-expanded={isProfileDropdownOpen}
                      aria-haspopup="true"
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    >
                      <span className="sr-only">Open user menu</span>
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-slate-600">
                        <span className="text-sm font-medium leading-none text-white">
                          {(user.name || user.email).substring(0, 1).toUpperCase()}
                        </span>
                      </span>
                      <span className="text-white ml-2 hidden md:inline text-sm">
                        {user.name || user.email.split('@')[0]}
                      </span>
                       <svg className={`ml-1 h-5 w-5 text-slate-400 transform transition-transform duration-150 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    </button>
                  </div>

                  {isProfileDropdownOpen && (
                    <div
                      ref={profileDropdownRef}
                      className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu-button"
                    >
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm text-gray-800 font-semibold">{user.name || "User"}</p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      </div>
                      <button onClick={() => handleDropdownLinkClick(AppRoutes.Profile)} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                        <UserIcon className="w-5 h-5 mr-3 text-gray-500" /> My Profile
                      </button>
                      <button onClick={() => handleDropdownLinkClick(AppRoutes.MyStories)} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                         <BookOpenIcon className="w-5 h-5 mr-3 text-gray-500" /> My Stories
                      </button>
                      <button onClick={() => handleDropdownLinkClick(AppRoutes.Settings)} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                        <CogIcon className="w-5 h-5 mr-3 text-gray-500" /> Settings
                      </button>
                      <div className="border-t border-gray-200 pt-1 mt-1">
                        <button
                            onClick={handleLogout}
                            className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                        >
                            <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3 text-gray-500" /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                 <Button 
                  onClick={() => navigate(AppRoutes.Home)} 
                  variant="outline" 
                  size="sm"
                  className="text-white border-white hover:bg-slate-700 focus:ring-white"
                >
                  Login / Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;