import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Wallet,
  Settings,
  DollarSign,
  Menu,
  X
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Transactions', path: '/transactions', icon: <Receipt size={20} /> },
    { name: 'Reports', path: '/reports', icon: <PieChart size={20} /> },
    { name: 'Budget', path: '/budget', icon: <Wallet size={20} /> },
  ];

  return (
    <>
      {/* Menu button fixed top right on small screens */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-800 focus:outline-none bg-transparent"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-gray-800 transform
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          transition-transform duration-200 ease-in-out
          md:translate-x-0 md:static md:flex md:flex-shrink-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Close button inside sidebar only on mobile */}
          <div className="flex items-center justify-end px-4 py-5 md:hidden">
            <button onClick={() => setIsOpen(false)} className="text-gray-300">
              <X size={24} />
            </button>
          </div>

          {/* Sidebar logo */}
          <div className="flex items-center px-4 py-4">
            <DollarSign className="h-8 w-8 text-green-500" />
            <span className="ml-2 text-white font-semibold text-lg">FinanceApp</span>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto">
            <nav className="mt-4 space-y-1 px-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)} // close sidebar on nav click (mobile)
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md
                    ${isActive(item.path)
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
                  `}
                >
                  <div className={`
                    mr-3 flex-shrink-0
                    ${isActive(item.path) ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}
                  `}>
                    {item.icon}
                  </div>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Settings link */}
          <div className="border-t border-gray-700 p-4">
            <Link to="/settings" onClick={() => setIsOpen(false)} className="group block">
              <div className="flex items-center">
                <Settings size={20} className="text-gray-400 group-hover:text-gray-300 mr-3" />
                <p className="text-sm font-medium text-gray-300 group-hover:text-white">
                  Settings
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
