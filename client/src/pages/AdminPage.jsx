import { useState, useEffect, useRef } from 'react';
import { getProducts, deleteProduct } from '../api/products';
import { getOrders, archiveOrder, deleteOrder, updateOrder, exportOrders } from '../api/orders';
import { getMessages, archiveMessage } from '../api/messages';
import ProductForm from '../components/admin/ProductForm';
import ProductTable from '../components/admin/ProductTable';
import OrderTable from '../components/admin/OrderTable';
import RequestTable from '../components/admin/RequestTable';
import ContactTable from '../components/admin/ContactTable';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function AdminPage() {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Order filters
  const [orderMonth, setOrderMonth] = useState('');
  const [orderYear, setOrderYear] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  // Request filters
  const [reqMonth, setReqMonth] = useState('');
  const [reqYear, setReqYear] = useState('');
  const [showArchivedReqs, setShowArchivedReqs] = useState(false);

  // Contact filters
  const [contactMonth, setContactMonth] = useState('');
  const [contactYear, setContactYear] = useState('');
  const [showArchivedContacts, setShowArchivedContacts] = useState(false);

  const fetchProducts = () => {
    getProducts({ limit: 100 })
      .then((res) => setProducts(res.data.products))
      .catch(console.error);
  };

  const fetchOrders = () => {
    const params = { limit: 100, archived: showArchived };
    if (orderMonth) params.month = orderMonth;
    if (orderYear) params.year = orderYear;
    getOrders(params)
      .then((res) => setOrders(res.data.orders))
      .catch(console.error);
  };

  const fetchRequests = () => {
    const params = { type: 'request', archived: showArchivedReqs };
    if (reqMonth) params.month = reqMonth;
    if (reqYear) params.year = reqYear;
    getMessages(params)
      .then((res) => setRequests(res.data))
      .catch(console.error);
  };

  const fetchContacts = () => {
    const params = { type: 'contact', archived: showArchivedContacts };
    if (contactMonth) params.month = contactMonth;
    if (contactYear) params.year = contactYear;
    getMessages(params)
      .then((res) => setContacts(res.data))
      .catch(console.error);
  };

  // Refs so polling intervals pick up latest filter values
  const fetchOrdersRef = useRef(fetchOrders);
  fetchOrdersRef.current = fetchOrders;
  const fetchRequestsRef = useRef(fetchRequests);
  fetchRequestsRef.current = fetchRequests;
  const fetchContactsRef = useRef(fetchContacts);
  fetchContactsRef.current = fetchContacts;

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchRequests();
    fetchContacts();
    const interval = setInterval(() => {
      fetchOrdersRef.current();
      fetchRequestsRef.current();
      fetchContactsRef.current();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Re-fetch when filters change
  useEffect(() => { fetchOrders(); }, [orderMonth, orderYear, showArchived]);
  useEffect(() => { fetchRequests(); }, [reqMonth, reqYear, showArchivedReqs]);
  useEffect(() => { fetchContacts(); }, [contactMonth, contactYear, showArchivedContacts]);

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

  const handleArchiveOrder = async (id) => {
    try {
      await archiveOrder(id);
      fetchOrders();
    } catch (err) {
      console.error('Failed to archive order:', err);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this order?')) return;
    try {
      await deleteOrder(id);
      fetchOrders();
    } catch (err) {
      console.error('Failed to delete order:', err);
    }
  };

  const handleUpdateOrder = async (id, data, onSuccess) => {
    try {
      await updateOrder(id, data);
      fetchOrders();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Failed to update order:', err);
    }
  };

  const handleExportOrders = async () => {
    try {
      const res = await exportOrders();
      const blob = new Blob([res.data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `archived-orders-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export orders:', err);
    }
  };

  const handleArchiveRequest = async (id) => {
    try {
      await archiveMessage(id);
      fetchRequests();
    } catch (err) {
      console.error('Failed to archive request:', err);
    }
  };

  const handleArchiveContact = async (id) => {
    try {
      await archiveMessage(id);
      fetchContacts();
    } catch (err) {
      console.error('Failed to archive contact:', err);
    }
  };

  // Generate year options (current year down to 2024)
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let y = currentYear; y >= 2024; y--) {
    yearOptions.push(y);
  }

  // Unread badge counts (from currently fetched non-archived data)
  const unreadRequests = requests.filter((r) => !r.read).length;
  const unreadContacts = contacts.filter((c) => !c.read).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-sakura-400 mb-8">Admin Panel</h1>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-sakura-50 rounded-lg p-1 w-fit overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setTab('products')}
          className={`whitespace-nowrap px-5 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === 'products'
              ? 'bg-white text-sakura-600 shadow-sm'
              : 'text-gray-600 hover:text-sakura-400'
          }`}
        >
          Products ({products.length})
        </button>
        <button
          onClick={() => setTab('orders')}
          className={`whitespace-nowrap px-5 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === 'orders'
              ? 'bg-white text-sakura-600 shadow-sm'
              : 'text-gray-600 hover:text-sakura-400'
          }`}
        >
          Orders ({orders.length})
        </button>
        <button
          onClick={() => setTab('requests')}
          className={`relative whitespace-nowrap px-5 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === 'requests'
              ? 'bg-white text-sakura-600 shadow-sm'
              : 'text-gray-600 hover:text-sakura-400'
          }`}
        >
          Requests ({requests.length})
          {unreadRequests > 0 && (
            <span className="absolute -top-1 -right-1 bg-sakura-400 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {unreadRequests}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('contacts')}
          className={`relative whitespace-nowrap px-5 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === 'contacts'
              ? 'bg-white text-sakura-600 shadow-sm'
              : 'text-gray-600 hover:text-sakura-400'
          }`}
        >
          Contacts ({contacts.length})
          {unreadContacts > 0 && (
            <span className="absolute -top-1 -right-1 bg-sakura-400 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {unreadContacts}
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
        <div className="space-y-4">
          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={orderMonth}
              onChange={(e) => setOrderMonth(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sakura-300 focus:border-sakura-400 outline-none"
            >
              <option value="">All Months</option>
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>
            <select
              value={orderYear}
              onChange={(e) => setOrderYear(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sakura-300 focus:border-sakura-400 outline-none"
            >
              <option value="">All Years</option>
              {yearOptions.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`text-sm font-medium px-4 py-2 rounded-lg border transition-colors ${
                showArchived
                  ? 'bg-sakura-400 text-white border-sakura-400'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-sakura-300'
              }`}
            >
              {showArchived ? 'Showing Archived' : 'Show Archived'}
            </button>
            {showArchived && (
              <button
                onClick={handleExportOrders}
                className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-600 hover:border-sakura-300 hover:text-sakura-500 transition-colors flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export JSON
              </button>
            )}
            {(orderMonth || orderYear) && (
              <button
                onClick={() => { setOrderMonth(''); setOrderYear(''); }}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="bg-white border border-sakura-100 rounded-xl overflow-hidden">
            <OrderTable
              orders={orders}
              messages={[...requests, ...contacts]}
              onStatusUpdate={() => { fetchOrders(); fetchRequests(); fetchContacts(); }}
              onArchive={handleArchiveOrder}
              onDelete={handleDeleteOrder}
              onEdit={handleUpdateOrder}
            />
          </div>
        </div>
      )}

      {/* Requests Tab */}
      {tab === 'requests' && (
        <div className="space-y-4">
          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={reqMonth}
              onChange={(e) => setReqMonth(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sakura-300 focus:border-sakura-400 outline-none"
            >
              <option value="">All Months</option>
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>
            <select
              value={reqYear}
              onChange={(e) => setReqYear(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sakura-300 focus:border-sakura-400 outline-none"
            >
              <option value="">All Years</option>
              {yearOptions.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <button
              onClick={() => setShowArchivedReqs(!showArchivedReqs)}
              className={`text-sm font-medium px-4 py-2 rounded-lg border transition-colors ${
                showArchivedReqs
                  ? 'bg-sakura-400 text-white border-sakura-400'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-sakura-300'
              }`}
            >
              {showArchivedReqs ? 'Showing Archived' : 'Show Archived'}
            </button>
            {(reqMonth || reqYear) && (
              <button
                onClick={() => { setReqMonth(''); setReqYear(''); }}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="bg-white border border-sakura-100 rounded-xl overflow-hidden">
            <RequestTable
              requests={requests}
              onUpdate={fetchRequests}
              onArchive={handleArchiveRequest}
            />
          </div>
        </div>
      )}

      {/* Contacts Tab */}
      {tab === 'contacts' && (
        <div className="space-y-4">
          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={contactMonth}
              onChange={(e) => setContactMonth(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sakura-300 focus:border-sakura-400 outline-none"
            >
              <option value="">All Months</option>
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>
            <select
              value={contactYear}
              onChange={(e) => setContactYear(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sakura-300 focus:border-sakura-400 outline-none"
            >
              <option value="">All Years</option>
              {yearOptions.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <button
              onClick={() => setShowArchivedContacts(!showArchivedContacts)}
              className={`text-sm font-medium px-4 py-2 rounded-lg border transition-colors ${
                showArchivedContacts
                  ? 'bg-sakura-400 text-white border-sakura-400'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-sakura-300'
              }`}
            >
              {showArchivedContacts ? 'Showing Archived' : 'Show Archived'}
            </button>
            {(contactMonth || contactYear) && (
              <button
                onClick={() => { setContactMonth(''); setContactYear(''); }}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="bg-white border border-sakura-100 rounded-xl overflow-hidden">
            <ContactTable
              contacts={contacts}
              onUpdate={fetchContacts}
              onArchive={handleArchiveContact}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
