import { formatCurrency } from '../../utils/formatCurrency';
import { ORDER_STATUSES } from '../../utils/constants';
import { updateOrderStatus } from '../../api/orders';

function OrderTable({ orders, onStatusUpdate }) {
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
            <tr key={order._id} className="border-b border-gray-100 hover:bg-sakura-50/50">
              <td className="py-3 px-4 text-sm font-mono text-gray-600">
                {order._id.slice(-8)}
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
              <td className="py-3 px-4">
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
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderTable;
