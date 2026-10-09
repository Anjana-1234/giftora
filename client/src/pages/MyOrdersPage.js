import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';

// Colours for the order status badge
const STATUS_STYLES = {
  pending:   { bg: '#fff3cd', color: '#856404', label: 'Pending' },
  confirmed: { bg: '#d1ecf1', color: '#0c5460', label: 'Confirmed' },
  delivered: { bg: '#d4edda', color: '#155724', label: 'Delivered' },
  cancelled: { bg: '#f8d7da', color: '#721c24', label: 'Cancelled' },
};

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function MyOrdersPage() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await api.get('/orders/my');
        setOrders(response.data);
      } catch (err) {
        setError('We could not load your orders. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <p style={{ color: '#e91e8c', fontSize: '18px' }}>Loading your orders... 🌸</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', padding: '40px 20px 60px' }}>

      <h1 style={{ color: '#9b3a6b', textAlign: 'center', marginBottom: '6px' }}>
        My Orders
      </h1>
      <p style={{ textAlign: 'center', color: '#888', marginTop: 0, marginBottom: '30px' }}>
        Everything you have ordered from Giftora, newest first.
      </p>

      {error && (
        <p style={{ color: '#b23a3a', textAlign: 'center' }}>{error}</p>
      )}

      {/* Empty state */}
      {!error && orders.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '50px 20px',
          border: '1px dashed #e8b4cb',
          borderRadius: '12px',
          backgroundColor: '#fff8fb'
        }}>
          <p style={{ fontSize: '18px', margin: '0 0 8px', color: '#7a3159' }}>
            You have not placed any orders yet.
          </p>
          <p style={{ color: '#888', margin: '0 0 20px' }}>
            Orders you place while logged in will show up here.
          </p>
          <Link to="/shop" style={{
            display: 'inline-block',
            backgroundColor: '#e91e8c',
            color: 'white',
            textDecoration: 'none',
            padding: '11px 26px',
            borderRadius: '24px',
            fontWeight: 'bold'
          }}>
            Browse flowers
          </Link>
        </div>
      )}

      {/* Order cards */}
      {orders.map((order) => {
        const status = STATUS_STYLES[order.status] || STATUS_STYLES.pending;

        return (
          <div key={order._id} style={{
            border: '1px solid #f0d3e0',
            borderRadius: '12px',
            marginBottom: '20px',
            backgroundColor: 'white',
            overflow: 'hidden'
          }}>

            {/* Header: order number, placed date, status */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
              padding: '14px 20px',
              backgroundColor: '#fdf1f6',
              borderBottom: '1px solid #f0d3e0'
            }}>
              <div>
                <div style={{ fontWeight: 'bold', color: '#7a3159' }}>
                  Order #{order._id.slice(-6).toUpperCase()}
                </div>
                <div style={{ fontSize: '13px', color: '#888' }}>
                  Placed on {formatDate(order.createdAt)}
                </div>
              </div>
              <span style={{
                padding: '5px 14px',
                borderRadius: '14px',
                fontSize: '13px',
                fontWeight: 'bold',
                backgroundColor: status.bg,
                color: status.color
              }}>
                {status.label}
              </span>
            </div>

            {/* Items */}
            <div style={{ padding: '14px 20px' }}>
              {order.items.map((item, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '14px',
                  padding: '5px 0'
                }}>
                  <span>{item.name} × {item.quantity}</span>
                  <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Footer: delivery + payment + total */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '12px',
              padding: '14px 20px',
              borderTop: '1px solid #f5e1ea',
              fontSize: '13px',
              color: '#666'
            }}>
              <div style={{ lineHeight: 1.7 }}>
                <div>
                  <strong>Delivery:</strong> {order.deliveryDate} · {order.deliveryTime}
                </div>
                <div>
                  <strong>Payment:</strong>{' '}
                  {order.paymentMethod === 'card' ? 'Online payment' : 'Cash on delivery'}
                  {' · '}
                  <span style={{ color: order.paymentStatus === 'paid' ? '#155724' : '#856404' }}>
                    {order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: '#888' }}>Total</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#7a3159' }}>
                  Rs. {order.totalAmount.toLocaleString()}
                </div>
              </div>
            </div>

          </div>
        );
      })}

    </div>
  );
}

export default MyOrdersPage;