import { useState } from 'react';
import { sendMessage } from '../api/messages';

function RequestPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    itemName: '',
    category: '',
    description: '',
    budget: '',
    referenceUrl: '',
  });
  const [files, setFiles] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await sendMessage({ ...form, type: 'request' }, files);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-sakura-50 rounded-2xl p-10">
          <span className="text-5xl">🌸</span>
          <h2 className="text-2xl font-bold text-sakura-400 mt-4">
            Request Submitted!
          </h2>
          <p className="text-gray-600 mt-3">
            Thank you for your request. We&apos;ll review it and get back to you
            via email within 2–3 business days.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setForm({ name: '', email: '', itemName: '', category: '', description: '', budget: '', referenceUrl: '' });
              setFiles([]);
            }}
            className="btn-primary mt-6"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-sakura-400">Item Request</h1>
      <p className="text-gray-600 mt-2">
        Can&apos;t find what you&apos;re looking for? Submit a request and we&apos;ll
        try to source it for you from Japan.
      </p>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-dark mb-1">Your Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-sakura-300 focus:border-sakura-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark mb-1">Email *</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-sakura-300 focus:border-sakura-400 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-dark mb-1">Item Name *</label>
            <input
              name="itemName"
              value={form.itemName}
              onChange={handleChange}
              required
              placeholder="e.g. Matcha Kit Kat"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-sakura-300 focus:border-sakura-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-sakura-300 focus:border-sakura-400 outline-none bg-white"
            >
              <option value="">Select a category</option>
              <option>Snacks & Sweets</option>
              <option>Beverages</option>
              <option>Stationery</option>
              <option>Home & Decor</option>
              <option>Fashion & Accessories</option>
              <option>Traditional Crafts</option>
              <option>Beauty & Skincare</option>
              <option>Toys & Figures</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-dark mb-1">Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Describe the item you're looking for, including any specific details like size, color, brand, etc."
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-sakura-300 focus:border-sakura-400 outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-dark mb-1">Budget Range</label>
            <input
              name="budget"
              value={form.budget}
              onChange={handleChange}
              placeholder="e.g. $10 - $30"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-sakura-300 focus:border-sakura-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark mb-1">Reference URL</label>
            <input
              name="referenceUrl"
              value={form.referenceUrl}
              onChange={handleChange}
              placeholder="Link to the item online"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-sakura-300 focus:border-sakura-400 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-dark mb-1">Attachments</label>
          <input
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.txt,.zip"
            onChange={(e) => setFiles([...e.target.files])}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-sakura-50 file:text-sakura-600 hover:file:bg-sakura-100 file:cursor-pointer"
          />
          {files.length > 0 && (
            <p className="text-xs text-gray-400 mt-1">
              {files.length} file{files.length !== 1 ? 's' : ''} selected
            </p>
          )}
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
}

export default RequestPage;
