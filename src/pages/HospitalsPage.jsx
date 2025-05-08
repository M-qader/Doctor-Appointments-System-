// HospitalsPage.jsx
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { Building2, CheckCircle2, XCircle } from "lucide-react";
import HospitalTable from "../components/hospitals/HospitalTable"; // sax: new table

const HospitalsPage = () => {
  const [hospitals, setHospitals] = useState([]);

  const fetchHospitals = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:8080/api/hospitals");
      const json = await res.json();
      const actualHospitals = Array.isArray(json) ? json : json.data || [];
      setHospitals(actualHospitals);
    } catch (error) {
      console.error("Failed to fetch hospitals:", error);
    }
  }, []);

  useEffect(() => {
    fetchHospitals();
  }, [fetchHospitals]);

  const totalHospitals = hospitals.length;
  const activeHospitals = hospitals.filter((h) => h.status === true).length;
  const inactiveHospitals = hospitals.filter((h) => h.status === false).length;

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Hospitals" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name="Total Hospitals" icon={Building2} value={totalHospitals} color="#6366F1" />
          <StatCard name="Active" icon={CheckCircle2} value={activeHospitals} color="#10B981" />
          <StatCard name="Inactive" icon={XCircle} value={inactiveHospitals} color="#EF4444" />
        </motion.div>

        <HospitalTable refreshHospitals={fetchHospitals} hospitals={hospitals} />
      </main>
    </div>
  );
};

export default HospitalsPage;
