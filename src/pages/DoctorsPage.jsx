import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { User, UserCheck, Users } from "lucide-react";
import DoctorTable from "../components/Doctors/DoctorsTable";

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);

  const fetchDoctors = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:8080/api/doctors");
      const json = await res.json();
      const actualDoctors = Array.isArray(json) ? json : json.data || [];
      setDoctors(actualDoctors);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

const totalDoctors = doctors.length;
const totalActives = doctors.filter((d) => d.status === true).length;
const totalInactives = doctors.filter((d) => d.status === false).length;

  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <Header title='Doctors' />

      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        {/* STATS */}
        <motion.div
          className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name='Total Doctors' icon={Users} value={totalDoctors} color='#6366F1' />
          <StatCard name='Total Actives' icon={User} value={totalActives} color='#10B981' />
          <StatCard name='Total InActives' icon={UserCheck} value={totalInactives} color='#F59E0B' />
        </motion.div>

        <DoctorTable refreshDoctors={fetchDoctors} doctors={doctors} />
      </main>
    </div>
  );
};

export default DoctorsPage;
