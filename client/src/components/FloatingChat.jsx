import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getMyMessages, replyToMyMessage, deleteMyMessage } from '../api/messages';

function FloatingChat() {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [replying, setReplying] = useState(null);
  const [seenReplies, setSeenReplies] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sc_seen_replies') || '{}'); }
    catch { return {}; }
  });

  const markSeen = (msgId, adminCount) => {
    const updated = { ...seenReplies, [msgId]: adminCount };
    setSeenReplies(updated);
    localStorage.setItem('sc_seen_replies', JSON.stringify(updated));
  };

  const fetchMessages = async () => {
    try {
      const { data } = await getMyMessages();
      setMessages(data);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  // Initial load with spinner
  useEffect(() => {
    if (!isAuthenticated || isAdmin) return;
    setLoading(true);
    getMyMessages()
      .then(({ data }) => setMessages(data))
      .catch((err) => console.error('Failed to load messages:', err))
      .finally(() => setLoading(false));
  }, [isAuthenticated, isAdmin]);

  // Background polling (keeps badge count current even when closed)
  useEffect(() => {
    if (!isAuthenticated || isAdmin) return;
    const interval = setInterval(fetchMessages, 15000);
    return () => clearInterval(interval);
  }, [isAuthenticated, isAdmin]);

  // Immediate refresh whenever chat is opened
  useEffect(() => {
    if (open && isAuthenticated && !isAdmin) fetchMessages();
  }, [open, isAuthenticated, isAdmin]);

  // Don't render for guests or admins
  if (!isAuthenticated || isAdmin) return null;

  const newReplyCount = messages.reduce((sum, m) => {
    const adminReplies = (m.replies || []).filter((r) => !r.isUser).length;
    return sum + Math.max(0, adminReplies - (seenReplies[m._id] || 0));
  }, 0);

  const getOrderStatus = (msg) => {
    if (msg.type !== 'order' || !msg.replies?.length) return null;
    const adminReplies = msg.replies.filter((r) => !r.isUser);
    const combined = adminReplies.map((r) => r.text).join(' ');
    if (combined.includes('has been delivered')) return 'delivered';
    if (combined.includes('has been cancelled')) return 'cancelled';
    return null;
  };

  const handleDeleteChat = async (id) => {
    try {
      await deleteMyMessage(id);
      setMessages((prev) => prev.filter((m) => m._id !== id));
      setExpanded(null);
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  const handleSendReply = async (id) => {
    const text = (replyText[id] || '').trim();
    if (!text) return;
    setReplying(id);
    try {
      const { data } = await replyToMyMessage(id, text);
      setMessages((prev) => prev.map((m) => (m._id === id ? data : m)));
      setReplyText((prev) => ({ ...prev, [id]: '' }));
    } catch (err) {
      console.error('Failed to send reply:', err);
    } finally {
      setReplying(null);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-sakura-400 hover:bg-sakura-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
        {!open && newReplyCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {newReplyCount}
          </span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-20 right-4 left-4 sm:bottom-24 sm:left-auto sm:right-6 z-50 sm:w-[360px] max-h-[70vh] sm:max-h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-sakura-400 text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <span className="font-semibold text-sm">My Messages</span>
            </div>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
              {messages.length}
            </span>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8 text-gray-400 text-sm">Loading...</div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8 px-4">
                <svg className="w-12 h-12 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-sm text-gray-500">No messages yet</p>
                <p className="text-xs text-gray-400 mt-1">Messages from Contact & Request will show here.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {messages.map((msg) => (
                  <div key={msg._id}>
                    {/* Message header */}
                    <div
                      onClick={() => {
                        const next = expanded === msg._id ? null : msg._id;
                        setExpanded(next);
                        if (next) {
                          const adminCount = (msg.replies || []).filter((r) => !r.isUser).length;
                          markSeen(msg._id, adminCount);
                        }
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-sakura-50/30 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                          msg.type === 'contact'
                            ? 'bg-blue-100 text-blue-600'
                            : msg.type === 'order'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-purple-100 text-purple-600'
                        }`}>
                          {msg.type === 'contact' ? 'C' : msg.type === 'order' ? 'O' : 'R'}
                        </span>
                        <span className="text-sm font-medium text-dark truncate flex-1">
                          {msg.type === 'contact' || msg.type === 'order' ? msg.subject : msg.itemName}
                        </span>
                        {(() => {
                          const adminReplies = (msg.replies || []).filter((r) => !r.isUser).length;
                          const unseen = Math.max(0, adminReplies - (seenReplies[msg._id] || 0));
                          if (unseen > 0) return (
                            <span className="flex-shrink-0 w-5 h-5 bg-green-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                              {unseen}
                            </span>
                          );
                          if (adminReplies > 0) return (
                            <span className="flex-shrink-0 w-5 h-5 bg-green-100 text-green-600 text-[10px] font-bold rounded-full flex items-center justify-center">
                              {adminReplies}
                            </span>
                          );
                          return null;
                        })()}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteChat(msg._id); }}
                          className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-gray-300 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <svg
                          className={`w-3.5 h-3.5 text-gray-400 flex-shrink-0 transition-transform ${expanded === msg._id ? 'rotate-180' : ''}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5 ml-7">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Expanded content */}
                    {expanded === msg._id && (
                      <div className="px-4 pb-3 space-y-2">
                        {/* Original message */}
                        <div className="bg-gray-50 rounded-lg p-2.5 text-xs space-y-1">
                          {msg.type === 'contact' || msg.type === 'order' ? (
                            <p className="text-gray-600 whitespace-pre-wrap">{msg.message}</p>
                          ) : (
                            <>
                              <div><span className="font-medium text-dark">Item:</span> {msg.itemName}</div>
                              {msg.category && <div><span className="font-medium text-dark">Category:</span> {msg.category}</div>}
                              <p className="text-gray-600 whitespace-pre-wrap">{msg.description}</p>
                              {msg.budget && <div><span className="font-medium text-dark">Budget:</span> {msg.budget}</div>}
                            </>
                          )}
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {msg.attachments.map((file, i) => (
                                <a
                                  key={i}
                                  href={file}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] px-2 py-1 bg-white border border-gray-200 rounded text-sakura-400 hover:border-sakura-300"
                                >
                                  {file.split('/').pop()}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Replies thread */}
                        {msg.replies && msg.replies.length > 0 ? (
                          msg.replies.map((reply, i) => (
                            reply.isUser ? (
                              /* User reply — right aligned */
                              <div key={i} className="flex justify-end">
                                <div className="max-w-[85%] bg-sakura-400 rounded-lg rounded-tr-none p-2.5">
                                  <p className="text-xs text-white whitespace-pre-wrap">{reply.text}</p>
                                  <p className="text-[10px] text-white/70 mt-1 text-right">
                                    {new Date(reply.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              /* Admin reply — left aligned */
                              <div key={i} className="bg-sakura-50/60 border border-sakura-100 rounded-lg p-2.5">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-[10px] font-semibold text-sakura-500">{reply.adminName}</span>
                                  <span className="text-[10px] text-gray-400">
                                    {new Date(reply.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-700 whitespace-pre-wrap">{reply.text}</p>
                              </div>
                            )
                          ))
                        ) : (
                          <div className="text-center py-2 text-[11px] text-gray-400">
                            No reply yet — we'll get back to you soon!
                          </div>
                        )}

                        {/* User reply input */}
                        <div className="flex gap-2 pt-1">
                          <input
                            type="text"
                            value={replyText[msg._id] || ''}
                            onChange={(e) => setReplyText((prev) => ({ ...prev, [msg._id]: e.target.value }))}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSendReply(msg._id); }}
                            placeholder="Type a reply…"
                            className="flex-1 min-w-0 text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sakura-300"
                          />
                          <button
                            onClick={() => handleSendReply(msg._id)}
                            disabled={replying === msg._id}
                            className="flex-shrink-0 px-3 py-2 bg-sakura-400 hover:bg-sakura-500 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
                          >
                            Send
                          </button>
                        </div>

                        {/* Order Again button for cancelled orders */}
                        {getOrderStatus(msg) === 'cancelled' && (
                          <button
                            onClick={() => { setOpen(false); navigate('/'); }}
                            className="w-full text-xs font-medium py-2 rounded-lg bg-sakura-50 text-sakura-500 hover:bg-sakura-100 transition-colors"
                          >
                            Order Again
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default FloatingChat;
