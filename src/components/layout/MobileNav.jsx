import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  History,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';

const MobileNav = () => {
  const { user } = useAuth();
  const location = useLocation();

  const navLinks = [
    { 
      path: '/dashboard', 
      label: 'Inicio', 
      icon: LayoutDashboard 
    },
    { 
      path: '/plans', 
      label: 'Planes', 
      icon: TrendingUp 
    },
    { 
      path: '/deposit', 
      label: 'Depositar', 
      icon: ArrowDownToLine 
    },
    { 
      path: '/withdraw', 
      label: 'Retirar', 
      icon: ArrowUpFromLine 
    },
    { 
      path: '/history', 
      label: 'Historial', 
      icon: History 
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
      <div className="grid grid-cols-5 h-16">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          
          return (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'flex flex-col items-center justify-center space-y-1 transition-colors',
                isActive
                  ? 'text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <Icon className={cn('w-5 h-5', isActive && 'scale-110')} />
              <span className="text-xs font-medium">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNav;
