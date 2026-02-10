import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { User, Mail, Phone, Globe, Lock, Eye, EyeOff, UserPlus, Gift } from 'lucide-react'
import LoadingSpinner from '../components/shared/LoadingSpinner'
import { isValidEmail, isValidPhone, isValidFullName, formatPhoneNumber } from '../utils/validators'

export default function Register() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { register, user } = useAuth()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: 'CO',
    password: '',
    confirmPassword: '',
    referredBy: searchParams.get('ref') || '',
    acceptTerms: false
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    let newValue = type === 'checkbox' ? checked : value

    // Auto-format phone number
    if (name === 'phone') {
      newValue = formatPhoneNumber(value, formData.country)
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }))

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!isValidFullName(formData.name)) {
      newErrors.name = 'Ingresa tu nombre y apellido'
    }

    if (!isValidEmail(formData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido'
    }

    if (!isValidPhone(formData.phone, formData.country)) {
      const example = formData.country === 'CO' ? '+57 3001234567' : '+51 912345678'
      newErrors.phone = `Formato inválido. Ejemplo: ${example}`
    }

    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Debes aceptar los términos y condiciones'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) return

    setLoading(true)
    try {
      await register(formData)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setErrors({ submit: error.message })
    } finally {
      setLoading(false)
    }
  }

  const getWelcomeBonus = () => {
    return formData.country === 'CO' ? '$12.000 COP' : 'S/10 PEN'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">MONETA-ICT</h1>
          <h2 className="text-2xl font-semibold text-gray-900">Crear Cuenta</h2>
          <p className="mt-2 text-sm text-gray-600">
            Comienza tu camino hacia la inversión inteligente
          </p>
        </div>

        {/* Welcome Bonus Banner */}
        <div className="bg-gradient-to-r from-success-500 to-success-600 rounded-lg p-4 mb-6 text-white">
          <div className="flex items-center">
            <Gift className="w-6 h-6 mr-3" />
            <div>
              <p className="font-semibold">¡Bono de Bienvenida!</p>
              <p className="text-sm">Recibe {getWelcomeBonus()} al registrarte</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`input pl-10 ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="Juan Pérez García"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`input pl-10 ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="tu@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Country */}
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  País *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="input pl-10"
                  >
                    <option value="CO">🇨🇴 Colombia</option>
                    <option value="PE">🇵🇪 Perú</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`input pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                  placeholder={formData.country === 'CO' ? '+57 3001234567' : '+51 912345678'}
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className={`input pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="Mínimo 8 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Contraseña *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`input pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    placeholder="Repite la contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Referral Code */}
            {formData.referredBy && (
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <p className="text-sm text-primary-800">
                  <Gift className="w-4 h-4 inline mr-1" />
                  Código de referido aplicado: <strong>{formData.referredBy}</strong>
                </p>
              </div>
            )}

            {/* Terms */}
            <div className="flex items-start">
              <input
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
              />
              <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-700">
                Acepto los{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500">
                  Términos y Condiciones
                </a>{' '}
                y la{' '}
                <a href="#" className="text-primary-600 hover:text-primary-500">
                  Política de Privacidad
                </a>
              </label>
            </div>
            {errors.acceptTerms && (
              <p className="text-sm text-red-600">{errors.acceptTerms}</p>
            )}

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary flex items-center justify-center"
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Crear Cuenta
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
