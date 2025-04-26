// patiantTble.jsx
import Swal from 'sweetalert2';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Search } from 'lucide-react';

export default function PatientTable({ patients, refreshPatients }) {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  const [newPatient, setNewPatient] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
  });

  const handleEdit = (patient) => {
    setEditMode(true);
    setSelectedPatientId(patient.patientId);
    setNewPatient({
      fullName: patient.fullName,
      email: patient.email,
      phone: patient.phone,
      gender: patient.gender,
      dob: patient.dob,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) return;

    try {
      const res = await fetch(`http://localhost:8080/api/patients/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await refreshPatients();
      } else {
        console.error('Failed to delete patient');
      }
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editMode
      ? `http://localhost:8080/api/patients/${selectedPatientId}`
      : 'http://localhost:8080/api/patients';

    const method = editMode ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPatient),
      });

      if (res.ok) {
        setNewPatient({ fullName: '', email: '', phone: '', gender: '', dob: '' });
        setEditMode(false);
        setIsModalOpen(false);
        setSelectedPatientId(null);
        await refreshPatients();

        Swal.fire({
          icon: 'success',
          title: editMode ? 'Patient Updated' : 'New Patient Added',
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        console.error('Failed to save patient');
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to save patient!',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong!',
      });
    }
  };

  const filteredPatients = patients.filter((p) => {
    const term = search.toLowerCase();
    return (
      (p.fullName?.toLowerCase() || '').includes(term) ||
      (p.gender?.toLowerCase() || '').includes(term) ||
      (String(p.phone || '')).toLowerCase().includes(term) ||
      (p.dob?.toLowerCase() || '').includes(term)
    );
  });

  return (
    <motion.div
      className="p-6 space-y-6 min-h-screen bg-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="bg-gray-100 shadow-2xl rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black">Patients Table</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search patients..."
                className="bg-white text-black placeholder-black border border-black rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-black" size={18} />
            </div>
            <button
              onClick={() => {
                setEditMode(false);
                setNewPatient({ fullName: '', email: '', phone: '', gender: '', dob: '' });
                setIsModalOpen(true);
              }}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Add Patient
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-400 border border-gray-300">
            <thead className="bg-gray-300">
              <tr>
                {['ID', 'Full Name', 'Email', 'Phone', 'Gender', 'DOB', 'Created At', 'Actions'].map((head) => (
                  <th
                    key={head}
                    className="px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {filteredPatients.map((p) => (
                <motion.tr
                  key={p.patientId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-50"
                >
                  <td className="px-6 py-4 text-sm text-black">{p.patientId}</td>
                  <td className="px-6 py-4 text-sm text-black">{p.fullName}</td>
                  <td className="px-6 py-4 text-sm text-black">{p.email}</td>
                  <td className="px-6 py-4 text-sm text-black">{p.phone}</td>
                  <td className="px-6 py-4 text-sm text-black">{p.gender}</td>
                  <td className="px-6 py-4 text-sm text-black">{p.dob}</td>
                  <td className="px-6 py-4 text-sm text-black">{p.createdAt}</td>
                  <td className="px-6 py-4 text-sm text-black">
                    <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-800 mr-2">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(p.patientId)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[500px] max-h-[90vh] overflow-y-auto text-black">
            <h2 className="text-xl mb-4">{editMode ? 'Edit Patient' : 'Add New Patient'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-semibold">Full Name</label>
                <input
                  type="text"
                  value={newPatient.fullName}
                  onChange={(e) => setNewPatient({ ...newPatient, fullName: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Email</label>
                <input
                  type="email"
                  value={newPatient.email}
                  onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Phone</label>
                <input
                  type="text"
                  value={newPatient.phone}
                  onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Gender</label>
                <select
                  value={newPatient.gender}
                  onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-semibold">Date of Birth</label>
                <input
                  type="date"
                  value={newPatient.dob}
                  onChange={(e) => setNewPatient({ ...newPatient, dob: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditMode(false);
                    setSelectedPatientId(null);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  {editMode ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}
