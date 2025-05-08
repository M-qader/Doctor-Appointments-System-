import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Search, X } from 'lucide-react';

export default function AppointmentTable({ appointments, refreshAppointments }) {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [newAppointment, setNewAppointment] = useState({
    patient: { patientId: '' },
    doctor: { doctorId: '' },
    reason: '',
    appointmentDate: '',
    location: '',
  });

  useEffect(() => {
    const fetchPatientsAndDoctors = async () => {
      try {
        const [patientsRes, doctorsRes] = await Promise.all([
          fetch('http://localhost:8080/api/patients'),
          fetch('http://localhost:8080/api/doctors'),
        ]);
        const patientsData = await patientsRes.json();
        const doctorsData = await doctorsRes.json();
        setPatients(patientsData);
        setDoctors(doctorsData);
      } catch (error) {
        console.error('Error fetching patients or doctors:', error);
      }
    };

    fetchPatientsAndDoctors();
  }, []);

  const handleEdit = (appointment) => {
    setEditMode(true);
    setSelectedAppointmentId(appointment.appointmentId);
    setNewAppointment({
      patient: { patientId: appointment.patient.patientId },
      doctor: { doctorId: appointment.doctor.doctorId },
      reason: appointment.reason,
      appointmentDate: appointment.appointmentDate,
      location: appointment.location,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      const res = await fetch(`http://localhost:8080/api/appointments/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await refreshAppointments();
        Swal.fire({
          icon: 'success',
          title: 'Appointment deleted successfully',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      const res = await fetch(`http://localhost:8080/api/appointments/cancel/${id}`, {
        method: 'PUT',
      });
      if (res.ok) {
        await refreshAppointments();
        Swal.fire({
          icon: 'success',
          title: 'Appointment cancelled',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Cancellation failed!',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editMode
      ? `http://localhost:8080/api/appointments/${selectedAppointmentId}`
      : 'http://localhost:8080/api/appointments';

    const method = editMode ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAppointment),
      });

      if (res.ok) {
        setNewAppointment({
          patient: { patientId: '' },
          doctor: { doctorId: '' },
          reason: '',
          appointmentDate: '',
          location: '',
        });
        setEditMode(false);
        setIsModalOpen(false);
        setSelectedAppointmentId(null);
        await refreshAppointments();

        Swal.fire({
          icon: 'success',
          title: editMode ? 'Appointment updated' : 'New appointment created',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    const term = search.toLowerCase();
    return (
      (a.patient?.fullName?.toLowerCase() || '').includes(term) ||
      (a.doctor?.fullName?.toLowerCase() || '').includes(term) ||
      (a.reason?.toLowerCase() || '').includes(term) ||
      (a.location?.toLowerCase() || '').includes(term)
    );
  });

  return (
    <motion.div className="p-6 space-y-6 min-h-screen w-[1280px] mx-auto bg-white">
      <div className="bg-gray-100 shadow-2xl rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black">Appointments</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search appointments..."
                className="bg-white text-black placeholder-black border border-black rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-black" size={18} />
            </div>
            <button
              onClick={() => {
                setEditMode(false);
                setNewAppointment({
                  patient: { patientId: '' },
                  doctor: { doctorId: '' },
                  reason: '',
                  appointmentDate: '',
                  location: '',
                });
                setIsModalOpen(true);
              }}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              New Appointment
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-400 border border-gray-300">
            <thead className="bg-gray-300">
              <tr>
                {['ID', 'Patient', 'Doctor', 'Reason', 'Date', 'Booked At', 'Status', 'Action'].map((head) => (
                  <th key={head} className="px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {filteredAppointments.map((a) => (
                <motion.tr key={a.appointmentId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="bg-gray-50">
                  <td className="px-6 py-4 text-sm text-black">{a.appointmentId}</td>
                  <td className="px-6 py-4 text-sm text-black">{a.patient?.fullName}</td>
                  <td className="px-6 py-4 text-sm text-black">{a.doctor?.fullName}</td>
                  <td className="px-6 py-4 text-sm text-black">{a.reason}</td>
                  <td className="px-6 py-4 text-sm text-black">{a.appointmentDate}</td>
                  <td className="px-6 py-4 text-sm text-black">{a.bookedAt}</td>
                  <td className="px-6 py-4 text-sm text-black">
                    {a.canceledAt ? (
                      <span className="bg-yellow-300 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">Cancelled</span>
                    ) : (
                      <span className="bg-green-300 text-green-800 px-2 py-1 rounded-full text-xs font-bold">Active</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-black flex space-x-2">
                    <button onClick={() => handleEdit(a)} className="text-blue-600 hover:text-blue-800">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(a.appointmentId)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={18} />
                    </button>
                    <button onClick={() => handleCancel(a.appointmentId)} className="text-yellow-600 hover:text-yellow-800 font-semibold">
                      Cancel
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white p-8 rounded-xl shadow-2xl w-[500px] max-h-[90vh] overflow-y-auto text-black"
          >
            <button
              onClick={() => {
                setIsModalOpen(false);
                setEditMode(false);
                setSelectedAppointmentId(null);
              }}
              className="absolute top-4 right-4 p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
            >
              <X className="w-5 h-5 text-black" />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-center">
              {editMode ? 'Edit Appointment' : 'New Appointment'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Patient */}
              <div>
                <label className="block mb-1 font-semibold">Patient</label>
                <select
                  value={newAppointment.patient.patientId}
                  onChange={(e) =>
                    setNewAppointment({ ...newAppointment, patient: { patientId: e.target.value } })
                  }
                  className="w-full px-4 py-2 border border-gray-400 rounded focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                >
                  <option value="">Select Patient</option>
                  {patients.map((p) => (
                    <option key={p.patientId} value={p.patientId}>
                      {p.fullName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Doctor */}
              <div>
                <label className="block mb-1 font-semibold">Doctor</label>
                <select
                  value={newAppointment.doctor.doctorId}
                  onChange={(e) =>
                    setNewAppointment({ ...newAppointment, doctor: { doctorId: e.target.value } })
                  }
                  className="w-full px-4 py-2 border border-gray-400 rounded focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((d) => (
                    <option key={d.doctorId} value={d.doctorId}>
                      {d.fullName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reason */}
              <div>
                <label className="block mb-1 font-semibold">Reason</label>
                <input
                  type="text"
                  value={newAppointment.reason}
                  onChange={(e) => setNewAppointment({ ...newAppointment, reason: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-400 rounded focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
              </div>

              {/* Appointment Date */}
              <div>
                <label className="block mb-1 font-semibold">Appointment Date</label>
                <input
                  type="datetime-local"
                  value={newAppointment.appointmentDate}
                  onChange={(e) => setNewAppointment({ ...newAppointment, appointmentDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-400 rounded focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block mb-1 font-semibold">Location</label>
                <input
                  type="text"
                  value={newAppointment.location}
                  onChange={(e) => setNewAppointment({ ...newAppointment, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-400 rounded focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
              </div>

              <div className="flex justify-end">
                <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
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
