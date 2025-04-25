import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Search } from 'lucide-react';

export default function PatientTable() {
  const [patients, setPatients] = useState([]);
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

  const fetchPatients = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/patients');
      const json = await res.json();
      const actualPatients = Array.isArray(json) ? json : json.data || [];
      setPatients(actualPatients);
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

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
        fetchPatients();
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
        fetchPatients();
      } else {
        console.error('Failed to save patient');
      }
    } catch (error) {
      console.error('Error:', error);
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
      className="p-6 space-y-6 min-h-screen"
      style={{ backgroundColor: '#192231' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Patients Table</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search patients..."
                className="bg-gray-900 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            <button
              onClick={() => {
                setEditMode(false);
                setNewPatient({ fullName: '', email: '', phone: '', gender: '', dob: '' });
                setIsModalOpen(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
            >
              Add Patient
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                {['ID', 'Full Name', 'Email', 'Phone', 'Gender', 'DOB', 'Created At', 'Actions'].map((head) => (
                  <th
                    key={head}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredPatients.map((p) => (
                <motion.tr
                  key={p.patientId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 text-sm text-gray-300">{p.patientId}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{p.fullName}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{p.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{p.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{p.gender}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{p.dob}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{p.createdAt}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    <button onClick={() => handleEdit(p)} className="text-indigo-400 hover:text-indigo-300 mr-2">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(p.patientId)} className="text-red-400 hover:text-red-300">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-[500px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl text-white mb-4">
              {editMode ? 'Edit Patient' : 'Add New Patient'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {['fullName', 'email', 'phone', 'gender', 'dob'].map((field) => (
                <input
                  key={field}
                  type={field === 'dob' ? 'date' : 'text'}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={newPatient[field]}
                  onChange={(e) => setNewPatient({ ...newPatient, [field]: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded focus:outline-none"
                />
              ))}

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditMode(false);
                    setSelectedPatientId(null);
                  }}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
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
