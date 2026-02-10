import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { generateReferralCode } from '../utils/validators'
import { LIMITS, USER_ROLES } from '../utils/constants'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initialize auth from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('moneta_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('moneta_user')
      }
    }
    setLoading(false)
  }, [])

  // Register new user
  const register = async (userData) => {
    try {
      // Get existing users
      const existingUsers = JSON.parse(localStorage.getItem('moneta_users') || '[]')

      // Check if email already exists
      if (existingUsers.some(u => u.email === userData.email)) {
        throw new Error('El correo electrónico ya está registrado')
      }

      // Generate unique user ID and referral code
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const referralCode = generateReferralCode()

      // Create new user
      const newUser = {
        id: userId,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        country: userData.country,
        referralCode: referralCode,
        referredBy: userData.referredBy || null,
        role: USER_ROLES.USER,
        status: 'active',
        createdAt: new Date().toISOString(),
        // Balance is 0 - welcome bonus is NOT auto-credited
        balance: 0,
      }

      // Save to users list
      existingUsers.push(newUser)
      localStorage.setItem('moneta_users', JSON.stringify(existingUsers))

      // Auto-login
      const userWithoutPassword = { ...newUser }
      setUser(userWithoutPassword)
      localStorage.setItem('moneta_user', JSON.stringify(userWithoutPassword))

      // Show welcome bonus message (but don't credit it)
      const welcomeBonus = LIMITS[userData.country].WELCOME_BONUS
      const currency = userData.country === 'CO' ? 'COP' : 'PEN'
      const symbol = userData.country === 'CO' ? '$' : 'S/'
      
      toast.success(`¡Bienvenido! Recibirás ${symbol}${welcomeBonus.toLocaleString()} ${currency} al aprobar tu primer depósito`, {
        duration: 5000,
      })

      return userWithoutPassword
    } catch (error) {
      toast.error(error.message || 'Error al registrar usuario')
      throw error
    }
  }

  // Login user
  const login = async (email, password) => {
    try {
      const existingUsers = JSON.parse(localStorage.getItem('moneta_users') || '[]')
      const foundUser = existingUsers.find(u => u.email === email)

      if (!foundUser) {
        throw new Error('Credenciales inválidas')
      }

      // In production, verify password hash
      // For demo, we'll accept any password for simplicity

      setUser(foundUser)
      localStorage.setItem('moneta_user', JSON.stringify(foundUser))

      toast.success(`¡Bienvenido, ${foundUser.name}!`)
      return foundUser
    } catch (error) {
      toast.error(error.message || 'Error al iniciar sesión')
      throw error
    }
  }

  // Logout user
  const logout = () => {
    setUser(null)
    localStorage.removeItem('moneta_user')
    toast.success('Sesión cerrada correctamente')
  }

  // Update user data
  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('moneta_user', JSON.stringify(updatedUser))

    // Also update in users list
    const existingUsers = JSON.parse(localStorage.getItem('moneta_users') || '[]')
    const userIndex = existingUsers.findIndex(u => u.id === user.id)
    if (userIndex !== -1) {
      existingUsers[userIndex] = updatedUser
      localStorage.setItem('moneta_users', JSON.stringify(existingUsers))
    }
  }

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === USER_ROLES.ADMIN,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
