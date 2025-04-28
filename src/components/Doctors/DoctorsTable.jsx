import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Search } from 'lucide-react';
import Swal from 'sweetalert2';

export default function DoctorTable({ doctors, refreshDoctors }) {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [newDoctor, setNewDoctor] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialization: '',
    startTime: '',
    endTime: '',
    experienceYears: '',
    gender: '',
    status: true,
    hospitalId: '',
    image: null,
  });
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/hospitals');
        const data = await response.json();
        setHospitals(data);
      } catch (error) {
        console.error('Error fetching hospitals:', error);
      }
    };
    fetchHospitals();
  }, []);

  const handleEdit = (doctor) => {
    const [startTime, endTime] = doctor.timeslot ? doctor.timeslot.split(' - ') : ['', ''];
    setEditMode(true);
    setSelectedDoctorId(doctor.doctorId);
    setNewDoctor({
      fullName: doctor.fullName,
      email: doctor.email,
      phone: doctor.phone,
      specialization: doctor.specialization,
      startTime,
      endTime,
      experienceYears: doctor.experienceYears,
      gender: doctor.gender,
      status: doctor.status,
      hospitalId: doctor.hospital?.clinic_id || '',
      image: null,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;
    try {
      const res = await fetch(`http://localhost:8080/api/doctors/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await refreshDoctors();
        Swal.fire('Deleted!', 'Doctor has been deleted.', 'success');
      } else {
        throw new Error('Failed to delete doctor');
      }
    } catch (error) {
      Swal.fire('Error!', 'Something went wrong.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const timeslot = `${newDoctor.startTime} - ${newDoctor.endTime}`;

    const formData = new FormData();
    formData.append('fullName', newDoctor.fullName);
    formData.append('email', newDoctor.email);
    formData.append('phone', newDoctor.phone);
    formData.append('specialization', newDoctor.specialization);
    formData.append('timeslot', timeslot);
    formData.append('experienceYears', newDoctor.experienceYears);
    formData.append('gender', newDoctor.gender);
    formData.append('hospital_id', newDoctor.hospitalId);
    formData.append('status', newDoctor.status ? 'true' : 'false');
    if (newDoctor.image) {
      formData.append('file', newDoctor.image);
    }

    const url = editMode
      ? `http://localhost:8080/api/doctors/${selectedDoctorId}`
      : `http://localhost:8080/api/doctors`;
    const method = editMode ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        body: formData,
      });
      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: editMode ? 'Doctor Updated' : 'New Doctor Added',
          showConfirmButton: false,
          timer: 1500,
        });
        setIsModalOpen(false);
        setEditMode(false);
        setSelectedDoctorId(null);
        await refreshDoctors();
      } else {
        throw new Error('Failed to save doctor');
      }
    } catch (error) {
      Swal.fire('Error!', 'Something went wrong.', 'error');
    }
  };

  const filteredDoctors = doctors.filter((d) => {
    const term = search.toLowerCase();
    return (
      (d.fullName?.toLowerCase() || '').includes(term) ||
      (d.specialization?.toLowerCase() || '').includes(term) ||
      (d.timeslot?.toLowerCase() || '').includes(term) ||
      (String(d.status) || '').toLowerCase().includes(term)
    );
  });

  return (
    <motion.div className="p-6 space-y-6 min-h-screen bg-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Top Bar */}
      <div className="bg-gray-100 shadow-2xl rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black">Doctors Table</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search doctors..."
                className="bg-white text-black placeholder-black border border-black rounded-lg pl-10 pr-4 py-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-black" size={18} />
            </div>
            <button
              onClick={() => {
                setEditMode(false);
                setNewDoctor({
                  fullName: '', email: '', phone: '', specialization: '',
                  startTime: '', endTime: '', experienceYears: '', gender: '', status: true, hospitalId: '', image: null,
                });
                setIsModalOpen(true);
              }}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Add Doctor
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-400 border border-gray-300">
            <thead className="bg-gray-300">
              <tr>
                {['Image', 'Full Name', 'Specialization', 'Timeslot', 'Status', 'Created At', 'Actions'].map((head) => (
                  <th key={head} className="px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {filteredDoctors.map((d) => (
                <motion.tr key={d.doctorId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                  <td className="px-6 py-4 text-sm text-black">
                    <img
                      src={d.profileImageUrl ? `http://localhost:8080/files/${d.profileImageUrl}` : 'https://via.placeholder.com/48?text=No+Image'}
                      alt="profile"
                      className="w-12 h-12 rounded-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-black">{d.fullName}</td>
                  <td className="px-6 py-4 text-sm text-black">{d.specialization}</td>
                  <td className="px-6 py-4 text-sm text-black">{d.timeslot}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={d.status ? "text-green-600 font-semibold" : 
                      "text-red-600 font-semibold"}>{d.status ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 text-sm text-black">{d.createdAt}</td>
                  <td className="px-6 py-4 text-sm text-black">
                    <button onClick={() => handleEdit(d)} className="text-blue-600 hover:text-blue-800 mr-2">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(d.doctorId)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[500px] max-h-[90vh] overflow-y-auto text-black">
            <h2 className="text-xl mb-4">{editMode ? 'Edit Doctor' : 'Add New Doctor'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Form Fields */}
              {[
                { label: 'Full Name', name: 'fullName', type: 'text' },
                { label: 'Email', name: 'email', type: 'email' },
                { label: 'Phone', name: 'phone', type: 'text' },
                { label: 'Specialization', name: 'specialization', type: 'text' },
              ].map(({ label, name, type }) => (
                <div key={name}>
                  <label className="block mb-1 font-semibold">{label}</label>
                  <input
                    type={type}
                    value={newDoctor[name]}
                    onChange={(e) => setNewDoctor({ ...newDoctor, [name]: e.target.value })}
                    className="w-full px-4 py-2 border border-black rounded"
                  />
                </div>
              ))}

              {/* Start & End Time */}
              <div>
                <label className="block mb-1 font-semibold">Start Time</label>
                <input
                  type="time"
                  value={newDoctor.startTime}
                  onChange={(e) => setNewDoctor({ ...newDoctor, startTime: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">End Time</label>
                <input
                  type="time"
                  value={newDoctor.endTime}
                  onChange={(e) => setNewDoctor({ ...newDoctor, endTime: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded"
                />
              </div>

              {/* More Fields */}
              <div>
                <label className="block mb-1 font-semibold">Experience Years</label>
                <input
                  type="number"
                  value={newDoctor.experienceYears}
                  onChange={(e) => setNewDoctor({ ...newDoctor, experienceYears: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold">Gender</label>
                <select
                  value={newDoctor.gender}
                  onChange={(e) => setNewDoctor({ ...newDoctor, gender: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-semibold">Hospital</label>
                <select
                  value={newDoctor.hospitalId}
                  onChange={(e) => setNewDoctor({ ...newDoctor, hospitalId: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded"
                >
                  <option value="">Select Hospital</option>
                  {hospitals.map((h) => (
                    <option key={h.clinic_id} value={h.clinic_id}>{h.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-semibold">Status</label>
                <select
                  value={newDoctor.status ? 'true' : 'false'}
                  onChange={(e) => setNewDoctor({ ...newDoctor, status: e.target.value === 'true' })}
                  className="w-full px-4 py-2 border border-black rounded"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-semibold">Profile Image</label>
                <input
                  type="file"
                  onChange={(e) => setNewDoctor({ ...newDoctor, image: e.target.files[0] })}
                  className="w-full"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditMode(false);
                    setSelectedDoctorId(null);
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
