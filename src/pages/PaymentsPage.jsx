import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { DollarSign, Clock, CheckCircle, XCircle } from "lucide-react";
import PaymentTable from "../components/Payments/PaymentTable"; // cusub

const PaymentPage = () => {
  const [payments, setPayments] = useState([]);

  const fetchPayments = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:8080/api/payments");
      const json = await res.json();
      const actualPayments = Array.isArray(json) ? json : json.data || [];
      setPayments(actualPayments);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const totalPayments = payments.length;
  const cashPayments = payments.filter(p => p.method === "SUCCESS").length;
  const cardPayments = payments.filter(p => p.method === "FAILED").length;
  const mobilePayments = payments.filter(p => p.method === "PENDING").length;

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Payments" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name="Total Payments" icon={DollarSign} value={totalPayments} color="#6366F1" />
          <StatCard name="Paid by Cash" icon={CheckCircle} value={cashPayments} color="#10B981" />
          <StatCard name="Paid by Card" icon={DollarSign} value={cardPayments} color="#6366F1" />
          <StatCard name="Paid by Mobile" icon={Clock} value={mobilePayments} color="#FBBF24" /> 
        </motion.div>

        <PaymentTable refreshPayments={fetchPayments} payments={payments} />
      </main>
    </div>
  );
};

export default PaymentPage;
