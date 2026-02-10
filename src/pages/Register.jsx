import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Mail,
  Phone,
  Globe,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Gift,
} from "lucide-react";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import {
  isValidEmail,
  isValidPhone,
  isValidFullName,
  formatPhoneNumber,
} from "../utils/validators";

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, user } = useAuth();
  const { deposit } = useBalance();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "CO",
    password: "",
    confirmPassword: "",
    referredBy: searchParams.get("ref") || "",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === "checkbox" ? checked : value;

    if (name === "phone") {
      newValue = formatPhoneNumber(value, formData.country);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!isValidFullName(formData.name)) {
      newErrors.name = "Ingresa tu nombre y apellido";
    }

    if (!isValidEmail(formData.email)) {
      newErrors.email = "Ingresa un correo válido";
    }

    if (!isValidPhone(formData.phone, formData.country)) {
      const example =
        formData.country === "CO"
          ? "+57 3001234567"
          : "+51 912345678";
      newErrors.phone = `Formato inválido. Ejemplo: ${example}`;
    }

    if (!formData.password || formData.password.length < 8) {
      newErrors.password = "Mínimo 8 caracteres";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Debes aceptar los términos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      // Prepare payload for backend
      const payload = {
        ...formData,
        currency: formData.country === "CO" ? "COP" : "PEN",
      };

      await register(payload);

      // 🎁 Welcome Bonus Credit
      const bonusAmount =
        formData.country === "CO" ? 12000 : 10;

      deposit(bonusAmount);

      navigate("/dashboard", { replace: true });
    } catch (error) {
      setErrors({ submit: error.message || "Error al registrarse" });
    } finally {
      setLoading(false);
    }
  };

  const getWelcomeBonus = () =>
    formData.country === "CO"
      ? "$12,000 COP"
      : "S/ 10 PEN";

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">
            MONETA-ICT
          </h1>
          <h2 className="text-2xl font-semibold text-gray-900">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Comienza tu camino hacia la inversión inteligente
          </p>
        </div>

        {/* Welcome Bonus */}
        <div className="bg-gradient-to-r from-success-500 to-success-600 rounded-lg p-4 mb-6 text-white">
          <div className="flex items-center">
            <Gift className="w-6 h-6 mr-3" />
            <div>
              <p className="font-semibold">¡Bono de Bienvenida!</p>
              <p className="text-sm">
                Recibe {getWelcomeBonus()} al registrarte
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`input pl-10 ${errors.name ? "border-red-500" : ""}`}
                  placeholder="Juan Pérez García"
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email & Country */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Correo *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`input pl-10 ${errors.email ? "border-red-500" : ""}`}
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  País *
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <select
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
              <label className="block text-sm font-medium mb-1">
                Teléfono *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`input pl-10 ${errors.phone ? "border-red-500" : ""}`}
                  placeholder={
                    formData.country === "CO"
                      ? "+57 3001234567"
                      : "+51 912345678"
                  }
                />
              </div>
            </div>

            {/* Passwords */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className="input pl-10 pr-10"
                  placeholder="Mínimo 8 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input pl-10 pr-10"
                  placeholder="Confirmar contraseña"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-3"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="mt-1"
              />
              <span className="ml-2 text-sm">
                Acepto los términos y condiciones
              </span>
            </div>

            {errors.submit && (
              <div className="text-red-600 text-sm">
                {errors.submit}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary flex justify-center"
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <UserPlus className="mr-2" size={18} />
                  Crear Cuenta
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-primary-600 font-medium">
              Inicia sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
