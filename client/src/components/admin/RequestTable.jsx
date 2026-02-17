import { useState } from 'react';
import { updateMessageStatus, replyToMessage, deleteMessage, toggleMessageRead } from '../../api/messages';

const REQUEST_STATUSES = ['pending', 'reviewing', 'available', 'unavailable'];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  reviewing: 'bg-blue-100 text-blue-800',
  available: 'bg-green-100 text-green-800',
  unavailable: 'bg-red-100 text-red-800',
};

function RequestTable({ requests, onUpdate }) {
  const [expanded, setExpanded] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [chatOpenId, setChatOpenId] = useState(null);

  if (requests.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No requests yet.
      </div>
    );
  }

  const handleStatusChange = async (id, status) => {
    try {
      await updateMessageStatus(id, status);
      onUpdate();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleToggleRead = async (id) => {
    try {
      await toggleMessageRead(id);
      onUpdate();
    } catch (err) {
      console.error('Failed to toggle read:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this request?')) return;
    try {
      await deleteMessage(id);
      onUpdate();
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const handleReply = async (id) => {
    if (!replyText.trim()) return;
    setReplying(true);
    try {
      await replyToMessage(id, replyText);
      setReplyText('');
      setReplyingTo(null);
      onUpdate();
    } catch (err) {
      console.error('Failed to reply:', err);
    } finally {
      setReplying(false);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-sakura-100">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Request ID</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Customer</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Item Name</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Category</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        {requests.map((req) => (
          <tbody key={req._id}>
            <tr
              className={`border-b border-gray-100 cursor-pointer hover:bg-sakura-50/50 ${!req.read ? 'bg-sakura-50/20' : ''} ${expanded === req._id ? 'bg-sakura-50/30' : ''}`}
              onClick={() => { setExpanded(expanded === req._id ? null : req._id); setChatOpenId(null); }}
            >
              <td className="py-3 px-4 text-sm font-mono text-gray-600">
                <div className="flex items-center gap-1.5">
                  <svg
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform flex-shrink-0 ${expanded === req._id ? 'rotate-90' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  {!req.read && (
                    <span className="w-1.5 h-1.5 rounded-full bg-sakura-400 flex-shrink-0" />
                  )}
                  {req._id.slice(-8)}
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="text-sm font-medium text-dark">{req.name}</div>
                <div className="text-xs text-gray-500">{req.email}</div>
              </td>
              <td className="py-3 px-4 text-sm text-gray-700 font-medium max-w-[160px]">
                <span className="truncate block">{req.itemName}</span>
              </td>
              <td className="py-3 px-4 text-sm text-gray-500">
                {req.category || <span className="text-gray-300">—</span>}
              </td>
              <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                <select
                  value={req.status || 'pending'}
                  onChange={(e) => handleStatusChange(req._id, e.target.value)}
                  className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${statusColors[req.status] || statusColors.pending}`}
                >
                  {REQUEST_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </td>
              <td className="py-3 px-4 text-sm text-gray-500">
                {new Date(req.createdAt).toLocaleDateString()}
              </td>
              <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleRead(req._id)}
                    title={req.read ? 'Mark as unread' : 'Mark as read'}
                    className="p-1.5 text-gray-400 hover:text-sakura-400 transition-colors"
                  >
                    <svg className="w-4 h-4" fill={req.read ? 'none' : 'currentColor'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(req._id)}
                    title="Delete request"
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>

            {/* Expanded detail row */}
            {expanded === req._id && (
              <tr className="border-b border-gray-100 bg-white">
                <td colSpan={7} className="px-4 pb-4 pt-2">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Left: Request Details */}
                    <div className="flex-1">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Request Details</h4>
                      <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                        {req.description && (
                          <div>
                            <span className="font-medium text-dark">Description:</span>
                            <p className="text-gray-600 whitespace-pre-wrap mt-0.5">{req.description}</p>
                          </div>
                        )}
                        {req.budget && (
                          <div>
                            <span className="font-medium text-dark">Budget:</span>{' '}
                            <span className="text-gray-600">{req.budget}</span>
                          </div>
                        )}
                        {req.referenceUrl && (
                          <div>
                            <span className="font-medium text-dark">Reference:</span>{' '}
                            <a
                              href={req.referenceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sakura-400 hover:underline text-xs break-all"
                            >
                              {req.referenceUrl}
                            </a>
                          </div>
                        )}
                        {req.attachments && req.attachments.length > 0 && (
                          <div>
                            <span className="font-medium text-dark">Attachments:</span>
                            <div className="flex flex-wrap gap-2 mt-1.5">
                              {req.attachments.map((file, i) => {
                                const filename = file.split('/').pop();
                                const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file);
                                return isImage ? (
                                  <button
                                    key={i}
                                    onClick={() => setPreviewImage(file)}
                                    className="relative group w-16 h-16 rounded-lg overflow-hidden border border-gray-200 hover:border-sakura-300 transition-colors flex-shrink-0"
                                  >
                                    <img src={file} alt={filename} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                      <svg className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                      </svg>
                                    </div>
                                  </button>
                                ) : (
                                  <a
                                    key={i}
                                    href={file}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-600 hover:border-sakura-300 hover:text-sakura-500 transition-colors"
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                    </svg>
                                    {filename}
                                  </a>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Chat thread */}
                    <div className="md:w-72 flex-shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); setChatOpenId(chatOpenId === req._id ? null : req._id); }}
                        className="flex items-center gap-2 mb-2 w-full text-left group"
                      >
                        <h4 className="text-xs font-semibold text-gray-500 uppercase">Chat</h4>
                        {req.replies?.length > 0 && (
                          <span className="text-xs text-gray-400">({req.replies.length})</span>
                        )}
                        <svg
                          className={`w-3.5 h-3.5 text-gray-400 ml-auto transition-transform ${chatOpenId === req._id ? 'rotate-90' : ''}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      {chatOpenId === req._id && <div className="space-y-2">
                        {req.replies && req.replies.length > 0 ? (
                          req.replies.map((reply, i) => (
                            reply.isUser ? (
                              <div key={i} className="flex justify-end">
                                <div className="max-w-[85%] bg-gray-100 rounded-lg rounded-tr-none p-2.5">
                                  <p className="text-xs text-gray-700 whitespace-pre-wrap">{reply.text}</p>
                                  <p className="text-[10px] text-gray-400 mt-1 text-right">
                                    {reply.userName} · {new Date(reply.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div key={i} className="bg-sakura-50 border border-sakura-100 rounded-lg p-2.5">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-medium text-sakura-500">{reply.adminName}</span>
                                  <span className="text-xs text-gray-400">
                                    {new Date(reply.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-600 whitespace-pre-wrap">{reply.text}</p>
                              </div>
                            )
                          ))
                        ) : (
                          <p className="text-xs text-gray-400 py-2">No replies yet.</p>
                        )}

                        {replyingTo === req._id ? (
                          <div className="space-y-1.5 pt-1" onClick={(e) => e.stopPropagation()}>
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Type your reply..."
                              rows={3}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-sakura-300 focus:border-sakura-400 outline-none resize-none"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleReply(req._id)}
                                disabled={replying || !replyText.trim()}
                                className="px-3 py-1.5 bg-sakura-400 text-white text-xs font-medium rounded-lg hover:bg-sakura-500 disabled:opacity-50 transition-colors"
                              >
                                {replying ? 'Sending...' : 'Send Reply'}
                              </button>
                              <button
                                onClick={() => { setReplyingTo(null); setReplyText(''); }}
                                className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => { e.stopPropagation(); setReplyingTo(req._id); }}
                            className="flex items-center gap-1.5 text-xs font-medium text-sakura-400 hover:text-sakura-500 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                            Reply
                          </button>
                        )}
                      </div>}
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        ))}
      </table>

      {/* Image lightbox */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
        >
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={previewImage}
            alt="Preview"
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain"
          />
        </div>
      )}
    </div>
  );
}

export default RequestTable;
