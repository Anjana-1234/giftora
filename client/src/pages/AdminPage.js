// useState and useEffect for managing tabs, data, and loading states
import { useState, useEffect } from 'react';

// useNavigate to redirect non-admins away
import { useNavigate } from 'react-router-dom';

// Import auth context to check if user is admin
import { useAuth } from '../context/AuthContext';

// Import axios instance
import api from '../api/axiosConfig';

function AdminPage() {

  // Get the logged-in user from auth context
  const { user } = useAuth();

  // Lets us redirect non-admins away
  const navigate = useNavigate();

  // Which tab is currently active: 'overview', 'orders', 'products', 'users'
  const [activeTab, setActiveTab] = useState('overview');

  // Data for each section
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect if not logged in or not admin
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!user.isAdmin) {
      navigate('/');
      return;
    }
    fetchAllData();
  }, [user]);

  // Fetch all data needed for the dashboard
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
      setError('Failed to load dashboard data. Make sure you are logged in as admin.');
      setLoading(false);
    }
  }

  // Update an order's status
  async function handleStatusUpdate(orderId, newStatus) {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      // Refresh orders list after update
      const response = await api.get('/admin/orders');
      setOrders(response.data);
    } catch (err) {
      alert('Failed to update order status.');
    }
  }

  // Delete a product
  async function handleDeleteProduct(productId, productName) {
    if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) return;

    try {
      await api.delete(`/admin/products/${productId}`);
      // Remove from local state without refetching
      setProducts(products.filter((p) => p._id !== productId));
    } catch (err) {
      alert('Failed to delete product.');
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

  const tableHeaderStyle = {
    backgroundColor: '#e91e8c',
    color: 'white',
    padding: '10px 12px',
    textAlign: 'left',
    fontSize: '13px',
  };

  const tableCellStyle = {
    padding: '10px 12px',
    fontSize: '13px',
    borderBottom: '1px solid #f0c0d8',
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

      <h1 style={{ color: '#e91e8c', marginBottom: '5px' }}>Admin Dashboard 🌸</h1>
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

          {/* Stats cards */}
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '30px' }}>
            <div style={cardStyle}>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#e91e8c', margin: 0 }}>
                {stats.totalOrders}
              </p>
              <p style={{ color: '#666', margin: '5px 0 0' }}>Total Orders</p>
            </div>
            <div style={cardStyle}>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#e91e8c', margin: 0 }}>
                £{stats.totalRevenue.toFixed(2)}
              </p>
              <p style={{ color: '#666', margin: '5px 0 0' }}>Total Revenue</p>
            </div>
            <div style={cardStyle}>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#e91e8c', margin: 0 }}>
                {stats.totalUsers}
              </p>
              <p style={{ color: '#666', margin: '5px 0 0' }}>Registered Users</p>
            </div>
            <div style={cardStyle}>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#e91e8c', margin: 0 }}>
                {stats.totalProducts}
              </p>
              <p style={{ color: '#666', margin: '5px 0 0' }}>Products</p>
            </div>
          </div>

          {/* Order status breakdown */}
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
                    <th style={tableHeaderStyle}>Order ID</th>
                    <th style={tableHeaderStyle}>Customer</th>
                    <th style={tableHeaderStyle}>Date</th>
                    <th style={tableHeaderStyle}>Delivery</th>
                    <th style={tableHeaderStyle}>Total</th>
                    <th style={tableHeaderStyle}>Payment</th>
                    <th style={tableHeaderStyle}>Status</th>
                    <th style={tableHeaderStyle}>Update</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} style={{ backgroundColor: 'white' }}>
                      {/* Short order ID */}
                      <td style={tableCellStyle}>
                        <span style={{ fontSize: '11px', color: '#999' }}>
                          ...{order._id.slice(-8)}
                        </span>
                      </td>
                      <td style={tableCellStyle}>
                        <strong>{order.customerName}</strong>
                        <br />
                        <span style={{ fontSize: '11px', color: '#999' }}>{order.email}</span>
                        <br />
                        <span style={{ fontSize: '11px', color: '#999' }}>{order.phone}</span>
                      </td>
                      <td style={tableCellStyle}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td style={tableCellStyle}>
                        <strong>{order.deliveryDate}</strong>
                        <br />
                        <span style={{ fontSize: '11px', color: '#999' }}>{order.deliveryTime}</span>
                        <br />
                        <span style={{ fontSize: '11px', color: '#999' }}>{order.address}</span>
                      </td>
                      <td style={tableCellStyle}>
                        <strong>£{order.totalAmount.toFixed(2)}</strong>
                      </td>
                      <td style={tableCellStyle}>
                        {order.paymentMethod === 'card' ? '💳 Card' : '💵 Cash'}
                        <br />
                        <span style={{
                          fontSize: '11px',
                          color: order.paymentStatus === 'paid' ? 'green' : 'orange'
                        }}>
                          {order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                      <td style={tableCellStyle}>
                        {/* Colour coded status badge */}
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
                      <td style={tableCellStyle}>
                        {/* Dropdown to update status */}
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

      {/* ── PRODUCTS TAB ── */}
      {activeTab === 'products' && (
        <div>
          <h2 style={{ color: '#333', marginBottom: '15px' }}>All Products</h2>

          {products.length === 0 ? (
            <p style={{ color: '#666' }}>No products found.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={tableHeaderStyle}>Name</th>
                    <th style={tableHeaderStyle}>Category</th>
                    <th style={tableHeaderStyle}>Price</th>
                    <th style={tableHeaderStyle}>Color</th>
                    <th style={tableHeaderStyle}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} style={{ backgroundColor: 'white' }}>
                      <td style={tableCellStyle}><strong>{product.name}</strong></td>
                      <td style={tableCellStyle}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          backgroundColor: product.category === 'flower' ? '#fff0f5' : '#f0fff0',
                          color: product.category === 'flower' ? '#e91e8c' : '#2d6a2d',
                        }}>
                          {product.category === 'flower' ? '🌸 Flower' : '🎁 Gift'}
                        </span>
                      </td>
                      <td style={tableCellStyle}>£{product.price.toFixed(2)}</td>
                      <td style={tableCellStyle}>{product.color || '—'}</td>
                      <td style={tableCellStyle}>
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
                    <th style={tableHeaderStyle}>Name</th>
                    <th style={tableHeaderStyle}>Email</th>
                    <th style={tableHeaderStyle}>Role</th>
                    <th style={tableHeaderStyle}>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} style={{ backgroundColor: 'white' }}>
                      <td style={tableCellStyle}><strong>{u.name}</strong></td>
                      <td style={tableCellStyle}>{u.email}</td>
                      <td style={tableCellStyle}>
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
                      <td style={tableCellStyle}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default AdminPage;