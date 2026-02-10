import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function MobileNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  if (!user) return null;

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xl">M</span>
            </div>
            <span className="font-bold text-lg">MONETA-ICT</span>
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md hover:bg-blue-500"
          >
            {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="border-t border-blue-500">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* User Info */}
              <div className="px-3 py-3 bg-blue-500 rounded-md mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">{user?.name}</div>
                    <div className="text-sm text-blue-100">{user?.email}</div>
                  </div>
                </div>
              </div>

              <Link
                to="/dashboard"
                className={`block px-3 py-2 rounded-md ${
                  isActive('/dashboard') ? 'bg-blue-500' : 'hover:bg-blue-500'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>

              <Link
                to="/plans"
                className={`block px-3 py-2 rounded-md ${
                  isActive('/plans') ? 'bg-blue-500' : 'hover:bg-blue-500'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Investment Plans
              </Link>

              <Link
                to="/history"
                className={`block px-3 py-2 rounded-md ${
                  isActive('/history') ? 'bg-blue-500' : 'hover:bg-blue-500'
                }`}
                onClick={() => setIsOpen(false)}
              >
                History
              </Link>

              <Link
                to="/referrals"
                className={`block px-3 py-2 rounded-md ${
                  isActive('/referrals') ? 'bg-blue-500' : 'hover:bg-blue-500'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Referrals
              </Link>

              <Link
                to="/profile"
                className={`block px-3 py-2 rounded-md ${
                  isActive('/profile') ? 'bg-blue-500' : 'hover:bg-blue-500'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>

              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="block px-3 py-2 rounded-md bg-yellow-500 hover:bg-yellow-600 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Admin Panel
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-500 border-t border-blue-500 mt-2"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
