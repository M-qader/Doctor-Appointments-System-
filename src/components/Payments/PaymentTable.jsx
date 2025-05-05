// imports
import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Search, X } from 'lucide-react';

export default function PaymentTable({ refreshPayments }) {
  const [payments, setPayments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);

  const [newPayment, setNewPayment] = useState({
    appointment: { appointmentId: '' },
    amount: '',
    method: '',
    currency: '',
  });

  async function fetchPayments() {
    const res = await fetch('http://localhost:8080/api/payments');
    const data = await res.json();
    setPayments(data);
  }

  const fetchAppointments = async () => {
    const res = await fetch('http://localhost:8080/api/appointments');
    const data = await res.json();
    setAppointments(data);
  };

  useEffect(() => {
    fetchPayments();
    fetchAppointments();
  }, []);

  const handleEdit = (payment) => {
    setEditMode(true);
    setSelectedPaymentId(payment.id);
    setNewPayment({
      appointment: { appointmentId: payment.appointment.appointmentId },
      amount: payment.amount,
      method: payment.method,
      currency: payment.currency,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this payment?')) return;
    await fetch(`http://localhost:8080/api/payments/${id}`, { method: 'DELETE' });
    await fetchPayments();
    Swal.fire({ icon: 'success', title: 'Deleted', timer: 1500, showConfirmButton: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editMode
      ? `http://localhost:8080/api/payments/${selectedPaymentId}`
      : 'http://localhost:8080/api/payments';

    const method = editMode ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPayment),
    });

    if (res.ok) {
      setNewPayment({ appointment: { appointmentId: '' }, amount: '', method: '', currency: '' });
      setEditMode(false);
      setIsModalOpen(false);
      setSelectedPaymentId(null);
      await fetchPayments();
      Swal.fire({ icon: 'success', title: editMode ? 'Updated' : 'Added', timer: 1500, showConfirmButton: false });
    }
  };

  const filtered = payments.filter((p) => {
    const term = search.toLowerCase();
    return (
      (p.appointment?.doctor?.fullName?.toLowerCase() || '').includes(term) ||
      (p.appointment?.patient?.fullName?.toLowerCase() || '').includes(term) ||
      (p.method?.toLowerCase() || '').includes(term) ||
      (p.currency?.toLowerCase() || '').includes(term) ||
      (p.amount?.toString().toLowerCase() || '').includes(term) ||
      (p.reference?.toLowerCase() || '').includes(term) ||
      (p.paidAt?.toLowerCase() || '').includes(term)
    );
  });

  return (
    <motion.div className="p-6 space-y-6 min-h-screen bg-white">
      <div className="bg-gray-100 shadow-2xl rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black">Payments</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search payments..."
                className="bg-white text-black border border-black rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-black" size={18} />
            </div>
            <button
              onClick={() => {
                setEditMode(false);
                setNewPayment({ appointment: { appointmentId: '' }, amount: '', method: '', currency: '' });
                setIsModalOpen(true);
              }}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              New Payment
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-400 border border-gray-300">
            <thead className="bg-gray-300">
              <tr>
                {['ID', 'Patient', 'Doctor', 'Amount', 'Method', 'Reference', 'Paid At', 'Actions'].map((head) => (
                  <th key={head} className="px-4 py-2 text-left text-sm font-medium text-black uppercase">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((p) => (
                <tr key={p.id} className="bg-white">
                  <td className="px-4 py-2 text-sm text-black">{p.id}</td>
                  <td className="px-4 py-2 text-sm text-black">{p.appointment?.patient?.fullName}</td>
                  <td className="px-4 py-2 text-sm text-black">{p.appointment?.doctor?.fullName}</td>
                  <td className="px-4 py-2 text-sm text-black">
                    {`${p.currency} ${Number(p.amount).toFixed(2)}`}
                  </td>
                  <td className="px-4 py-2 text-sm text-black">{p.method}</td>
                  <td className="px-4 py-2 text-sm text-black">{p.reference}</td>
                  <td className="px-4 py-2 text-sm text-black">
                    {new Date(p.paidAt).toLocaleString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    }).replace(',', '')}
                  </td>
                  <td className="px-4 py-2 text-sm text-black flex space-x-2">
                    <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-800">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={18} />
                    </button>
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
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="bg-white text-black p-6 rounded-xl shadow-lg w-[500px] relative"
          >
            <button
              onClick={() => {
                setIsModalOpen(false);
                setEditMode(false);
                setSelectedPaymentId(null);
              }}
              className="absolute top-4 right-4 p-2 bg-gray-400 hover:bg-gray-300 rounded-full"
            >
              <X className="w-5 h-5 text-black" />
            </button>

            <h2 className="text-2xl font-bold mb-4 text-center">{editMode ? 'Edit Payment' : 'New Payment'}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-semibold">Appointment</label>
                <select
                  value={newPayment.appointment.appointmentId}
                  onChange={(e) =>
                    setNewPayment({ ...newPayment, appointment: { appointmentId: e.target.value } })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-white text-black"
                >
                  <option value="">Select Appointment</option>
                  {appointments.map((a) => (
                    <option key={a.appointmentId} value={a.appointmentId}>
                      {`${a.patient?.fullName} with ${a.doctor?.fullName}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-semibold">Amount</label>
                <input
                  type="number"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-white text-black"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold">Method</label>
                <select
                  value={newPayment.method}
                  onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-white text-black"
                >
                  <option value="">Select Method</option>
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Mobile">Mobile</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-semibold">Currency</label>
                <select
                  value={newPayment.currency}
                  onChange={(e) => setNewPayment({ ...newPayment, currency: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-white text-black"
                >
                  <option value="">Select Currency</option>
                  <option value="USD">USD</option>\
                  <option value="SOS">SOS</option>
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
