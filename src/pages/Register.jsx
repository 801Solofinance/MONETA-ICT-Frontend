import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  Globe,
  UserPlus,
  Gift
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { 
  isValidEmail, 
  isValidPhone, 
  isValidPassword,
  isValidFullName 
} from '../utils/validators';
import { 
  COUNTRIES, 
  COUNTRY_NAMES, 
  PHONE_PREFIXES,
  LIMITS 
} from '../utils/constants';
import { formatCurrency } from '../utils/currency';

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, isAuthenticated, isLoading: authLoading } = useAuth();

  // Obtener código de referido de la URL si existe
  const referralCodeFromUrl = searchParams.get('ref');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: 'CO', // Por defecto Colombia
    password: '',
    confirmPassword: '',
    referredBy: referralCodeFromUrl || '',
    acceptTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Actualizar prefijo de teléfono cuando cambia el país
  useEffect(() => {
    if (!formData.phone.startsWith('+')) {
      setFormData(prev => ({
        ...prev,
        phone: PHONE_PREFIXES[prev.country] + ' ',
      }));
    }
  }, [formData.country]);

  // Validación en tiempo real
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'name':
        if (!value) {
          error = 'El nombre completo es obligatorio';
        } else if (!isValidFullName(value)) {
          error = 'Ingresa tu nombre y apellido';
        }
        break;

      case 'email':
        if (!value) {
          error = 'El correo electrónico es obligatorio';
        } else if (!isValidEmail(value)) {
          error = 'Ingresa un correo electrónico válido';
        }
        break;

      case 'phone':
        if (!value) {
          error = 'El teléfono es obligatorio';
        } else if (!isValidPhone(value, formData.country)) {
          const example = formData.country === 'CO' 
            ? '+57 3001234567' 
            : '+51 912345678';
          error = `Formato inválido. Ejemplo: ${example}`;
        }
        break;

      case 'password':
        if (!value) {
          error = 'La contraseña es obligatoria';
        } else if (!isValidPassword(value)) {
          error = 'La contraseña debe tener al menos 8 caracteres';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          error = 'Confirma tu contraseña';
        } else if (value !== formData.password) {
          error = 'Las contraseñas no coinciden';
        }
        break;

      case 'acceptTerms':
        if (!value) {
          error = 'Debes aceptar los términos y condiciones';
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let fieldValue = type === 'checkbox' ? checked : value;

    // Formatear teléfono automáticamente
    if (name === 'phone') {
      const prefix = PHONE_PREFIXES[formData.country];
      if (!fieldValue.startsWith(prefix)) {
        fieldValue = prefix + ' ' + fieldValue.replace(/[^\d]/g, '');
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    // Limpiar error del campo
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }

    // Re-validar confirmPassword si se cambia password
    if (name === 'password' && formData.confirmPassword) {
      const confirmError = fieldValue !== formData.confirmPassword
        ? 'Las contraseñas no coinciden'
        : '';
      setErrors((prev) => ({
        ...prev,
        confirmPassword: confirmError,
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

    // Validar todos los campos
    Object.keys(formData).forEach((key) => {
      if (key !== 'referredBy') { // referredBy es opcional
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

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
      console.log('[Register] Attempting registration...');
      const result = await register(formData);

      if (result.success) {
        console.log('[Register] Registration successful, navigating to dashboard');
        const welcomeBonus = LIMITS[formData.country].WELCOME_BONUS;
        const bonusText = formatCurrency(welcomeBonus, formData.country);
        
        toast.success(`¡Cuenta creada exitosamente!`, {
          duration: 2000,
        });
        toast.success(
          `🎁 Bono de bienvenida: ${bonusText}`,
          { duration: 4000 }
        );
        
        // Esperar un momento para que los toasts se muestren
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Forzar navegación
        console.log('[Register] Navigating to dashboard');
        navigate('/dashboard', { replace: true });
        
        // Forzar recarga si es necesario
        window.location.href = '/dashboard';
      } else {
        console.log('[Register] Registration failed:', result.error);
        toast.error(result.error || 'Error al crear la cuenta');
      }
    } catch (error) {
      console.error('[Register] Unexpected error:', error);
      toast.error('Error al crear la cuenta. Inténtalo nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Logo y Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-white font-bold text-3xl">M</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Crear Cuenta en MONETA-ICT
          </h1>
          <p className="text-gray-600">
            Completa el formulario para empezar a invertir
          </p>
        </div>

        {/* Formulario */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre Completo */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input pl-10 ${
                    errors.name ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500' : ''
                  }`}
                  placeholder="Juan Pérez García"
                  disabled={isLoading}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-danger-600">{errors.name}</p>
              )}
            </div>

            {/* Email y País (Grid 2 columnas en desktop) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico *
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

              {/* País */}
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                  País *
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="input pl-10 appearance-none cursor-pointer"
                    disabled={isLoading}
                  >
                    <option value={COUNTRIES.COLOMBIA}>
                      {COUNTRY_NAMES.CO} 🇨🇴
                    </option>
                    <option value={COUNTRIES.PERU}>
                      {COUNTRY_NAMES.PE} 🇵🇪
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Teléfono */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input pl-10 ${
                    errors.phone ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500' : ''
                  }`}
                  placeholder={
                    formData.country === 'CO' 
                      ? '+57 3001234567' 
                      : '+51 912345678'
                  }
                  disabled={isLoading}
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-danger-600">{errors.phone}</p>
              )}
            </div>

            {/* Contraseña y Confirmar (Grid 2 columnas en desktop) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contraseña */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña *
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

              {/* Confirmar Contraseña */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Contraseña *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`input pl-10 pr-10 ${
                      errors.confirmPassword ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500' : ''
                    }`}
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-danger-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Código de Referido (Opcional) */}
            <div>
              <label htmlFor="referredBy" className="block text-sm font-medium text-gray-700 mb-2">
                Código de Referido (Opcional)
              </label>
              <div className="relative">
                <Gift className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="referredBy"
                  name="referredBy"
                  value={formData.referredBy}
                  onChange={handleChange}
                  className="input pl-10 uppercase"
                  placeholder="ABC123"
                  maxLength={6}
                  disabled={isLoading}
                />
              </div>
              {referralCodeFromUrl && (
                <p className="mt-1 text-sm text-success-600">
                  ✓ Código de referido aplicado
                </p>
              )}
            </div>

            {/* Términos y Condiciones */}
            <div>
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className={`w-4 h-4 mt-1 text-primary-600 border-gray-300 rounded focus:ring-primary-500 ${
                    errors.acceptTerms ? 'border-danger-500' : ''
                  }`}
                  disabled={isLoading}
                />
                <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-700">
                  Acepto los{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                    Términos y Condiciones
                  </a>{' '}
                  y la{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                    Política de Privacidad
                  </a>
                </label>
              </div>
              {errors.acceptTerms && (
                <p className="mt-1 text-sm text-danger-600">{errors.acceptTerms}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !formData.acceptTerms}
              className="btn btn-primary w-full text-base py-3"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" className="mx-auto" />
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Crear Cuenta
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
                ¿Ya tienes una cuenta?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <Link
            to="/login"
            className="btn btn-secondary w-full text-base py-3"
          >
            Iniciar Sesión
          </Link>
        </div>

        {/* Beneficios */}
        <div className="mt-6 card bg-gradient-to-r from-primary-50 to-success-50">
          <div className="flex items-start space-x-3">
            <Gift className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Bono de Bienvenida
              </h3>
              <p className="text-sm text-gray-600">
                Al registrarte recibirás un bono de{' '}
                <span className="font-bold text-primary-700">
                  {formatCurrency(LIMITS[formData.country].WELCOME_BONUS, formData.country)}
                </span>{' '}
                después de tu primer depósito aprobado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
