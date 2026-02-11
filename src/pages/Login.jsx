import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { isValidEmail } from '../utils/validators';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, location]);

  // Validación en tiempo real
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'email':
        if (!value) {
          error = 'El correo electrónico es obligatorio';
        } else if (!isValidEmail(value)) {
          error = 'Ingresa un correo electrónico válido';
        }
        break;
      case 'password':
        if (!value) {
          error = 'La contraseña es obligatoria';
        } else if (value.length < 6) {
          error = 'La contraseña debe tener al menos 6 caracteres';
        }
        break;
      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    // Limpiar error del campo cuando el usuario escribe
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);

    if (error) {
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar email
    const emailError = validateField('email', formData.email);
    if (emailError) newErrors.email = emailError;

    // Validar password
    const passwordError = validateField('password', formData.password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar formulario
    if (!validateForm()) {
      toast.error('Por favor corrige los errores en el formulario');
      return;
    }

    setIsLoading(true);

    try {
      console.log('[Login] Attempting login...');
      const result = await login(formData.email, formData.password);

      if (result.success) {
        console.log('[Login] Login successful, navigating to dashboard');
        toast.success(`¡Bienvenido, ${result.user.name}!`, {
          duration: 2000,
        });
        
        // Esperar un momento para que el toast se muestre
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Forzar navegación
        const from = location.state?.from?.pathname || '/dashboard';
        console.log('[Login] Navigating to:', from);
        navigate(from, { replace: true });
        
        // Forzar recarga si es necesario
        window.location.href = from;
      } else {
        console.log('[Login] Login failed:', result.error);
        toast.error(result.error || 'Error al iniciar sesión');
        setErrors({
          password: 'Credenciales incorrectas',
        });
      }
    } catch (error) {
      console.error('[Login] Unexpected error:', error);
      toast.error('Error al iniciar sesión. Inténtalo nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo y Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-white font-bold text-3xl">M</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenido a MONETA-ICT
          </h1>
          <p className="text-gray-600">
            Inicia sesión para acceder a tu cuenta
          </p>
        </div>

        {/* Formulario */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input pl-10 ${
                    errors.email ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500' : ''
                  }`}
                  placeholder="tu@correo.com"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-danger-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input pl-10 pr-10 ${
                    errors.password ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500' : ''
                  }`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-danger-600">{errors.password}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  disabled={isLoading}
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                  Recordarme
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full text-base py-3"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" className="mx-auto" />
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                ¿No tienes una cuenta?
              </span>
            </div>
          </div>

          {/* Register Link */}
          <Link
            to="/register"
            className="btn btn-secondary w-full text-base py-3"
          >
            Crear Cuenta Nueva
          </Link>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-600">
          Al iniciar sesión, aceptas nuestros{' '}
          <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
            Términos y Condiciones
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
