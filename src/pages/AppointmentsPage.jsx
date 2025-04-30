// AppointmentsPage.jsx
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { Calendar, CheckCircle, XCircle } from "lucide-react";
import AppointmentTable from "../components/Appointments/AppointmentTable"; // cusub

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:8080/api/appointments");
      const json = await res.json();
      const actualAppointments = Array.isArray(json) ? json : json.data || [];
      setAppointments(actualAppointments);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const totalAppointments = appointments.length;
  const upcomingAppointments = appointments.filter(a => new Date(a.appointmentDate) > new Date()).length;
  const pastAppointments = appointments.filter(a => new Date(a.appointmentDate) <= new Date()).length;

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Appointments" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name="Total Appointments" icon={Calendar} value={totalAppointments} color="#6366F1" />
          <StatCard name="Upcoming" icon={CheckCircle} value={upcomingAppointments} color="#10B981" />
          <StatCard name="Past" icon={XCircle} value={pastAppointments} color="#F59E0B" />
        </motion.div>

        <AppointmentTable refreshAppointments={fetchAppointments} appointments={appointments} />
      </main>
    </div>
  );
};

export default AppointmentsPage;
