import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'
import { TRANSACTION_TYPES, TRANSACTION_STATUS } from '../utils/constants'

const AppContext = createContext(null)

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  const { user, updateUser } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [investments, setInvestments] = useState([])
  const [loading, setLoading] = useState(true)

  // Load user data when user changes
  useEffect(() => {
    if (user?.id) {
      loadUserData()
    } else {
      setTransactions([])
      setInvestments([])
      setLoading(false)
    }
  }, [user?.id])

  // Load user transactions and investments
  const loadUserData = () => {
    setLoading(true)
    
    try {
      // Load transactions
      const txKey = `moneta_transactions_${user.id}`
      const storedTx = localStorage.getItem(txKey)
      setTransactions(storedTx ? JSON.parse(storedTx) : [])

      // Load investments
      const invKey = `moneta_investments_${user.id}`
      const storedInv = localStorage.getItem(invKey)
      setInvestments(storedInv ? JSON.parse(storedInv) : [])
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Create deposit request
  const createDeposit = (depositData) => {
    const newTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      type: TRANSACTION_TYPES.DEPOSIT,
      amount: depositData.amount,
      status: TRANSACTION_STATUS.PENDING,
      proofFile: depositData.proofFile, // Base64 or file reference
      createdAt: new Date().toISOString(),
    }

    const updatedTransactions = [newTransaction, ...transactions]
    setTransactions(updatedTransactions)
    localStorage.setItem(`moneta_transactions_${user.id}`, JSON.stringify(updatedTransactions))

    toast.success('Depósito en revisión. Recibirás confirmación en 24-48h')
    return newTransaction
  }

  // Create withdrawal request
  const createWithdrawal = (withdrawalData) => {
    const newTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      type: TRANSACTION_TYPES.WITHDRAWAL,
      amount: withdrawalData.amount,
      status: TRANSACTION_STATUS.PENDING,
      bankName: withdrawalData.bank,
      accountNumber: withdrawalData.accountNumber,
      accountType: withdrawalData.accountType,
      createdAt: new Date().toISOString(),
    }

    const updatedTransactions = [newTransaction, ...transactions]
    setTransactions(updatedTransactions)
    localStorage.setItem(`moneta_transactions_${user.id}`, JSON.stringify(updatedTransactions))

    toast.success('Retiro en proceso. Aprobación en 24-48h')
    return newTransaction
  }

  // Create investment
  const createInvestment = (investmentData) => {
    const startDate = new Date()
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + investmentData.duration)

    const newInvestment = {
      id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      planId: investmentData.planId,
      planName: investmentData.planName,
      amount: investmentData.amount,
      dailyReturn: investmentData.dailyReturn,
      duration: investmentData.duration,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      status: TRANSACTION_STATUS.ACTIVE,
      createdAt: new Date().toISOString(),
    }

    const updatedInvestments = [newInvestment, ...investments]
    setInvestments(updatedInvestments)
    localStorage.setItem(`moneta_investments_${user.id}`, JSON.stringify(updatedInvestments))

    // Create transaction record
    const newTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      type: TRANSACTION_TYPES.INVESTMENT,
      amount: investmentData.amount,
      status: TRANSACTION_STATUS.ACTIVE,
      reference: newInvestment.id,
      createdAt: new Date().toISOString(),
    }

    const updatedTransactions = [newTransaction, ...transactions]
    setTransactions(updatedTransactions)
    localStorage.setItem(`moneta_transactions_${user.id}`, JSON.stringify(updatedTransactions))

    const currency = user.country === 'CO' ? 'COP' : 'PEN'
    const symbol = user.country === 'CO' ? '$' : 'S/'
    toast.success(`¡Inversión exitosa! Comenzarás a recibir ${symbol}${investmentData.dailyReturn.toLocaleString()} ${currency} diarios`)
    
    return newInvestment
  }

  // Get active investments count
  const getActiveInvestmentsCount = () => {
    return investments.filter(inv => inv.status === TRANSACTION_STATUS.ACTIVE).length
  }

  // Get total earnings (approved daily returns)
  const getTotalEarnings = () => {
    return transactions
      .filter(tx => tx.type === TRANSACTION_TYPES.DAILY_RETURN && tx.status === TRANSACTION_STATUS.APPROVED)
      .reduce((sum, tx) => sum + tx.amount, 0)
  }

  // Get recent transactions (last N)
  const getRecentTransactions = (count = 3) => {
    return transactions.slice(0, count)
  }

  const value = {
    transactions,
    investments,
    loading,
    createDeposit,
    createWithdrawal,
    createInvestment,
    getActiveInvestmentsCount,
    getTotalEarnings,
    getRecentTransactions,
    refreshData: loadUserData,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
