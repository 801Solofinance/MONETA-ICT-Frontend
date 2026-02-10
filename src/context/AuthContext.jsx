import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { initializeSampleData } from '../utils/sampleData';

const AuthContext = createContext(null);

/**
 * Provider de autenticación
 * NOTA: Sin backend real, solo maneja estado local
 * Cuando se integre el backend, aquí se harán las llamadas a la API
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage('moneta_user', null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Inicializar y verificar el estado del usuario
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedUser = localStorage.getItem('moneta_user');
        console.log('[AuthContext] Initializing - Stored user:', !!storedUser);
        
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          console.log('[AuthContext] User found:', userData.email);
          setUser(userData);
        }
      } catch (error) {
        console.error('[AuthContext] Error initializing:', error);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
        console.log('[AuthContext] Initialization complete');
      }
    };

    initAuth();
  }, []);

  // Log para debugging
  useEffect(() => {
    if (isInitialized) {
      console.log('[AuthContext] User state:', user);
      console.log('[AuthContext] Is authenticated:', !!user);
    }
  }, [user, isInitialized]);

  /**
   * Login (simulado - se reemplazará con API call)
   */
  const login = async (email, password) => {
    console.log('[AuthContext] Login attempt for:', email);
    setIsLoading(true);
    
    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Por ahora, buscar usuario en localStorage (simulación)
      const usersKey = 'moneta_users';
      const usersData = localStorage.getItem(usersKey);
      const users = usersData ? JSON.parse(usersData) : [];
      
      console.log('[AuthContext] Total users in system:', users.length);
      
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        console.log('[AuthContext] User not found or password incorrect');
        throw new Error('Credenciales incorrectas');
      }
      
      console.log('[AuthContext] User found:', foundUser.email);
      
      // Remover password antes de guardar en el estado
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Guardar usuario - esto triggeará el useEffect de useLocalStorage
      setUser(userWithoutPassword);
      
      // Verificación adicional
      await new Promise(resolve => setTimeout(resolve, 100));
      localStorage.setItem('moneta_user', JSON.stringify(userWithoutPassword));
      
      console.log('[AuthContext] Login successful');
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      console.error('[AuthContext] Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register (simulado - se reemplazará con API call)
   */
  const register = async (userData) => {
    console.log('[AuthContext] Register attempt for:', userData.email);
    setIsLoading(true);
    
    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generar código de referido único
      const referralCode = generateReferralCode();
      
      // Crear nuevo usuario
      const newUser = {
        id: `user_${Date.now()}`,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        country: userData.country,
        password: userData.password, // En producción, NUNCA guardar password plano
        referralCode,
        referredBy: userData.referredBy || null,
        balance: 0, // Balance inicial en 0
        role: 'user',
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      
      // Guardar en localStorage (simulación)
      const usersKey = 'moneta_users';
      const usersData = localStorage.getItem(usersKey);
      const users = usersData ? JSON.parse(usersData) : [];
      
      // Verificar si el email ya existe
      if (users.some(u => u.email === userData.email)) {
        console.log('[AuthContext] Email already exists');
        throw new Error('El correo electrónico ya está registrado');
      }
      
      users.push(newUser);
      localStorage.setItem(usersKey, JSON.stringify(users));
      
      console.log('[AuthContext] User registered successfully');
      console.log('[AuthContext] Total users now:', users.length);
      
      // Auto-login después del registro
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      
      // Verificación adicional
      await new Promise(resolve => setTimeout(resolve, 100));
      localStorage.setItem('moneta_user', JSON.stringify(userWithoutPassword));
      
      console.log('[AuthContext] Registration successful, user auto-logged in');
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      console.error('[AuthContext] Registration error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout
   */
  const logout = () => {
    console.log('[AuthContext] Logging out');
    setUser(null);
    localStorage.removeItem('moneta_user');
    // En producción, también invalidar el token en el servidor
  };

  /**
   * Actualizar datos del usuario
   */
  const updateUser = (updates) => {
    if (!user) {
      console.log('[AuthContext] Cannot update user - not logged in');
      return;
    }
    
    console.log('[AuthContext] Updating user:', updates);
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('moneta_user', JSON.stringify(updatedUser));
    
    // Actualizar también en la lista de usuarios
    const usersKey = 'moneta_users';
    const usersData = localStorage.getItem(usersKey);
    const users = usersData ? JSON.parse(usersData) : [];
    
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      localStorage.setItem(usersKey, JSON.stringify(users));
      console.log('[AuthContext] User updated in users list');
    }
  };

  const value = {
    user,
    isLoading: isLoading || !isInitialized,
    isAuthenticated: !!user && isInitialized,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook para usar el contexto de autenticación
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

/**
 * Genera un código de referido único (6 caracteres)
 */
const generateReferralCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};
