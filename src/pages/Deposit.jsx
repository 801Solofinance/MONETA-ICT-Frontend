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
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
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
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // Create FormData for file upload
      const uploadData = new FormData();
      uploadData.append('amount', formData.amount);
      uploadData.append('currency', formData.currency);
      uploadData.append('proof', formData.proofFile);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/transactions/deposit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create deposit');
      }

      addNotification('Deposit request submitted successfully! Awaiting admin approval.', 'success');
      
      // Reset form
      setFormData({
        amount: '',
        currency: user?.country === 'CO' ? 'COP' : 'PEN',
        proofFile: null
      });
      setPreviewUrl(null);
      
      // Refresh user data (will update when admin approves)
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Make a Deposit</h1>
        <p className="text-gray-600">
          Add funds to your MONETA-ICT account to start investing
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Deposit Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Deposit Information</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Currency Selection */}
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
                Min: {formatCurrency(minAmount, formData.currency)} | Max: {formatCurrency(maxAmount, formData.currency)}
              </p>
            </div>

            {/* Proof of Payment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proof of Payment
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition">
                <div className="space-y-1 text-center">
                  {previewUrl ? (
                    <div className="mb-4">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="mx-auto h-32 w-auto rounded"
                      />
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
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                'Submit Deposit Request'
              )}
            </button>
          </form>
        </div>

        {/* Instructions */}
        <div className="space-y-6">
          {/* Current Balance */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
            <h3 className="text-sm font-medium mb-2 opacity-90">Current Balance</h3>
            <p className="text-3xl font-bold">
              {formatCurrency(user?.balance || 0, formData.currency)}
            </p>
          </div>

          {/* Deposit Instructions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">How to Deposit</h3>
            <ol className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                  1
                </span>
                <span>Transfer the amount to our bank account</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                  2
                </span>
                <span>Take a screenshot or photo of the payment confirmation</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                  3
                </span>
                <span>Upload the proof of payment using the form</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                  4
                </span>
                <span>Admin will review and approve within 24 hours</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                  5
                </span>
                <span>Funds will be added to your balance automatically</span>
              </li>
            </ol>
          </div>

          {/* Bank Details */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-yellow-900">Bank Account Details</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-yellow-900">Bank:</span>
                <span className="ml-2 text-yellow-800">Bancolombia</span>
              </div>
              <div>
                <span className="font-medium text-yellow-900">Account:</span>
                <span className="ml-2 text-yellow-800">1234567890</span>
              </div>
              <div>
                <span className="font-medium text-yellow-900">Type:</span>
                <span className="ml-2 text-yellow-800">Ahorros</span>
              </div>
              <div>
                <span className="font-medium text-yellow-900">Name:</span>
                <span className="ml-2 text-yellow-800">MONETA-ICT SAS</span>
              </div>
            </div>
          </div>

          {/* Welcome Bonus Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2 text-green-900">🎁 Welcome Bonus!</h3>
            <p className="text-sm text-green-800">
              First-time depositors receive a <strong>5% bonus</strong> on their initial deposit!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
