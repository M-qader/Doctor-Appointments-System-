// PatientsPage.jsx
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { User, UserCheck, Users } from "lucide-react";
import PatientTable from "../components/Patiants/patiantTble"; // renamed to match the component

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);

  const fetchPatients = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:8080/api/patients");
      const json = await res.json();
      const actualPatients = Array.isArray(json) ? json : json.data || [];
      setPatients(actualPatients);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const totalPatients = patients.length;
  const totalMens = patients.filter((p) => p.gender === "Male").length;
  const totalWomens = patients.filter((p) => p.gender === "Female").length;

  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <Header title='Patients' />

      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        {/* STATS */}
        <motion.div
          className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name='Total Patients' icon={Users} value={totalPatients} color='#6366F1' />
          <StatCard name='Total Men' icon={User} value={totalMens} color='#10B981' />
          <StatCard name='Total Women' icon={UserCheck} value={totalWomens} color='#F59E0B' />
        </motion.div>

        <PatientTable refreshPatients={fetchPatients} patients={patients} />
      </main>
    </div>
  );
};

export default PatientsPage;
