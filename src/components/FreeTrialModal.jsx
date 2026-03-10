import React, { useState } from 'react';

const FreeTrialModal = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch('/api/trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setSuccess(true);
        setForm({ name: '', email: '', phone: '', company: '' });
      } else {
        const data = await res.json();
        setError(data.message || 'Submission failed');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
        <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-bold mb-4 text-[#286323]">Start Your Free Trial</h2>
        {success ? (
          <div className="text-green-600 font-semibold mb-4">Thank you! We will contact you soon.</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="name" value={form.name} onChange={handleChange} required placeholder="Your Name" className="w-full border rounded-lg px-4 py-2" />
            <input name="email" value={form.email} onChange={handleChange} required type="email" placeholder="Email" className="w-full border rounded-lg px-4 py-2" />
            <input name="phone" value={form.phone} onChange={handleChange} required placeholder="Phone" className="w-full border rounded-lg px-4 py-2" />
            <input name="company" value={form.company} onChange={handleChange} required placeholder="Company Name" className="w-full border rounded-lg px-4 py-2" />
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button type="submit" className="w-full bg-[#286323] text-white font-semibold py-2 rounded-lg" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default FreeTrialModal;
