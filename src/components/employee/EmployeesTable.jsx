import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Search, X } from 'lucide-react';
import Swal from 'sweetalert2';

export default function EmployeesTable({ refreshEmployees, employees }) {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [newEmployee, setNewEmployee] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    role: '',
    password_Hash: '',
    is_active: true,
  });

  const handleEdit = (emp) => {
    setEditMode(true);
    setSelectedId(emp.employee_Id);
    setNewEmployee({ ...emp });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    await fetch(`http://localhost:8080/api/employees/${id}`, { method: 'DELETE' });
    await refreshEmployees();
    Swal.fire({ icon: 'success', title: 'Deleted', timer: 1500, showConfirmButton: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editMode
      ? `http://localhost:8080/api/employees/${selectedId}`
      : 'http://localhost:8080/api/employees';
    const method = editMode ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEmployee),
    });

    if (res.ok) {
      await refreshEmployees();
      setIsModalOpen(false);
      setEditMode(false);
      setSelectedId(null);
      setNewEmployee({
        fullName: '',
        username: '',
        email: '',
        phone: '',
        role: '',
        password_Hash: '',
        is_active: true,
      });
      Swal.fire({ icon: 'success', title: editMode ? 'Updated' : 'Added', timer: 1500, showConfirmButton: false });
    }
  };

  const filtered = employees.filter((e) =>
    [e.fullName, e.email, e.username, e.phone, e.role,]
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <motion.div className="p-6 space-y-6 min-h-screen bg-white">
      <div className="bg-gray-100 shadow-2xl rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black">Employees</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="bg-white text-black border border-black rounded-lg pl-10 pr-4 py-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-black" size={18} />
            </div>
            <button
              onClick={() => {
                setEditMode(false);
                setNewEmployee({
                  fullName: '',
                  username: '',
                  email: '',
                  phone: '',
                  role: '',
                  password_Hash: '',
                  is_active: true,
                });
                setIsModalOpen(true);
              }}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              New Employee
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-400 border border-gray-300 text-sm">
            <thead className="bg-gray-300 text-black uppercase">
              <tr>
                {['ID', 'Full Name', 'Username', 'Email', 'Phone', 'Role', 'Active', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-2 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-black">
              {filtered.map((emp) => (
                <tr key={emp.employee_Id} className="bg-white hover:bg-gray-100 transition-all">
                  <td className="px-4 py-3">{emp.employee_Id}</td>
                  <td className="px-4 py-3">{emp.fullName}</td>
                  <td className="px-4 py-3">{emp.username}</td>
                  <td className="px-4 py-3">{emp.email}</td>
                  <td className="px-4 py-3">{emp.phone}</td>
                  <td className="px-4 py-3">{emp.role}</td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${emp.is_active ? 'text-green-600' : 'text-red-600'}`}>
                      {emp.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-4">
                      <button onClick={() => handleEdit(emp)} className="text-blue-600 hover:text-blue-800">
                        <Edit size={20} />
                      </button>
                      <button onClick={() => handleDelete(emp.employee_Id)} className="text-red-600 hover:text-red-800">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white text-black p-6 rounded-xl shadow-lg w-[500px] relative"
          >
            <button
              onClick={() => {
                setIsModalOpen(false);
                setEditMode(false);
                setSelectedId(null);
              }}
              className="absolute top-4 right-4 p-2 bg-gray-400 hover:bg-gray-300 rounded-full"
            >
              <X className="w-5 h-5 text-black" />
            </button>

            <h2 className="text-2xl font-bold mb-4 text-center">
              {editMode ? 'Edit Employee' : 'New Employee'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
            {['fullName', 'username', 'email', 'phone', 'role', 'password_Hash'].map((field) => (
                <div key={field}>
                  <label className="block mb-1 capitalize font-semibold">{field.replace('_', ' ')}</label>
                  <input
                    type={field === 'password_Hash' ? 'password' : 'text'}
                    value={newEmployee[field]}
                    onChange={(e) => setNewEmployee({ ...newEmployee, [field]: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded bg-white text-black"
                  />
                </div>
              ))}
              <div>
                <label className="block mb-1 font-semibold">Status</label>
                <select
                  value={newEmployee.is_active ? 'true' : 'false'}
                  onChange={(e) => setNewEmployee({ ...newEmployee, is_active: e.target.value === 'true' })}
                  className="w-full px-4 py-2 border border-black rounded"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end">
                <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">
                  {editMode ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
