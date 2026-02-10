import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const AppContext = createContext(null);

/**
 * Provider global de la aplicación
 * Maneja transacciones, inversiones y datos globales
 */
export const AppProvider = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar datos cuando el usuario inicia sesión
  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      // Limpiar datos al cerrar sesión
      setTransactions([]);
      setInvestments([]);
    }
  }, [user]);

  /**
   * Cargar datos del usuario desde localStorage
   */
  const loadUserData = () => {
    try {
      // Cargar transacciones
      const transKey = `moneta_transactions_${user.id}`;
      const transData = localStorage.getItem(transKey);
      if (transData) {
        setTransactions(JSON.parse(transData));
      }

      // Cargar inversiones
      const invKey = `moneta_investments_${user.id}`;
      const invData = localStorage.getItem(invKey);
      if (invData) {
        setInvestments(JSON.parse(invData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  /**
   * Agregar una transacción
   */
  const addTransaction = (transaction) => {
    if (!user) return;

    const newTransaction = {
      id: Date.now().toString(),
      userId: user.id,
      createdAt: new Date().toISOString(),
      ...transaction,
    };

    const updated = [newTransaction, ...transactions];
    setTransactions(updated);

    // Guardar en localStorage
    const transKey = `moneta_transactions_${user.id}`;
    localStorage.setItem(transKey, JSON.stringify(updated));

    return newTransaction;
  };

  /**
   * Actualizar una transacción
   */
  const updateTransaction = (id, updates) => {
    const updated = transactions.map(t => 
      t.id === id ? { ...t, ...updates } : t
    );
    setTransactions(updated);

    // Guardar en localStorage
    const transKey = `moneta_transactions_${user.id}`;
    localStorage.setItem(transKey, JSON.stringify(updated));
  };

  /**
   * Agregar una inversión
   */
  const addInvestment = (investment) => {
    if (!user) return;

    const newInvestment = {
      id: Date.now().toString(),
      userId: user.id,
      createdAt: new Date().toISOString(),
      ...investment,
    };

    const updated = [newInvestment, ...investments];
    setInvestments(updated);

    // Guardar en localStorage
    const invKey = `moneta_investments_${user.id}`;
    localStorage.setItem(invKey, JSON.stringify(updated));

    return newInvestment;
  };

  /**
   * Actualizar una inversión
   */
  const updateInvestment = (id, updates) => {
    const updated = investments.map(inv => 
      inv.id === id ? { ...inv, ...updates } : inv
    );
    setInvestments(updated);

    // Guardar en localStorage
    const invKey = `moneta_investments_${user.id}`;
    localStorage.setItem(invKey, JSON.stringify(updated));
  };

  /**
   * Obtener balance del usuario
   */
  const getBalance = () => {
    return user?.balance || 0;
  };

  /**
   * Obtener inversiones activas
   */
  const getActiveInvestments = () => {
    return investments.filter(inv => inv.status === 'active');
  };

  /**
   * Obtener ganancias totales
   */
  const getTotalEarnings = () => {
    // Sumar todas las transacciones de tipo 'daily_return'
    return transactions
      .filter(t => t.type === 'daily_return' && t.status === 'approved')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  /**
   * Obtener transacciones recientes (últimas 3)
   */
  const getRecentTransactions = () => {
    return transactions.slice(0, 3);
  };

  const value = {
    transactions,
    investments,
    isLoading,
    addTransaction,
    updateTransaction,
    addInvestment,
    updateInvestment,
    getBalance,
    getActiveInvestments,
    getTotalEarnings,
    getRecentTransactions,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

/**
 * Hook para usar el contexto de la aplicación
 */
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe usarse dentro de un AppProvider');
  }
  return context;
};
