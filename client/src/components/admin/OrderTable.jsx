import { useState } from 'react';
import { formatCurrency } from '../../utils/formatCurrency';
import { ORDER_STATUSES } from '../../utils/constants';
import { updateOrderStatus } from '../../api/orders';
import { replyToMessage } from '../../api/messages';

function OrderTable({ orders, messages = [], onStatusUpdate, onArchive, onDelete, onEdit }) {
  const [expanded, setExpanded] = useState(null);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);
  const [chatOpenId, setChatOpenId] = useState(null);

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No orders yet.
      </div>
    );
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      onStatusUpdate();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const startEdit = (order) => {
    setEditing(order._id);
    setEditForm({ ...order.shippingInfo });
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditForm({});
  };

  const saveEdit = (orderId) => {
    onEdit(orderId, { shippingInfo: editForm }, () => {
      setEditing(null);
      setEditForm({});
    });
  };

  const handleReply = async (msgId) => {
    if (!replyText.trim()) return;
    setReplying(true);
    try {
      await replyToMessage(msgId, replyText);
      setReplyText('');
      setReplyingTo(null);
      onStatusUpdate();
    } catch (err) {
      console.error('Failed to reply:', err);
    } finally {
      setReplying(false);
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-sakura-100">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Order ID</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Customer</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Items</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Total</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
          {orders.map((order) => (
            <tbody key={order._id}>
              <tr
                className={`border-b border-gray-100 cursor-pointer hover:bg-sakura-50/50 ${expanded === order._id ? 'bg-sakura-50/30' : ''}`}
                onClick={() => { setExpanded(expanded === order._id ? null : order._id); setChatOpenId(null); }}
              >
                <td className="py-3 px-4 text-sm font-mono text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <svg
                      className={`w-3.5 h-3.5 text-gray-400 transition-transform flex-shrink-0 ${expanded === order._id ? 'rotate-90' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {order._id.slice(-8)}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm font-medium text-dark">{order.shippingInfo.fullName}</div>
                  <div className="text-xs text-gray-500">{order.shippingInfo.email}</div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                </td>
                <td className="py-3 px-4 font-medium">
                  {formatCurrency(order.totalAmount)}
                </td>
                <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${statusColors[order.status]}`}
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-3 px-4 text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1">
                    {/* Archive/Unarchive */}
                    <button
                      onClick={() => onArchive(order._id)}
                      title={order.archived ? 'Unarchive' : 'Archive'}
                      className="p-1.5 text-gray-400 hover:text-sakura-400 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {order.archived ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4l3 3m0 0l3-3m-3 3V9" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        )}
                      </svg>
                    </button>
                    {/* Delete */}
                    <button
                      onClick={() => onDelete(order._id)}
                      title="Delete order"
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
              {expanded === order._id && (
                <tr className="border-b border-gray-100 bg-white">
                  <td colSpan={7} className="px-4 pb-4 pt-2">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Ordered Items */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase">Ordered Items</h4>
                        </div>
                        <div className="space-y-2">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-10 h-10 rounded object-cover flex-shrink-0"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-dark truncate">{item.name}</p>
                                <p className="text-xs text-gray-500">
                                  {formatCurrency(item.price)} x {item.quantity}
                                </p>
                              </div>
                              <span className="text-sm font-medium text-dark flex-shrink-0">
                                {formatCurrency(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping Info */}
                      <div className="md:w-64 flex-shrink-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase">Shipping Address</h4>
                          {editing !== order._id && (
                            <button
                              onClick={(e) => { e.stopPropagation(); startEdit(order); }}
                              className="text-xs font-medium text-sakura-400 hover:text-sakura-500 transition-colors flex items-center gap-1"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                          )}
                        </div>

                        {editing === order._id ? (
                          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                            <input
                              type="text"
                              value={editForm.fullName || ''}
                              onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                              placeholder="Full Name"
                              className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:ring-2 focus:ring-sakura-300 focus:border-sakura-400 outline-none"
                            />
                            <input
                              type="email"
                              value={editForm.email || ''}
                              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                              placeholder="Email"
                              className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:ring-2 focus:ring-sakura-300 focus:border-sakura-400 outline-none"
                            />
                            <input
                              type="text"
                              value={editForm.address || ''}
                              onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                              placeholder="Address"
                              className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:ring-2 focus:ring-sakura-300 focus:border-sakura-400 outline-none"
                            />
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={editForm.city || ''}
                                onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                                placeholder="City"
                                className="min-w-0 flex-1 text-sm border border-gray-300 rounded px-2 py-1.5 focus:ring-2 focus:ring-sakura-300 focus:border-sakura-400 outline-none"
                              />
                              <input
                                type="text"
                                value={editForm.postalCode || ''}
                                onChange={(e) => setEditForm({ ...editForm, postalCode: e.target.value })}
                                placeholder="Postal Code"
                                className="min-w-0 w-20 text-sm border border-gray-300 rounded px-2 py-1.5 focus:ring-2 focus:ring-sakura-300 focus:border-sakura-400 outline-none"
                              />
                            </div>
                            <input
                              type="text"
                              value={editForm.country || ''}
                              onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                              placeholder="Country"
                              className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:ring-2 focus:ring-sakura-300 focus:border-sakura-400 outline-none"
                            />
                            <div className="flex gap-2 pt-1">
                              <button
                                onClick={() => saveEdit(order._id)}
                                className="flex-1 text-xs font-medium py-1.5 rounded bg-sakura-400 text-white hover:bg-sakura-500 transition-colors"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="flex-1 text-xs font-medium py-1.5 rounded bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 space-y-1">
                            <p className="font-medium text-dark">{order.shippingInfo.fullName}</p>
                            <p>{order.shippingInfo.address}</p>
                            <p>{order.shippingInfo.city}, {order.shippingInfo.postalCode}</p>
                            <p>{order.shippingInfo.country}</p>
                            <p className="text-xs text-gray-400 pt-1">{order.shippingInfo.email}</p>
                          </div>
                        )}
                      </div>

                      {/* Chat Panel */}
                      {(() => {
                        const chatMsg = messages.find((m) => m.type === 'order' && m.subject === `Order #${order._id.slice(-8)}`);
                        return (
                          <div className="md:w-72 flex-shrink-0">
                            <button
                              onClick={(e) => { e.stopPropagation(); setChatOpenId(chatOpenId === order._id ? null : order._id); }}
                              className="flex items-center gap-2 mb-2 w-full text-left group"
                            >
                              <h4 className="text-xs font-semibold text-gray-500 uppercase">Chat</h4>
                              {chatMsg?.replies?.length > 0 && (
                                <span className="text-xs text-gray-400">({chatMsg.replies.length})</span>
                              )}
                              <svg
                                className={`w-3.5 h-3.5 text-gray-400 ml-auto transition-transform ${chatOpenId === order._id ? 'rotate-90' : ''}`}
                                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>

                            {chatOpenId === order._id && (chatMsg ? (
                              <div className="space-y-2">
                                {chatMsg.replies && chatMsg.replies.length > 0 ? (
                                  chatMsg.replies.map((reply, i) => (
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
                                          <span className="text-xs text-gray-400">{new Date(reply.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-xs text-gray-600 whitespace-pre-wrap">{reply.text}</p>
                                      </div>
                                    )
                                  ))
                                ) : (
                                  <p className="text-xs text-gray-400 py-1">No replies yet.</p>
                                )}

                                {replyingTo === chatMsg._id ? (
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
                                        onClick={() => handleReply(chatMsg._id)}
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
                                    onClick={(e) => { e.stopPropagation(); setReplyingTo(chatMsg._id); }}
                                    className="flex items-center gap-1.5 text-xs font-medium text-sakura-400 hover:text-sakura-500 transition-colors"
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                    </svg>
                                    Reply
                                  </button>
                                )}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-400 py-2">No chat for this order yet.</p>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          ))}
      </table>
    </div>
  );
}

export default OrderTable;
