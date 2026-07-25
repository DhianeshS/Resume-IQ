import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { Transaction } from '../../types';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import {
  CreditCard,
  Zap,
  GraduationCap,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  FileText,
  Clock,
  ArrowUpRight,
} from 'lucide-react';

interface BillingViewProps {
  onOpenUpgradeModal: () => void;
  onOpenInvoiceModal: (tx: Transaction) => void;
  onGoToStudentVerification: () => void;
}

export const BillingView: React.FC<BillingViewProps> = ({
  onOpenUpgradeModal,
  onOpenInvoiceModal,
  onGoToStudentVerification,
}) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTx, setLoadingTx] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user || !db) {
        setLoadingTx(false);
        return;
      }
      try {
        const snap = await getDocs(collection(db, `users/${user.uid}/transactions`));
        const txList: Transaction[] = [];
        snap.forEach((doc) => {
          txList.push({ id: doc.id, ...doc.data() } as Transaction);
        });
        txList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setTransactions(txList);
      } catch (err) {
        console.warn('Could not fetch transactions:', err);
      } finally {
        setLoadingTx(false);
      }
    };

    fetchTransactions();
  }, [user]);

  const isVerifiedStudent = user?.isStudentVerified || user?.accountType === 'verified_student';
  const isPremium = user?.isPremium || user?.accountType === 'premium_professional';

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 sm:p-8 rounded-[28px] border border-gray-100 shadow-xs space-y-2"
      >
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-bold border border-blue-100 flex items-center gap-1.5">
            <CreditCard className="w-4 h-4" /> Subscription & Account Tier
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Plans & Billing Management
        </h2>
        <p className="text-sm text-gray-600 max-w-3xl leading-relaxed">
          Manage your subscription tier, student verification benefits, payment methods, and download official tax invoices.
        </p>
      </motion.div>

      {/* CURRENT ACTIVE TIER CARD */}
      <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-gray-100 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${isPremium ? 'bg-gradient-to-br from-amber-500 to-yellow-600 shadow-amber-500/20' : isVerifiedStudent ? 'bg-emerald-600 shadow-emerald-500/20' : 'bg-[#2563EB] shadow-blue-500/20'}`}>
              {isPremium ? <Zap className="w-7 h-7" /> : isVerifiedStudent ? <GraduationCap className="w-7 h-7" /> : <Sparkles className="w-7 h-7" />}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${isPremium ? 'bg-amber-50 text-amber-800 border-amber-200' : isVerifiedStudent ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-blue-50 text-[#2563EB] border-blue-100'}`}>
                  {isPremium ? '⭐ Premium Professional Member' : isVerifiedStudent ? '🟢 Verified Student Pass' : 'Free Professional Account'}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight mt-1">
                {isPremium ? 'Unlimited Pro Access' : isVerifiedStudent ? '100% Free Premium Student Pass' : 'Standard Free Tier'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isPremium && !isVerifiedStudent && (
              <>
                <button
                  id="billing-verify-student-btn"
                  onClick={onGoToStudentVerification}
                  className="px-4 py-2.5 rounded-2xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs border border-emerald-200 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Verify Student (Free)</span>
                </button>
                <button
                  id="billing-upgrade-now-btn"
                  onClick={onOpenUpgradeModal}
                  className="px-5 py-2.5 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Zap className="w-4 h-4" />
                  <span>Upgrade to Premium</span>
                </button>
              </>
            )}

            {isVerifiedStudent && (
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Active Student Benefits
              </span>
            )}

            {isPremium && (
              <span className="text-xs text-amber-800 font-semibold bg-amber-50 px-3.5 py-2 rounded-xl border border-amber-200 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-600" /> Active Premium Subscription
              </span>
            )}
          </div>
        </div>

        {/* FEATURES OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
            <span className="font-bold text-gray-900 block">PDF Report Downloads</span>
            <p className="text-gray-500">
              {isPremium || isVerifiedStudent ? '✓ Unlimited PDF downloads active' : '🔒 Upgrade or Verify Student to download'}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
            <span className="font-bold text-gray-900 block">AI Cover Letter Generator</span>
            <p className="text-gray-500">
              {isPremium || isVerifiedStudent ? '✓ Full AI cover letter access' : '🔒 Upgrade or Verify Student to unlock'}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
            <span className="font-bold text-gray-900 block">Career Center & Roadmaps</span>
            <p className="text-gray-500">✓ Included for all logged in accounts</p>
          </div>
        </div>
      </div>

      {/* PAYMENT & INVOICE TRANSACTION HISTORY TABLE */}
      <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-gray-100 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#2563EB]" />
          Billing History & Tax Invoices
        </h3>

        {loadingTx ? (
          <p className="text-xs text-gray-400 py-4">Loading billing records...</p>
        ) : transactions.length > 0 ? (
          <div className="border border-gray-100 rounded-2xl overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px]">
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Plan</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/50">
                    <td className="py-3.5 px-4 font-bold text-gray-900">{tx.invoiceNumber}</td>
                    <td className="py-3.5 px-4 text-gray-600">{new Date(tx.createdAt).toLocaleDateString()}</td>
                    <td className="py-3.5 px-4 font-bold text-gray-800 capitalize">{tx.planType} Pro</td>
                    <td className="py-3.5 px-4 font-bold text-[#2563EB]">₹{tx.amount}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onOpenInvoiceModal(tx)}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 text-[#2563EB] hover:bg-blue-100 font-bold text-xs border border-blue-100 transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Invoice</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-gray-50/80 border border-gray-100 text-center space-y-1">
            <Clock className="w-6 h-6 text-gray-400 mx-auto" />
            <p className="text-xs font-bold text-gray-700">No Paid Transactions Yet</p>
            <p className="text-[11px] text-gray-400">
              When you purchase a Premium plan or upgrade, your official tax invoice will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
