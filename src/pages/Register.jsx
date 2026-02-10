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
      newErrors.name = "Ingresa tu nombre completo";
    }

    if (!isValidEmail(formData.email)) {
      newErrors.email = "Correo inválido";
    }

    if (!isValidPhone(formData.phone, formData.country)) {
      newErrors.phone = "Número inválido";
    }

    if (formData.password.length < 8) {
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
      const payload = {
        ...formData,
        currency: formData.country === "CO" ? "COP" : "PEN",
      };

      const result = await register(payload);

      if (!result.success) {
        setErrors({ submit: result.error });
        return;
      }

      navigate("/dashboard", { replace: true });
    } catch (error) {
      setErrors({ submit: "Error al registrarse" });
    } finally {
      setLoading(false);
    }
  };

  const getWelcomeBonus = () =>
    formData.country === "CO"
      ? "COP 12,000"
      : "S/ 10 PEN";

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 py-12 px-4">
      <div className="max-w-xl mx-auto">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">
            MONETA-ICT
          </h1>
          <h2 className="text-2xl font-semibold">
            Crear Cuenta
          </h2>
        </div>

        {/* Dynamic Bonus */}
        <div className="bg-green-500 rounded-lg p-4 mb-6 text-white">
          <div className="flex items-center">
            <Gift className="w-5 h-5 mr-2" />
            <span>Bono de Bienvenida: {getWelcomeBonus()}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" />
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input pl-10"
                placeholder="Nombre Completo"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" />
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input pl-10"
                placeholder="Correo"
              />
            </div>

            {/* Country */}
            <div className="relative">
              <Globe className="absolute left-3 top-3 text-gray-400" />
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

            {/* Phone */}
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400" />
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input pl-10"
                placeholder={
                  formData.country === "CO"
                    ? "+57 3001234567"
                    : "+51 912345678"
                }
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className="input pl-10 pr-10"
                placeholder="Contraseña"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" />
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input pl-10 pr-10"
                placeholder="Confirmar Contraseña"
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-3 top-3"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Terms */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="mr-2"
              />
              Aceptar Términos
            </div>

            {errors.submit && (
              <div className="text-red-600 text-sm">
                {errors.submit}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary"
            >
              {loading ? <LoadingSpinner size="sm" /> : "Crear Cuenta"}
            </button>

          </form>

          <div className="text-center mt-4">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-primary-600">
              Inicia sesión
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
        }
