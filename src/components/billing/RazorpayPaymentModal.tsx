import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { Transaction } from '../../types';
import {
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  X,
  CreditCard,
  QrCode,
  Building2,
  Zap,
  ArrowRight,
  Lock,
} from 'lucide-react';

interface RazorpayPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (transaction: Transaction) => void;
}

export const RazorpayPaymentModal: React.FC<RazorpayPaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { upgradeToPremium } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const currentAmount = selectedPlan === 'yearly' ? 2499 : 299;

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate Razorpay Gateway authorization
      await new Promise((resolve) => setTimeout(resolve, 1800));

      const methodLabel =
        paymentMethod === 'upi' ? `UPI (${upiId || 'GPay/PhonePe'})` : paymentMethod === 'card' ? 'Credit/Debit Card' : 'Net Banking';

      const transaction = await upgradeToPremium(selectedPlan, methodLabel);
      setIsProcessing(false);
      onClose();
      onSuccess(transaction);
    } catch (err) {
      console.error('Payment error:', err);
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-[28px] max-w-2xl w-full p-6 sm:p-8 border border-gray-100 shadow-2xl relative my-8 text-gray-900"
        >
          {/* Close Button */}
          <button
            id="close-razorpay-modal-btn"
            onClick={onClose}
            disabled={isProcessing}
            className="absolute top-6 right-6 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                  Razorpay Secure Checkout
                </span>
                <span className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                  <Lock className="w-3 h-3 text-emerald-600" /> 256-bit Encrypted
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight mt-0.5">
                Upgrade to Premium
              </h3>
            </div>
          </div>

          {/* PLAN SELECTION TOGGLE */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Monthly Plan */}
            <div
              onClick={() => setSelectedPlan('monthly')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all relative ${selectedPlan === 'monthly' ? 'border-[#2563EB] bg-blue-50/30 shadow-xs' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-sm text-gray-900">Monthly Pass</span>
                {selectedPlan === 'monthly' && <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-gray-900">₹299</span>
                <span className="text-xs text-gray-500 font-medium">/ month</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">Billed monthly. Cancel anytime.</p>
            </div>

            {/* Yearly Plan - HIGHLIGHTED */}
            <div
              onClick={() => setSelectedPlan('yearly')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all relative ${selectedPlan === 'yearly' ? 'border-[#2563EB] bg-blue-50/50 shadow-xs ring-2 ring-blue-500/20' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <div className="absolute -top-3 right-4 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                MOST POPULAR • SAVE 30%
              </div>
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-sm text-gray-900">Yearly Pro Pass</span>
                {selectedPlan === 'yearly' && <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-gray-900">₹2,499</span>
                <span className="text-xs text-gray-500 font-medium">/ year</span>
              </div>
              <p className="text-[11px] text-emerald-700 font-semibold mt-1">Equivalent to ₹208/mo (Save ₹1,089)</p>
            </div>
          </div>

          {/* PAYMENT METHOD TABS */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Select Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2 bg-gray-100 p-1 rounded-2xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${paymentMethod === 'upi' ? 'bg-white text-[#2563EB] shadow-xs' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <QrCode className="w-4 h-4" />
                <span>UPI / QR</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${paymentMethod === 'card' ? 'bg-white text-[#2563EB] shadow-xs' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Card</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${paymentMethod === 'netbanking' ? 'bg-white text-[#2563EB] shadow-xs' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <Building2 className="w-4 h-4" />
                <span>Net Banking</span>
              </button>
            </div>
          </div>

          {/* FORM DETAILS */}
          <form onSubmit={handlePayNow} className="space-y-4">
            {paymentMethod === 'upi' && (
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-3">
                <span className="text-xs font-bold text-gray-800 block">UPI Instant Payment (GPay, PhonePe, Paytm, BHIM)</span>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">Enter UPI ID / VPA</label>
                  <input
                    type="text"
                    placeholder="e.g. yourname@okaxis or 9876543210@paytm"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                  />
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gray-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>A payment request will be sent directly to your UPI app.</span>
                </div>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">Card Number</label>
                  <input
                    type="text"
                    placeholder="4000 1234 5678 9010"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 mb-1">Valid Thru (MM/YY)</label>
                    <input
                      type="text"
                      placeholder="12/28"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 mb-1">CVV</label>
                    <input
                      type="password"
                      placeholder="•••"
                      maxLength={4}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2 text-xs">
                <span className="font-bold text-gray-800 block">Popular Indian Banks</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak', 'PNB', 'BOB', 'Canara'].map((bank, i) => (
                    <button
                      type="button"
                      key={i}
                      className="p-2 rounded-xl border border-gray-200 bg-white hover:border-blue-500 text-[11px] font-medium text-gray-700 text-center cursor-pointer"
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ORDER SUMMARY */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs">
              <div>
                <span className="text-gray-500 font-medium">Total Amount Payable</span>
                <span className="text-xs text-gray-400 block font-normal">(Inclusive of 18% GST)</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-[#2563EB]">₹{currentAmount}</span>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              id="razorpay-pay-now-btn"
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 px-6 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authorizing with Razorpay...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Pay ₹{currentAmount} & Unlock Premium</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
