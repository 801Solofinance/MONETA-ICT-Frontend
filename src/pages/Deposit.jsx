import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/currency";

export default function Deposit() {
  const { user, refreshUser } = useAuth();
  const { addNotification } = useApp();
  const navigate = useNavigate();

  const currency = user?.country === "CO" ? "COP" : "PEN";
  const minAmount = currency === "COP" ? 40000 : 20;

  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [proofFile, setProofFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(900);
  const [initialBalance, setInitialBalance] = useState(0);

  const quickAmounts =
    currency === "COP"
      ? [40000, 80000, 150000, 300000]
      : [20, 50, 100, 200];

  // Countdown Timer
  useEffect(() => {
    if (step === 3 && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, countdown]);

  const formatTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return addNotification("Only image files allowed", "error");
    }

    setProofFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const submitDeposit = async () => {
    if (!amount || amount < minAmount) {
      return addNotification("Invalid deposit amount", "error");
    }

    if (!proofFile) {
      return addNotification("Upload payment proof", "error");
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      setInitialBalance(user?.balance || 0);

      const formData = new FormData();
      formData.append("amount", amount);
      formData.append("currency", currency);
      formData.append("proof", proofFile);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/transactions/deposit`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Deposit failed");

      setStep(4);

      // Poll every 5 sec for approval
      const interval = setInterval(async () => {
        const updatedUser = await refreshUser();

        if (updatedUser?.balance > initialBalance) {
          clearInterval(interval);
          setStep(5);
          setTimeout(() => navigate("/dashboard"), 2000);
        }
      }, 5000);

    } catch (err) {
      addNotification(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <h2 className="text-2xl font-bold">Select Deposit Amount</h2>

          <div className="grid grid-cols-2 gap-4">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(amt)}
                className="btn btn-secondary"
              >
                {formatCurrency(amt, currency)}
              </button>
            ))}
          </div>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input"
            placeholder={`Min ${formatCurrency(minAmount, currency)}`}
          />

          {amount >= minAmount && (
            <button
              onClick={() => setStep(2)}
              className="btn btn-primary w-full"
            >
              Confirm Deposit
            </button>
          )}
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <h2 className="text-xl font-bold">Confirm Deposit</h2>
          <div className="bg-gray-100 p-4 rounded">
            {formatCurrency(amount, currency)}
          </div>
          <button
            onClick={() => setStep(3)}
            className="btn btn-primary w-full"
          >
            Proceed to Payment
          </button>
        </>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <>
          <h2 className="text-xl font-bold">Complete Payment</h2>

          <div className="bg-blue-50 p-4 rounded">
            {currency === "COP" ? (
              <>
                <p><strong>Bank:</strong> Bancolombia</p>
                <p><strong>Type:</strong> Ahorros</p>
                <p><strong>Account:</strong> 00100007120</p>
                <p><strong>Name:</strong> Jose Jimenez C.</p>
              </>
            ) : (
              <>
                <p><strong>Method:</strong> PLIN</p>
                <p><strong>Phone:</strong> 935460768</p>
                <p><strong>Name:</strong> ELISIA RIOS</p>
              </>
            )}
          </div>

          <p className="text-sm text-gray-600">
            Complete payment within:{" "}
            <strong>{formatTime(countdown)}</strong>
          </p>

          <input type="file" accept="image/*" onChange={handleUpload} />

          {previewUrl && (
            <img src={previewUrl} alt="preview" className="h-32 mt-2 rounded" />
          )}

          {proofFile && (
            <button
              onClick={submitDeposit}
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? "Submitting..." : "I Have Completed Payment"}
            </button>
          )}
        </>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <div className="text-center space-y-3">
          <h2 className="text-xl font-bold">Payment Under Review</h2>
          <p>Payment is being reviewed.</p>
          <p>Estimated time: 15 minutes.</p>
        </div>
      )}

      {/* STEP 5 */}
      {step === 5 && (
        <div className="text-center space-y-3">
          <h2 className="text-green-600 text-2xl font-bold">
            Deposit Successful 🎉
          </h2>
          <p>Redirecting to dashboard...</p>
        </div>
      )}
    </div>
  );
}
