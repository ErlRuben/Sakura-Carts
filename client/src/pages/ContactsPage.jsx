import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { sendMessage } from '../api/messages';

function ContactsPage() {
  const { isAuthenticated, user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    subject: '',
    message: '',
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
      await sendMessage({ ...form, type: 'contact' }, files);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-sakura-400">Contact Us</h1>
      <p className="text-gray-600 mt-2">
        Have a question, suggestion, or just want to say hello? We&apos;d love to
        hear from you.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="bg-sakura-50 rounded-xl p-6">
            <h3 className=" font-bold text-dark text-lg">Get in Touch</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-sakura-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-dark">Email</p>
                  <p className="text-gray-600 text-sm">support@sakuracarts.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-sakura-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-dark">Business Hours</p>
                  <p className="text-gray-600 text-sm">Mon – Fri: 9:00 AM – 6:00 PM (JST)</p>
                  <p className="text-gray-600 text-sm">Sat – Sun: 10:00 AM – 4:00 PM (JST)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-sakura-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-dark">Location</p>
                  <p className="text-gray-600 text-sm">Tokyo, Japan</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-sakura-50 rounded-xl p-6">
            <h3 className="font-bold text-dark text-lg">Follow Us</h3>
            <div className="flex items-center gap-4 mt-3">
              <span className="w-10 h-10 rounded-full bg-sakura-200 flex items-center justify-center text-sakura-700 font-bold text-sm">FB</span>
              <span className="w-10 h-10 rounded-full bg-sakura-200 flex items-center justify-center text-sakura-700 font-bold text-sm">IG</span>
              <span className="w-10 h-10 rounded-full bg-sakura-200 flex items-center justify-center text-sakura-700 font-bold text-sm">TW</span>
              <span className="w-10 h-10 rounded-full bg-sakura-200 flex items-center justify-center text-sakura-700 font-bold text-sm">TT</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          {submitted ? (
            <div className="bg-sakura-50 rounded-2xl p-10 text-center h-full flex flex-col items-center justify-center">
              <span className="text-5xl">✉️</span>
              <h2 className="text-xl font-bold text-dark mt-4">
                Message Sent!
              </h2>
              <p className="text-gray-600 mt-2">
                Thank you for reaching out. We&apos;ll get back to you as soon as
                possible.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name: user?.name || '', email: user?.email || '', subject: '', message: '' });
                  setFiles([]);
                }}
                className="btn-secondary mt-4"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  readOnly={isAuthenticated}
                  className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none ${
                    isAuthenticated
                      ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
                      : 'focus:ring-2 focus:ring-sakura-300 focus:border-sakura-400'
                  }`}
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
                  readOnly={isAuthenticated}
                  className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none ${
                    isAuthenticated
                      ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
                      : 'focus:ring-2 focus:ring-sakura-300 focus:border-sakura-400'
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Subject *</label>
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-sakura-300 focus:border-sakura-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Message *</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-sakura-300 focus:border-sakura-400 outline-none resize-none"
                />
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
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContactsPage;
