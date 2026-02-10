import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/currency';

export default function Withdraw() {
  const { user, refreshUser } = useAuth();
  const { addNotification } = useApp();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    currency: user?.country === 'CO' ? 'COP' : 'PEN',
    bankName: '',
    accountNumber: '',
    accountType: 'Ahorros'
  });

  const colombianBanks = [
    'Bancolombia',
    'Banco de Bogotá',
    'Davivienda',
    'BBVA Colombia',
    'Banco Popular',
    'Banco Occidente',
    'Banco AV Villas',
    'Banco Caja Social',
    'Colpatria',
    'Banco Agrario',
    'Nequi',
    'Daviplata'
  ];

  const peruvianBanks = [
    'BCP - Banco de Crédito',
    'BBVA Perú',
    'Interbank',
    'Scotiabank Perú',
    'Banco Pichincha',
    'Banco de la Nación',
    'Banco Falabella',
    'Yape',
    'Plin'
  ];

  const banks = formData.currency === 'COP' ? colombianBanks : peruvianBanks;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const minAmount = formData.currency === 'COP' ? 50000 : 20;
    
    if (!formData.amount || formData.amount < minAmount) {
      addNotification(`Minimum withdrawal: ${formatCurrency(minAmount, formData.currency)}`, 'error');
      return;
    }

    if (formData.amount > user?.balance) {
      addNotification('Insufficient balance', 'error');
      return;
    }

    if (!formData.bankName || !formData.accountNumber) {
      addNotification('Please fill in all bank details', 'error');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/transactions/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: parseFloat(formData.amount),
          currency: formData.currency,
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          accountType: formData.accountType
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create withdrawal');
      }

      addNotification('Withdrawal request submitted successfully! Processing within 24-48 hours.', 'success');
      
      // Reset form
      setFormData({
        amount: '',
        currency: user?.country === 'CO' ? 'COP' : 'PEN',
        bankName: '',
        accountNumber: '',
        accountType: 'Ahorros'
      });
      
      // Refresh user data (balance already deducted)
      await refreshUser();

    } catch (error) {
      console.error('Withdrawal error:', error);
      addNotification(error.message || 'Failed to submit withdrawal', 'error');
    } finally {
      setLoading(false);
    }
  };

  const minAmount = formData.currency === 'COP' ? 50000 : 20;
  const maxAmount = user?.balance || 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Request Withdrawal</h1>
        <p className="text-gray-600">
          Withdraw funds from your MONETA-ICT account to your bank
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Withdrawal Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Withdrawal Information</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Currency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="COP">COP - Colombian Peso</option>
                <option value="PEN">PEN - Peruvian Sol</option>
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder={`Min: ${formatCurrency(minAmount, formData.currency)}`}
                min={minAmount}
                max={maxAmount}
                step={formData.currency === 'COP' ? 1000 : 1}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Available: {formatCurrency(maxAmount, formData.currency)}
              </p>
            </div>

            {/* Bank Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank
              </label>
              <select
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select your bank</option>
                {banks.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
            </div>

            {/* Account Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Type
              </label>
              <select
                value={formData.accountType}
                onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="Ahorros">Ahorros (Savings)</option>
                <option value="Corriente">Corriente (Checking)</option>
              </select>
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Number
              </label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value.replace(/\D/g, '') })}
                placeholder="Enter your account number"
                maxLength={20}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Numbers only, no spaces
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || maxAmount < minAmount}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : maxAmount < minAmount ? (
                'Insufficient Balance'
              ) : (
                'Request Withdrawal'
              )}
            </button>
          </form>
        </div>

        {/* Information */}
        <div className="space-y-6">
          {/* Balance Card */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
            <h3 className="text-sm font-medium mb-2 opacity-90">Available Balance</h3>
            <p className="text-3xl font-bold">
              {formatCurrency(user?.balance || 0, formData.currency)}
            </p>
            <p className="text-sm opacity-90 mt-2">
              Ready to withdraw
            </p>
          </div>

          {/* Processing Time */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Processing Time</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">Business Days</p>
                  <p className="text-sm text-gray-600">Monday - Friday, 9 AM - 6 PM</p>
                </div>
              </div>
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">Processing Time</p>
                  <p className="text-sm text-gray-600">24-48 hours after approval</p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-yellow-900">Important Notes</h3>
            <ul className="space-y-2 text-sm text-yellow-800">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Minimum withdrawal: {formatCurrency(minAmount, formData.currency)}</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Balance is deducted immediately upon request</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Admin reviews and processes within 24-48 hours</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Double-check your account details before submitting</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Contact support if funds not received within 72 hours</span>
              </li>
            </ul>
          </div>

          {/* Security */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2 text-blue-900">🔒 Secure Transactions</h3>
            <p className="text-sm text-blue-800">
              All withdrawals are encrypted and reviewed by our admin team to ensure your funds are transferred safely to the correct account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
