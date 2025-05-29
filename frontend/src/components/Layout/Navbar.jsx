import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {  Bell, User } from 'lucide-react';
import { logout } from '../../store/actions/authActions';

const Navbar = () => {
  const dispatch = useDispatch();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user } = useSelector(state => state.auth);
  
  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };
  
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-white border-b border-gray-200 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            
            <div className="hidden lg:block">
              <h1 className="text-xl font-semibold text-gray-800">
                Personal Finance Manager
              </h1>
            </div>
          </div>
          
          <div className="flex items-center">
            <button 
              type="button"
              className="p-1 rounded-full text-gray-500 hover:text-gray-600 focus:outline-none"
            >
              <Bell size={20} />
            </button>
            
            <div className="ml-3 relative">
              <div>
                <button 
                  type="button"
                  className="flex items-center max-w-xs rounded-full focus:outline-none"
                  onClick={toggleProfileMenu}
                >
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    <User size={18} />
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
                    {user?.name || 'User'}
                  </span>
                </button>
              </div>
              
              {showProfileMenu && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profile
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Settings
                  </a>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
