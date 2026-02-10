import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/currency';

export default function Deposit() {
  const { user, refreshUser } = useAuth();
  const { addNotification } = useApp();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    currency: user?.country === 'CO' ? 'COP' : 'PEN',
    proofFile: null
  });
  const [previewUrl, setPreviewUrl] = useState(null);

  // Bank details based on currency
  const bankDetails = formData.currency === 'COP' ? {
    account: '00100007120',
    bank: 'Bancolombia',
    type: 'Ahorros',
    name: 'Jimenez Jose'
  } : {
    account: '935460768',
    bank: 'PLIN',
    type: '',
    name: 'ELISIA RIOS'
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        addNotification('File size must be less than 5MB', 'error');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        addNotification('Please upload an image file', 'error');
        return;
      }

      setFormData({ ...formData, proofFile: file });
      
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.amount || formData.amount <= 0) {
      addNotification('Please enter a valid amount', 'error');
      return;
    }

    if (!formData.proofFile) {
      addNotification('Please upload proof of payment', 'error');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        addNotification('Please login first', 'error');
        return;
      }
      
      const uploadData = new FormData();
      uploadData.append('amount', formData.amount);
      uploadData.append('currency', formData.currency);
      uploadData.append('proof', formData.proofFile);

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/api/transactions/deposit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadData
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create deposit');
      }

      addNotification('✅ Deposit request submitted! Awaiting admin approval.', 'success');
      
      setFormData({
        amount: '',
        currency: user?.country === 'CO' ? 'COP' : 'PEN',
        proofFile: null
      });
      setPreviewUrl(null);
      
      await refreshUser();

    } catch (error) {
      console.error('Deposit error:', error);
      addNotification(error.message || 'Failed to submit deposit', 'error');
    } finally {
      setLoading(false);
    }
  };

  const minAmount = formData.currency === 'COP' ? 50000 : 20;
  const maxAmount = formData.currency === 'COP' ? 10000000 : 3000;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Make a Deposit</h1>
        <p className="text-gray-600">Add funds to start investing</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Deposit Information</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="COP">COP - Colombian Peso</option>
                <option value="PEN">PEN - Peruvian Sol</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder={`Min: ${formatCurrency(minAmount, formData.currency)}`}
                min={minAmount}
                max={maxAmount}
                step={formData.currency === 'COP' ? 1000 : 1}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Min: {formatCurrency(minAmount, formData.currency)} | Max: {formatCurrency(maxAmount, formData.currency)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Proof of Payment</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition">
                <div className="space-y-1 text-center">
                  {previewUrl ? (
                    <div className="mb-4">
                      <img src={previewUrl} alt="Preview" className="mx-auto h-32 w-auto rounded" />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, proofFile: null });
                          setPreviewUrl(null);
                        }}
                        className="mt-2 text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>Upload file</span>
                      <input type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {loading ? 'Processing...' : 'Submit Deposit Request'}
            </button>
          </form>
        </div>

        {/* Bank Details & Info */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
            <h3 className="text-sm font-medium mb-2 opacity-90">Current Balance</h3>
            <p className="text-3xl font-bold">{formatCurrency(user?.balance || 0, formData.currency)}</p>
          </div>

          {/* Bank Account Details */}
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-yellow-900">
              💳 {formData.currency === 'COP' ? 'Bancolombia Account' : 'PLIN Account'}
            </h3>
            <div className="space-y-3 text-sm">
              <div className="bg-white rounded-lg p-3">
                <span className="font-medium text-gray-700">Account:</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-lg font-bold text-gray-900">{bankDetails.account}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(bankDetails.account);
                      addNotification('Account copied!', 'success');
                    }}
                    className="text-blue-600 hover:text-blue-700 text-xs"
                  >
                    📋 Copy
                  </button>
                </div>
              </div>
              <div>
                <span className="font-medium text-yellow-900">Bank:</span>
                <span className="ml-2 text-yellow-800">{bankDetails.bank}</span>
              </div>
              {bankDetails.type && (
                <div>
                  <span className="font-medium text-yellow-900">Type:</span>
                  <span className="ml-2 text-yellow-800">{bankDetails.type}</span>
                </div>
              )}
              <div>
                <span className="font-medium text-yellow-900">Name:</span>
                <span className="ml-2 text-yellow-800">{bankDetails.name}</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">How to Deposit</h3>
            <ol className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3">1</span>
                <span>Transfer to the {bankDetails.bank} account above</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3">2</span>
                <span>Take screenshot of confirmation</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3">3</span>
                <span>Upload proof using form</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3">4</span>
                <span>Admin approves within 24 hours</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3">5</span>
                <span>Balance updates automatically</span>
              </li>
            </ol>
          </div>

          {/* Welcome Bonus */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2 text-green-900">🎁 Welcome Bonus!</h3>
            <p className="text-sm text-green-800">First deposit gets <strong>5% bonus</strong>!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
