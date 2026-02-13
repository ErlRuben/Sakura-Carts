import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getMyMessages } from '../api/messages';

function FloatingChat() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data } = await getMyMessages();
      setMessages(data);
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && isAuthenticated && !isAdmin) {
      fetchMessages();
    }
  }, [open, isAuthenticated, isAdmin]);

  // Don't render for guests or admins
  if (!isAuthenticated || isAdmin) return null;

  const replyCount = messages.reduce((sum, m) => sum + (m.replies?.length || 0), 0);

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
        {!open && replyCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {replyCount}
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
                    <button
                      onClick={() => setExpanded(expanded === msg._id ? null : msg._id)}
                      className="w-full text-left px-4 py-3 hover:bg-sakura-50/30 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                          msg.type === 'contact'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-purple-100 text-purple-600'
                        }`}>
                          {msg.type === 'contact' ? 'C' : 'R'}
                        </span>
                        <span className="text-sm font-medium text-dark truncate flex-1">
                          {msg.type === 'contact' ? msg.subject : msg.itemName}
                        </span>
                        {msg.replies && msg.replies.length > 0 && (
                          <span className="flex-shrink-0 w-5 h-5 bg-green-100 text-green-600 text-[10px] font-bold rounded-full flex items-center justify-center">
                            {msg.replies.length}
                          </span>
                        )}
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
                    </button>

                    {/* Expanded content */}
                    {expanded === msg._id && (
                      <div className="px-4 pb-3 space-y-2">
                        {/* Original message */}
                        <div className="bg-gray-50 rounded-lg p-2.5 text-xs space-y-1">
                          {msg.type === 'contact' ? (
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

                        {/* Admin replies */}
                        {msg.replies && msg.replies.length > 0 ? (
                          msg.replies.map((reply, i) => (
                            <div key={i} className="bg-sakura-50/60 border border-sakura-100 rounded-lg p-2.5">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-semibold text-sakura-500">{reply.adminName}</span>
                                <span className="text-[10px] text-gray-400">
                                  {new Date(reply.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-xs text-gray-700 whitespace-pre-wrap">{reply.text}</p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-2 text-[11px] text-gray-400">
                            No reply yet — we'll get back to you soon!
                          </div>
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
