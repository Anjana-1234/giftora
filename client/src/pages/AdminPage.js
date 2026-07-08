import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';

// Empty form state used for both Add and Edit
const emptyForm = {
  name: '',
  price: '',
  image: '',
  category: 'flower',
  color: '',
  description: '',
  availableQuantity: '',
};

function AdminPage() {

  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Controls whether the Add/Edit modal is open
  const [showModal, setShowModal] = useState(false);

  // null = adding new product, object = editing existing product
  const [editingProduct, setEditingProduct] = useState(null);

  // Form data for Add/Edit modal
  const [form, setForm] = useState(emptyForm);

  // Tracks form submission state
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (!user.isAdmin) { navigate('/'); return; }
    fetchAllData();
  }, [user, navigate]);

  async function fetchAllData() {
    try {
      setLoading(true);
      const [statsRes, ordersRes, productsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/orders'),
        api.get('/admin/products'),
        api.get('/admin/users'),
      ]);
      setStats(statsRes.data);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
      setUsers(usersRes.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load dashboard data.');
      setLoading(false);
    }
  }

  async function handleStatusUpdate(orderId, newStatus) {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      const response = await api.get('/admin/orders');
      setOrders(response.data);
    } catch (err) {
      alert('Failed to update order status.');
    }
  }

  async function handleDeleteProduct(productId, productName) {
    if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) return;
    try {
      await api.delete(`/admin/products/${productId}`);
      setProducts(products.filter((p) => p._id !== productId));
    } catch (err) {
      alert('Failed to delete product.');
    }
  }

  // Opens modal for adding a new product
  function handleOpenAdd() {
    setEditingProduct(null);
    setForm(emptyForm);
    setFormError(null);
    setShowModal(true);
  }

  // Opens modal pre-filled for editing an existing product
  function handleOpenEdit(product) {
    setEditingProduct(product);
    setForm({
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      color: product.color || '',
      description: product.description || '',
      availableQuantity: product.availableQuantity ?? 100,
    });
    setFormError(null);
    setShowModal(true);
  }

  // Handles form field changes
  function handleFormChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Submits the Add or Edit form
  async function handleFormSubmit(e) {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);

    try {
      if (editingProduct) {
        // Edit existing product
        await api.put(`/admin/products/${editingProduct._id}`, form);
      } else {
        // Add new product
        await api.post('/admin/products', form);
      }

      // Refresh products list
      const response = await api.get('/admin/products');
      setProducts(response.data);
      setShowModal(false);
      setFormSubmitting(false);
    } catch (err) {
      setFormError('Failed to save product. Please check all fields.');
      setFormSubmitting(false);
    }
  }

  // Shared styles
  const tabStyle = (tab) => ({
    padding: '10px 20px',
    border: 'none',
    borderBottom: activeTab === tab ? '3px solid #e91e8c' : '3px solid transparent',
    backgroundColor: 'transparent',
    color: activeTab === tab ? '#e91e8c' : '#666',
    fontWeight: activeTab === tab ? 'bold' : 'normal',
    cursor: 'pointer',
    fontSize: '15px',
  });

  const cardStyle = {
    backgroundColor: '#fff0f5',
    borderRadius: '10px',
    padding: '20px',
    textAlign: 'center',
    flex: 1,
  };

  const thStyle = {
    backgroundColor: '#e91e8c',
    color: 'white',
    padding: '10px 12px',
    textAlign: 'left',
    fontSize: '13px',
  };

  const tdStyle = {
    padding: '10px 12px',
    fontSize: '13px',
    borderBottom: '1px solid #f0c0d8',
  };

  const inputStyle = {
    width: '100%',
    padding: '9px 12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    marginTop: '4px',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '12px',
  };

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <p style={{ color: '#e91e8c', fontSize: '18px' }}>Loading dashboard... 🌸</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>

      <h1 style={{ color: '#94376a', marginBottom: '5px' }}>Admin Dashboard </h1>
      <p style={{ color: '#666', marginBottom: '25px' }}>Welcome back, {user?.name}</p>

      {/* Tab navigation */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #f0c0d8',
        marginBottom: '25px',
        flexWrap: 'wrap'
      }}>
        <button style={tabStyle('overview')} onClick={() => setActiveTab('overview')}>Overview</button>
        <button style={tabStyle('orders')} onClick={() => setActiveTab('orders')}>
          Orders ({orders.length})
        </button>
        <button style={tabStyle('products')} onClick={() => setActiveTab('products')}>
          Products ({products.length})
        </button>
        <button style={tabStyle('users')} onClick={() => setActiveTab('users')}>
          Users ({users.length})
        </button>
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 'overview' && stats && (
        <div>
          <h2 style={{ color: '#333', marginBottom: '15px' }}>Summary</h2>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '30px' }}>
            <div style={cardStyle}>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#e91e8c', margin: 0 }}>{stats.totalOrders}</p>
              <p style={{ color: '#666', margin: '5px 0 0' }}>Total Orders</p>
            </div>
            <div style={cardStyle}>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#e91e8c', margin: 0 }}>Rs. {stats.totalRevenue.toLocaleString()}</p>
              <p style={{ color: '#666', margin: '5px 0 0' }}>Total Revenue</p>
            </div>
            <div style={cardStyle}>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#e91e8c', margin: 0 }}>{stats.totalUsers}</p>
              <p style={{ color: '#666', margin: '5px 0 0' }}>Registered Users</p>
            </div>
            <div style={cardStyle}>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#e91e8c', margin: 0 }}>{stats.totalProducts}</p>
              <p style={{ color: '#666', margin: '5px 0 0' }}>Products</p>
            </div>
          </div>

          <h2 style={{ color: '#333', marginBottom: '15px' }}>Order Status Breakdown</h2>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <div style={{ ...cardStyle, borderLeft: '4px solid orange' }}>
              <p style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>{stats.pendingOrders}</p>
              <p style={{ color: '#666', margin: '5px 0 0' }}>Pending</p>
            </div>
            <div style={{ ...cardStyle, borderLeft: '4px solid blue' }}>
              <p style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>{stats.confirmedOrders}</p>
              <p style={{ color: '#666', margin: '5px 0 0' }}>Confirmed</p>
            </div>
            <div style={{ ...cardStyle, borderLeft: '4px solid green' }}>
              <p style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>{stats.deliveredOrders}</p>
              <p style={{ color: '#666', margin: '5px 0 0' }}>Delivered</p>
            </div>
          </div>
        </div>
      )}

      {/* ── PRODUCTS TAB ── */}
      {activeTab === 'products' && (
        <div>

          {/* Header with Add Product button */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <h2 style={{ color: '#333', margin: 0 }}>All Products</h2>
            <button
              onClick={handleOpenAdd}
              style={{
                backgroundColor: '#e91e8c',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              + Add Product
            </button>
          </div>

          {products.length === 0 ? (
            <p style={{ color: '#666' }}>No products found.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Category</th>
                    <th style={thStyle}>Price</th>
                    <th style={thStyle}>Color</th>
                    <th style={thStyle}>Available Qty</th>
                    <th style={thStyle}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} style={{ backgroundColor: 'white' }}>
                      <td style={tdStyle}><strong>{product.name}</strong></td>
                      <td style={tdStyle}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          backgroundColor: product.category === 'flower' ? '#fff0f5' : '#f0fff0',
                          color: product.category === 'flower' ? '#e91e8c' : '#2d6a2d',
                        }}>
                          {product.category === 'flower' ? ' Flower' : ' Gift'}
                        </span>
                      </td>
                      <td style={tdStyle}>Rs. {product.price.toLocaleString()}</td>
                      <td style={tdStyle}>{product.color || '—'}</td>
                      <td style={tdStyle}>
                        <span style={{
                          fontWeight: 'bold',
                          color: product.availableQuantity === 0 ? 'red' :
                            product.availableQuantity < 10 ? 'orange' : 'green'
                        }}>
                          {product.availableQuantity ?? 100}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {/* Edit button */}
                          <button
                            onClick={() => handleOpenEdit(product)}
                            style={{
                              backgroundColor: '#e91e8c',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '5px 12px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            Edit
                          </button>
                          {/* Delete button */}
                          <button
                            onClick={() => handleDeleteProduct(product._id, product.name)}
                            style={{
                              backgroundColor: 'transparent',
                              color: 'red',
                              border: '1px solid red',
                              borderRadius: '6px',
                              padding: '5px 10px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── ORDERS TAB ── */}
      {activeTab === 'orders' && (
        <div>
          <h2 style={{ color: '#333', marginBottom: '15px' }}>All Orders</h2>
          {orders.length === 0 ? (
            <p style={{ color: '#666' }}>No orders yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Order ID</th>
                    <th style={thStyle}>Customer</th>
                    <th style={thStyle}>Date</th>
                    <th style={thStyle}>Delivery</th>
                    <th style={thStyle}>Total</th>
                    <th style={thStyle}>Payment</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Update</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} style={{ backgroundColor: 'white' }}>
                      <td style={tdStyle}>
                        <span style={{ fontSize: '11px', color: '#999' }}>...{order._id.slice(-8)}</span>
                      </td>
                      <td style={tdStyle}>
                        <strong>{order.customerName}</strong><br />
                        <span style={{ fontSize: '11px', color: '#999' }}>{order.email}</span><br />
                        <span style={{ fontSize: '11px', color: '#999' }}>{order.phone}</span>
                      </td>
                      <td style={tdStyle}>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td style={tdStyle}>
                        <strong>{order.deliveryDate}</strong><br />
                        <span style={{ fontSize: '11px', color: '#999' }}>{order.deliveryTime}</span><br />
                        <span style={{ fontSize: '11px', color: '#999' }}>{order.address}</span>
                      </td>
                      <td style={tdStyle}><strong>Rs. {order.totalAmount.toLocaleString()}</strong></td>
                      <td style={tdStyle}>
                        {order.paymentMethod === 'card' ? '💳 Card' : '💵 Cash'}<br />
                        <span style={{ fontSize: '11px', color: order.paymentStatus === 'paid' ? 'green' : 'orange' }}>
                          {order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          backgroundColor:
                            order.status === 'pending' ? '#fff3cd' :
                            order.status === 'confirmed' ? '#cce5ff' :
                            order.status === 'delivered' ? '#d4edda' : '#f8d7da',
                          color:
                            order.status === 'pending' ? '#856404' :
                            order.status === 'confirmed' ? '#004085' :
                            order.status === 'delivered' ? '#155724' : '#721c24',
                        }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          style={{
                            padding: '5px',
                            borderRadius: '6px',
                            border: '1px solid #e91e8c',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── USERS TAB ── */}
      {activeTab === 'users' && (
        <div>
          <h2 style={{ color: '#333', marginBottom: '15px' }}>Registered Users</h2>
          {users.length === 0 ? (
            <p style={{ color: '#666' }}>No users registered yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Role</th>
                    <th style={thStyle}>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} style={{ backgroundColor: 'white' }}>
                      <td style={tdStyle}><strong>{u.name}</strong></td>
                      <td style={tdStyle}>{u.email}</td>
                      <td style={tdStyle}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          backgroundColor: u.isAdmin ? '#fff3cd' : '#f0f0f0',
                          color: u.isAdmin ? '#856404' : '#666',
                        }}>
                          {u.isAdmin ? '⭐ Admin' : 'Customer'}
                        </span>
                      </td>
                      <td style={tdStyle}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── ADD / EDIT PRODUCT MODAL ── */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '30px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative'
            }}
          >
            {/* Modal header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#e91e8c', margin: 0 }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'transparent', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#999' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>

              {/* Product Name */}
              <label style={labelStyle}>
                Product Name*
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  required
                  style={inputStyle}
                  placeholder="e.g. Red Rose Bouquet"
                />
              </label>

              {/* Category */}
              <label style={labelStyle}>
                Category*
                <select
                  name="category"
                  value={form.category}
                  onChange={handleFormChange}
                  required
                  style={inputStyle}
                >
                  <option value="flower"> Flower</option>
                  <option value="gift"> Gift</option>
                </select>
              </label>

              {/* Price */}
              <label style={labelStyle}>
                Price (Rs.)*
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleFormChange}
                  required
                  min="0"
                  style={inputStyle}
                  placeholder="e.g. 1800"
                />
              </label>

              {/* Image filename */}
              <label style={labelStyle}>
                Image Filename*
                <input
                  type="text"
                  name="image"
                  value={form.image}
                  onChange={handleFormChange}
                  required
                  style={inputStyle}
                  placeholder="e.g. redRose.jpeg"
                />
                <span style={{ fontSize: '11px', color: '#999', marginTop: '4px', display: 'block' }}>
                  Image must already exist in client/src/assets/flowers/ or gifts/ folder
                </span>
              </label>

              {/* Color (flowers only) */}
              {form.category === 'flower' && (
                <label style={labelStyle}>
                  Color
                  <select
                    name="color"
                    value={form.color}
                    onChange={handleFormChange}
                    style={inputStyle}
                  >
                    <option value="">Select color</option>
                    <option value="Red">Red</option>
                    <option value="Pink">Pink</option>
                    <option value="White">White</option>
                    <option value="Yellow">Yellow</option>
                    <option value="Blue">Blue</option>
                    <option value="Purple">Purple</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                </label>
              )}

              {/* Available Quantity */}
              <label style={labelStyle}>
                Available Quantity*
                <input
                  type="number"
                  name="availableQuantity"
                  value={form.availableQuantity}
                  onChange={handleFormChange}
                  required
                  min="0"
                  style={inputStyle}
                  placeholder="e.g. 50"
                />
              </label>

              {/* Description */}
              <label style={labelStyle}>
                Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  rows="3"
                  style={{ ...inputStyle, fontFamily: 'inherit', resize: 'vertical' }}
                  placeholder="Describe the product..."
                />
              </label>

              {formError && (
                <p style={{ color: 'red', fontSize: '13px', marginBottom: '10px' }}>{formError}</p>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={formSubmitting}
                style={{
                  width: '100%',
                  backgroundColor: formSubmitting ? '#ccc' : '#e91e8c',
                  color: 'white',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '8px',
                  cursor: formSubmitting ? 'not-allowed' : 'pointer',
                  fontSize: '15px',
                  fontWeight: 'bold'
                }}
              >
                {formSubmitting ? 'Saving...' : editingProduct ? 'Save Changes' : 'Add Product'}
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminPage;