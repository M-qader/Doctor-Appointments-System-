import Swal from 'sweetalert2';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Search } from 'lucide-react';

export default function HospitalTable({ hospitals, refreshHospitals }) {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedHospitalId, setSelectedHospitalId] = useState(null);

  const [newHospital, setNewHospital] = useState({
    name: '',
    address: '',
    shortNumber: '',
    city: '',
    status: true,
  });

  const handleEdit = (hospital) => {
    setEditMode(true);
    setSelectedHospitalId(hospital.clinic_id);
    setNewHospital({
      name: hospital.name,
      address: hospital.address,
      shortNumber: hospital.shortNumber,
      city: hospital.city,
      status: hospital.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hospital?')) return;

    try {
      const res = await fetch(`http://localhost:8080/api/hospitals/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await refreshHospitals();
      } else {
        console.error('Failed to delete hospital');
      }
    } catch (error) {
      console.error('Error deleting hospital:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editMode
      ? `http://localhost:8080/api/hospitals/${selectedHospitalId}`
      : 'http://localhost:8080/api/hospitals';

    const method = editMode ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHospital),
      });

      if (res.ok) {
        setNewHospital({ name: '', address: '', shortNumber: '', city: '', status: true });
        setEditMode(false);
        setIsModalOpen(false);
        setSelectedHospitalId(null);
        await refreshHospitals();

        Swal.fire({
          icon: 'success',
          title: editMode ? 'Hospital Updated' : 'New Hospital Added',
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        console.error('Failed to save hospital');
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to save hospital!',
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

  const filteredHospitals = hospitals.filter((h) => {
    const term = search.toLowerCase();
    return (
      (h.name?.toLowerCase() || '').includes(term) ||
      (h.address?.toLowerCase() || '').includes(term) ||
      (h.city?.toLowerCase() || '').includes(term) ||
      (String(h.shortNumber || '')).toLowerCase().includes(term) ||
      (h.createdAt?.toLowerCase() || '')
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
          <h2 className="text-xl font-bold text-black">Hospitals Table</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search hospitals..."
                className="bg-white text-black placeholder-black border border-black rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-black" size={18} />
            </div>
            <button
              onClick={() => {
                setEditMode(false);
                setNewHospital({ name: '', address: '', shortNumber: '', city: '', status: true });
                setIsModalOpen(true);
              }}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Add Hospital
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-400 border border-gray-300">
            <thead className="bg-gray-300">
              <tr>
                {['ID', 'Name', 'Address', 'Short Number', 'City', 'Status', 'Created At', 'Actions'].map((head) => (
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
              {filteredHospitals.map((h) => (
                <motion.tr
                  key={h.clinic_id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-50"
                >
                  <td className="px-6 py-4 text-sm text-black">{h.clinic_id}</td>
                  <td className="px-6 py-4 text-sm text-black">{h.name}</td>
                  <td className="px-6 py-4 text-sm text-black">{h.address}</td>
                  <td className="px-6 py-4 text-sm text-black">{h.shortNumber}</td>
                  <td className="px-6 py-4 text-sm text-black">{h.city}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={h.status ? "text-green-600 font-semibold" : 
                      "text-red-600 font-semibold"}>{h.status ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-black">{h.createdAt}</td>
                  <td className="px-6 py-4 text-sm text-black">
                    <button onClick={() => handleEdit(h)} className="text-blue-600 hover:text-blue-800 mr-2">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(h.clinic_id)} className="text-red-600 hover:text-red-800">
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
            <h2 className="text-xl mb-4">{editMode ? 'Edit Hospital' : 'Add New Hospital'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-semibold">Name</label>
                <input
                  type="text"
                  value={newHospital.name}
                  onChange={(e) => setNewHospital({ ...newHospital, name: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Address</label>
                <input
                  type="text"
                  value={newHospital.address}
                  onChange={(e) => setNewHospital({ ...newHospital, address: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Short Number</label>
                <input
                  type="text"
                  value={newHospital.shortNumber}
                  onChange={(e) => setNewHospital({ ...newHospital, shortNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">City</label>
                <input
                  type="text"
                  value={newHospital.city}
                  onChange={(e) => setNewHospital({ ...newHospital, city: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Status</label>
                <select
                  value={newHospital.status ? 'true' : 'false'}
                  onChange={(e) => setNewHospital({ ...newHospital, status: e.target.value === 'true' })}
                  className="w-full px-4 py-2 border border-black rounded"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditMode(false);
                    setSelectedHospitalId(null);
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
