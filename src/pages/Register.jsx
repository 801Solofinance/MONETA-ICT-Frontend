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
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === "checkbox" ? checked : value;

    if (name === "phone") {
      newValue = formatPhoneNumber(value, formData.country);
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const validate = () => {
    const newErrors = {};

    if (!isValidFullName(formData.name))
      newErrors.name = "Full name required";

    if (!isValidEmail(formData.email))
      newErrors.email = "Valid email required";

    if (!isValidPhone(formData.phone, formData.country))
      newErrors.phone = "Valid phone required";

    if (formData.password.length < 8)
      newErrors.password = "Minimum 8 characters";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!formData.acceptTerms)
      newErrors.acceptTerms = "You must accept terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getWelcomeBonus = () =>
    formData.country === "CO"
      ? "COP 12,000"
      : "S/ 10";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const payload = {
        ...formData,
        currency: formData.country === "CO" ? "COP" : "PEN",
      };

      await register(payload);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg">

        <h1 className="text-3xl font-bold text-center text-primary-600 mb-2">
          MONETA-ICT
        </h1>

        <div className="bg-green-500 text-white p-4 rounded-lg mb-6 flex items-center">
          <Gift className="mr-3" />
          <span>Welcome Bonus: {getWelcomeBonus()}</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            name="name"
            placeholder="Full Name"
            className="input"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            name="email"
            placeholder="Email"
            className="input"
            value={formData.email}
            onChange={handleChange}
          />

          <select
            name="country"
            className="input"
            value={formData.country}
            onChange={handleChange}
          >
            <option value="CO">🇨🇴 Colombia</option>
            <option value="PE">🇵🇪 Peru</option>
          </select>

          <input
            name="phone"
            placeholder="Phone Number"
            className="input"
            value={formData.phone}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input"
            value={formData.password}
            onChange={handleChange}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="input"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="mr-2"
            />
            Accept Terms & Conditions
          </label>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? <LoadingSpinner size="sm" /> : "Create Account"}
          </button>
        </form>

        <div className="text-center mt-4 text-sm">
          Already have account?{" "}
          <Link to="/login" className="text-primary-600">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
        }
