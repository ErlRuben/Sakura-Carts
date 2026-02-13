import { useState } from 'react';
import { formatCurrency } from '../../utils/formatCurrency';
import { ORDER_STATUSES } from '../../utils/constants';
import { updateOrderStatus } from '../../api/orders';

function OrderTable({ orders, onStatusUpdate }) {
  const [expanded, setExpanded] = useState(null);

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
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tbody key={order._id}>
              <tr
                className={`border-b border-gray-100 cursor-pointer hover:bg-sakura-50/50 ${expanded === order._id ? 'bg-sakura-50/30' : ''}`}
                onClick={() => setExpanded(expanded === order._id ? null : order._id)}
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
              </tr>

              {/* Expanded detail row */}
              {expanded === order._id && (
                <tr className="border-b border-gray-100 bg-white">
                  <td colSpan={6} className="px-4 pb-4 pt-2">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Ordered Items */}
                      <div className="flex-1">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Ordered Items</h4>
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
                        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Shipping Address</h4>
                        <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 space-y-1">
                          <p className="font-medium text-dark">{order.shippingInfo.fullName}</p>
                          <p>{order.shippingInfo.address}</p>
                          <p>{order.shippingInfo.city}, {order.shippingInfo.postalCode}</p>
                          <p>{order.shippingInfo.country}</p>
                          <p className="text-xs text-gray-400 pt-1">{order.shippingInfo.email}</p>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderTable;
