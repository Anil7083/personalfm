import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  Wallet, 
  Settings, 
  DollarSign
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Transactions', path: '/transactions', icon: <Receipt size={20} /> },
    { name: 'Reports', path: '/reports', icon: <PieChart size={20} /> },
    { name: 'Budget', path: '/budget', icon: <Wallet size={20} /> }
  ];

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-gray-800">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <DollarSign className="h-8 w-8 text-green-500" />
              <span className="ml-2 text-white font-semibold text-lg">FinanceApp</span>
            </div>
            
            <nav className="mt-8 flex-1 px-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
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
          
          <div className="flex-shrink-0 flex border-t border-gray-700 p-4">
            <Link
              to="/settings"
              className="flex-shrink-0 group block"
            >
              <div className="flex items-center">
                <div className="mr-3">
                  <Settings size={20} className="text-gray-400 group-hover:text-gray-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-300 group-hover:text-white">
                    Settings
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;