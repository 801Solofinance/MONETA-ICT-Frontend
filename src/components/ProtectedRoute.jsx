import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './shared/LoadingSpinner';

/**
 * Componente para proteger rutas que requieren autenticación
 */
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Log para debugging
  useEffect(() => {
    console.log('[ProtectedRoute] Current path:', location.pathname);
    console.log('[ProtectedRoute] Is loading:', isLoading);
    console.log('[ProtectedRoute] Is authenticated:', isAuthenticated);
    console.log('[ProtectedRoute] User:', user);
    console.log('[ProtectedRoute] Require admin:', requireAdmin);
  }, [location, isLoading, isAuthenticated, user, requireAdmin]);

  // Mostrar spinner mientras se verifica la autenticación
  if (isLoading) {
    console.log('[ProtectedRoute] Showing loading spinner');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando..." />
      </div>
    );
  }

  // Redirigir a login si no está autenticado
  if (!user || !isAuthenticated) {
    console.log('[ProtectedRoute] User not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar si requiere permisos de admin
  if (requireAdmin && user.role !== 'admin') {
    console.log('[ProtectedRoute] User is not admin, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('[ProtectedRoute] Access granted');
  return children;
};

export default ProtectedRoute;
