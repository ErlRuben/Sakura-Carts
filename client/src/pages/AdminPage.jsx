import { useState, useEffect } from 'react';
import { getProducts, deleteProduct } from '../api/products';
import { getOrders } from '../api/orders';
import { getMessages } from '../api/messages';
import ProductForm from '../components/admin/ProductForm';
import ProductTable from '../components/admin/ProductTable';
import OrderTable from '../components/admin/OrderTable';
import MessageTable from '../components/admin/MessageTable';

function AdminPage() {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchProducts = () => {
    getProducts({ limit: 100 })
      .then((res) => setProducts(res.data.products))
      .catch(console.error);
  };

  const fetchOrders = () => {
    getOrders({ limit: 100 })
      .then((res) => setOrders(res.data.orders))
      .catch(console.error);
  };

  const fetchMessages = () => {
    getMessages()
      .then((res) => setMessages(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchMessages();
  }, []);

  const handleEdit = (product) => {
    setEditProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const handleSave = () => {
    fetchProducts();
    setEditProduct(null);
    setShowForm(false);
  };

  const handleCancel = () => {
    setEditProduct(null);
    setShowForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-serif font-bold text-dark mb-8">Admin Panel</h1>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-sakura-50 rounded-lg p-1 w-fit">
        <button
          onClick={() => setTab('products')}
          className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === 'products'
              ? 'bg-white text-sakura-600 shadow-sm'
              : 'text-gray-600 hover:text-sakura-400'
          }`}
        >
          Products ({products.length})
        </button>
        <button
          onClick={() => setTab('orders')}
          className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === 'orders'
              ? 'bg-white text-sakura-600 shadow-sm'
              : 'text-gray-600 hover:text-sakura-400'
          }`}
        >
          Orders ({orders.length})
        </button>
        <button
          onClick={() => setTab('messages')}
          className={`relative px-5 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === 'messages'
              ? 'bg-white text-sakura-600 shadow-sm'
              : 'text-gray-600 hover:text-sakura-400'
          }`}
        >
          Messages ({messages.length})
          {messages.filter((m) => !m.read).length > 0 && (
            <span className="absolute -top-1 -right-1 bg-sakura-400 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {messages.filter((m) => !m.read).length}
            </span>
          )}
        </button>
      </div>

      {/* Products Tab */}
      {tab === 'products' && (
        <div className="space-y-6">
          {!showForm && (
            <button
              onClick={() => { setEditProduct(null); setShowForm(true); }}
              className="btn-primary"
            >
              + Add New Product
            </button>
          )}

          {showForm && (
            <ProductForm
              editProduct={editProduct}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )}

          <div className="bg-white border border-sakura-100 rounded-xl overflow-hidden">
            <ProductTable
              products={products}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {tab === 'orders' && (
        <div className="bg-white border border-sakura-100 rounded-xl overflow-hidden">
          <OrderTable orders={orders} onStatusUpdate={fetchOrders} />
        </div>
      )}

      {/* Messages Tab */}
      {tab === 'messages' && (
        <div className="bg-white border border-sakura-100 rounded-xl overflow-hidden">
          <MessageTable messages={messages} onUpdate={fetchMessages} />
        </div>
      )}
    </div>
  );
}

export default AdminPage;
