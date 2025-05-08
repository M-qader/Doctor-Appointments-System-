import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { Users, CheckCircle, XCircle, UserPlus } from "lucide-react";
import EmployeeTable from "../components/employee/EmployeesTable";

const EmployeePage = () => {
  const [employees, setEmployees] = useState([]);

  const fetchEmployees = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:8080/api/employees");
      const json = await res.json();
      const actualEmployees = Array.isArray(json) ? json : json.data || [];
      setEmployees(actualEmployees);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.is_active).length;
  const inactiveEmployees = employees.filter(e => !e.is_active).length;

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Employees" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name="Total Employees" icon={Users} value={totalEmployees} color="#6366F1" />
          <StatCard name="Active Employees" icon={CheckCircle} value={activeEmployees} color="#10B981" />
          <StatCard name="Inactive Employees" icon={XCircle} value={inactiveEmployees} color="#EF4444" />
        </motion.div>

        <EmployeeTable refreshEmployees={fetchEmployees} employees={employees} />
      </main>
    </div>
  );
};

export default EmployeePage;
