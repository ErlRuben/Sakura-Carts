import { useState } from 'react';
import { toggleMessageRead, deleteMessage, replyToMessage } from '../../api/messages';

function MessageTable({ messages, onUpdate }) {
  const [expanded, setExpanded] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);

  if (messages.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No messages yet.
      </div>
    );
  }

  const handleToggleRead = async (id) => {
    try {
      await toggleMessageRead(id);
      onUpdate();
    } catch (err) {
      console.error('Failed to toggle read:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
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
    <div className="divide-y divide-gray-100">
      {messages.map((msg) => (
        <div
          key={msg._id}
          className={`p-4 hover:bg-sakura-50/50 transition-colors ${!msg.read ? 'bg-sakura-50/30' : ''}`}
        >
          {/* Header row */}
          <div className="flex items-start justify-between gap-4">
            <button
              onClick={() => setExpanded(expanded === msg._id ? null : msg._id)}
              className="flex-1 text-left"
            >
              <div className="flex items-center gap-2 flex-wrap">
                {!msg.read && (
                  <span className="w-2 h-2 rounded-full bg-sakura-400 flex-shrink-0" />
                )}
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  msg.type === 'contact'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {msg.type === 'contact' ? 'Contact' : 'Request'}
                </span>
                <span className="text-sm font-medium text-dark">{msg.name}</span>
                <span className="text-xs text-gray-400">{msg.email}</span>
                {msg.replies && msg.replies.length > 0 && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                    {msg.replies.length} {msg.replies.length === 1 ? 'reply' : 'replies'}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1 truncate">
                {msg.type === 'contact'
                  ? msg.subject
                  : msg.itemName}
              </p>
            </button>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-gray-400">
                {new Date(msg.createdAt).toLocaleDateString()}
              </span>
              <button
                onClick={() => handleToggleRead(msg._id)}
                title={msg.read ? 'Mark as unread' : 'Mark as read'}
                className="p-1 text-gray-400 hover:text-sakura-400 transition-colors"
              >
                <svg className="w-4 h-4" fill={msg.read ? 'none' : 'currentColor'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                onClick={() => handleDelete(msg._id)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Expanded details */}
          {expanded === msg._id && (
            <div className="mt-3 ml-4 p-3 bg-gray-50 rounded-lg text-sm space-y-2">
              {msg.type === 'contact' ? (
                <>
                  <div><span className="font-medium text-dark">Subject:</span> {msg.subject}</div>
                  <div><span className="font-medium text-dark">Message:</span></div>
                  <p className="text-gray-600 whitespace-pre-wrap">{msg.message}</p>
                </>
              ) : (
                <>
                  <div><span className="font-medium text-dark">Item:</span> {msg.itemName}</div>
                  {msg.category && <div><span className="font-medium text-dark">Category:</span> {msg.category}</div>}
                  <div><span className="font-medium text-dark">Description:</span></div>
                  <p className="text-gray-600 whitespace-pre-wrap">{msg.description}</p>
                  {msg.budget && <div><span className="font-medium text-dark">Budget:</span> {msg.budget}</div>}
                  {msg.referenceUrl && (
                    <div>
                      <span className="font-medium text-dark">Reference:</span>{' '}
                      <a href={msg.referenceUrl} target="_blank" rel="noopener noreferrer" className="text-sakura-400 hover:underline">
                        {msg.referenceUrl}
                      </a>
                    </div>
                  )}
                </>
              )}

              {/* Attachments */}
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="pt-2 border-t border-gray-200">
                  <span className="font-medium text-dark">Attachments:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {msg.attachments.map((file, i) => {
                      const filename = file.split('/').pop();
                      const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file);
                      return (
                        <a
                          key={i}
                          href={file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-600 hover:border-sakura-300 hover:text-sakura-500 transition-colors"
                        >
                          {isImage ? (
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          ) : (
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                          )}
                          {filename}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Replies */}
              {msg.replies && msg.replies.length > 0 && (
                <div className="pt-2 border-t border-gray-200 space-y-2">
                  <span className="font-medium text-dark">Replies:</span>
                  {msg.replies.map((reply, i) => (
                    <div key={i} className="bg-white border border-sakura-100 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-sakura-500">{reply.adminName}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(reply.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-1 whitespace-pre-wrap">{reply.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply form */}
              <div className="pt-2 border-t border-gray-200">
                {replyingTo === msg._id ? (
                  <div className="space-y-2">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply..."
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sakura-300 focus:border-sakura-400 outline-none resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReply(msg._id)}
                        disabled={replying || !replyText.trim()}
                        className="px-4 py-1.5 bg-sakura-400 text-white text-xs font-medium rounded-lg hover:bg-sakura-500 disabled:opacity-50 transition-colors"
                      >
                        {replying ? 'Sending...' : 'Send Reply'}
                      </button>
                      <button
                        onClick={() => { setReplyingTo(null); setReplyText(''); }}
                        className="px-4 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setReplyingTo(msg._id)}
                    className="flex items-center gap-1.5 text-xs font-medium text-sakura-400 hover:text-sakura-500 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                    Reply
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default MessageTable;
