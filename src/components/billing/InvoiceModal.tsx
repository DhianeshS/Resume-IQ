import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Transaction, UserProfile } from '../../types';
import { CheckCircle2, Download, Printer, X, Sparkles, Building, FileText } from 'lucide-react';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction;
  user: UserProfile | null;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  transaction,
  user,
}) => {
  if (!isOpen) return null;

  const baseAmount = Math.round(transaction.amount / 1.18);
  const gstAmount = transaction.amount - baseAmount;

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-[28px] max-w-2xl w-full p-8 border border-gray-100 shadow-2xl relative overflow-hidden text-gray-900 max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            id="close-invoice-modal-btn"
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Invoice Header */}
          <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Resume<span className="text-[#2563EB]">IQ</span> Tax Invoice</h3>
                <p className="text-xs text-gray-500">Official Payment Receipt & Subscription Confirmation</p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> PAID
            </span>
          </div>

          {/* Transaction Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs mb-6">
            <div>
              <span className="text-gray-400 font-semibold uppercase block text-[10px]">Invoice No</span>
              <span className="font-bold text-gray-900 mt-0.5 block">{transaction.invoiceNumber}</span>
            </div>
            <div>
              <span className="text-gray-400 font-semibold uppercase block text-[10px]">Payment ID</span>
              <span className="font-bold text-gray-900 mt-0.5 block truncate">{transaction.razorpayPaymentId}</span>
            </div>
            <div>
              <span className="text-gray-400 font-semibold uppercase block text-[10px]">Date</span>
              <span className="font-bold text-gray-900 mt-0.5 block">{new Date(transaction.createdAt).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-gray-400 font-semibold uppercase block text-[10px]">Method</span>
              <span className="font-bold text-gray-900 mt-0.5 block">{transaction.paymentMethod}</span>
            </div>
          </div>

          {/* Billed To & Provider Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs mb-8">
            <div className="p-4 rounded-xl border border-gray-100">
              <span className="text-gray-400 font-bold uppercase text-[10px] block mb-1">Customer Details</span>
              <p className="font-bold text-gray-900 text-sm">{user?.displayName || 'Valued Customer'}</p>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-gray-400 mt-1">Status: Premium Professional Member</p>
            </div>

            <div className="p-4 rounded-xl border border-gray-100">
              <span className="text-gray-400 font-bold uppercase text-[10px] block mb-1">Merchant Details</span>
              <p className="font-bold text-gray-900 text-sm">ResumeIQ SaaS Technologies India Pvt Ltd</p>
              <p className="text-gray-600">Razorpay Verified Merchant ID: rzp_live_iq2026</p>
              <p className="text-gray-400 mt-1">GSTIN: 29AAAAA0000A1Z5</p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden mb-8 text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
                  <th className="py-3 px-4">Item Description</th>
                  <th className="py-3 px-4 text-center">Billing Cycle</th>
                  <th className="py-3 px-4 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                <tr>
                  <td className="py-3.5 px-4 font-bold text-gray-900">
                    ResumeIQ Premium Membership
                    <span className="block text-gray-400 font-normal text-[11px]">
                      Unlimited Resume Rewrites, ATS Scoring, PDF Downloads, AI Cover Letters & Priority Server Queue
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center text-gray-700 capitalize font-bold">{transaction.planType}</td>
                  <td className="py-3.5 px-4 text-right font-bold text-gray-900">₹{baseAmount}.00</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-gray-500" colSpan={2}>
                    CGST + SGST (18% Integrated GST)
                  </td>
                  <td className="py-2.5 px-4 text-right font-medium text-gray-700">₹{gstAmount}.00</td>
                </tr>
                <tr className="bg-blue-50/50 font-bold text-sm text-gray-900">
                  <td className="py-3.5 px-4" colSpan={2}>
                    Total Amount Paid
                  </td>
                  <td className="py-3.5 px-4 text-right text-[#2563EB]">₹{transaction.amount}.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3">
            <button
              id="print-invoice-btn"
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 font-semibold text-xs text-gray-700 flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-gray-500" />
              <span>Print Invoice</span>
            </button>
            <button
              id="done-invoice-btn"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
