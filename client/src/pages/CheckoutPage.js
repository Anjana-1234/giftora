// useState to manage form input values and submission status
import { useState } from 'react';

// useNavigate lets us redirect after a cash order is placed
import { useNavigate } from 'react-router-dom';

// Import our cart context to get items and total, and clearCart for cash orders
import { useCart } from '../context/CartContext';

// Import our pre-configured axios instance
import api from '../api/axiosConfig';

function CheckoutPage() {

  // Get cart items, total, and clearCart from our shared cart context
  const { cartItems, getCartTotal, clearCart } = useCart();

  // Lets us redirect to confirmation page after a cash order
  const navigate = useNavigate();

  // Holds the values typed into the form
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    deliveryDate: '',
    deliveryTime: 'Anytime',
    specialInstructions: '',
  });

  // Tracks which payment method the user picked - "card" or "cash"
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Tracks whether we're currently submitting (to disable button, show loading)
  const [submitting, setSubmitting] = useState(false);

  // Tracks any error message if something fails
  const [error, setError] = useState(null);

  // Runs every time the user types in an input field
  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  // Returns today's date in YYYY-MM-DD format, used to stop users picking a past delivery date
  function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Builds the order data object shared by both payment methods
  function buildOrderData() {
    return {
      customerName: formData.customerName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      deliveryDate: formData.deliveryDate,
      deliveryTime: formData.deliveryTime,
      specialInstructions: formData.specialInstructions,
      items: cartItems.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        type: item.type,
      })),
      totalAmount: getCartTotal(),
      paymentMethod: paymentMethod,
    };
  }

  // Runs when the form is submitted
  async function handleSubmit(e) {
    e.preventDefault();

    setSubmitting(true);
    setError(null);

    try {
      if (paymentMethod === 'card') {
        // CARD FLOW - redirect to Stripe, order gets saved after payment succeeds

        // Save the order details temporarily so PaymentSuccessPage can use them
        sessionStorage.setItem('checkoutDetails', JSON.stringify(buildOrderData()));

        // Ask our backend to create a Stripe Checkout session
        const response = await api.post('/stripe/create-checkout-session', {
          items: cartItems,
        });

        // Redirect the browser to Stripe's hosted payment page
        window.location.href = response.data.url;

      } else {
        // CASH FLOW - no Stripe needed, save the order directly right now

        const response = await api.post('/orders', buildOrderData());

        // Empty the cart since the order is now placed
        clearCart();

        // Go straight to the confirmation page
        navigate(`/order-confirmation/${response.data._id}`);
      }

    } catch (err) {
      setError('Something went wrong placing your order. Please try again.');
      setSubmitting(false);
    }
  }

  // If cart is empty, don't allow checkout
  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <h1 style={{ color: '#e91e8c' }}>Checkout</h1>
        <p>Your cart is empty. Add some items before checking out.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', maxWidth: '600px', margin: '0 auto' }}>

      <h1 style={{ color: '#e91e8c', textAlign: 'center' }}>Checkout 🌸</h1>

      {/* Order summary */}
      <div style={{
        backgroundColor: '#fff0f5',
        borderRadius: '10px',
        padding: '15px 20px',
        margin: '20px 0'
      }}>
        <h3 style={{ marginTop: 0, color: '#e91e8c' }}>Order Summary</h3>
        {cartItems.map((item) => (
          <div key={item.id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '14px',
            padding: '4px 0'
          }}>
            <span>{item.name} × {item.quantity}</span>
            <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontWeight: 'bold',
          marginTop: '10px',
          paddingTop: '10px',
          borderTop: '1px solid #e91e8c'
        }}>
          <span>Total</span>
          <span>Rs. {getCartTotal().toLocaleString()}</span>
        </div>
      </div>

      {/* Delivery details form */}
      <form onSubmit={handleSubmit}>

        <h3 style={{ color: '#e91e8c', marginBottom: '12px' }}>Delivery Details</h3>

        {/* Full Name */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Full Name*
          </label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              fontSize: '14px'
            }}
          />
        </div>

        {/* Email */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Email*
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              fontSize: '14px'
            }}
          />
        </div>

        {/* Phone */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Phone*
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              fontSize: '14px'
            }}
          />
        </div>

        {/* Address */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Address*
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            rows="3"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              fontSize: '14px',
              fontFamily: 'inherit'
            }}
          />
        </div>

        {/* Delivery Date */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Delivery Date*
          </label>
          <input
            type="date"
            name="deliveryDate"
            value={formData.deliveryDate}
            onChange={handleChange}
            required
            min={getTodayDate()} // prevents selecting a date before today
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              fontSize: '14px'
            }}
          />
        </div>

        {/* Delivery Time */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Delivery Time
          </label>
          <select
            name="deliveryTime"
            value={formData.deliveryTime}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              fontSize: '14px'
            }}
          >
            <option value="Anytime">Anytime</option>
            <option value="Morning (9am-12pm)">Morning (9am-12pm)</option>
            <option value="Afternoon (12pm-5pm)">Afternoon (12pm-5pm)</option>
            <option value="Evening (5pm-9pm)">Evening (5pm-9pm)</option>
          </select>
        </div>

        {/* Special Instructions */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Special Instructions
          </label>
          <textarea
            name="specialInstructions"
            value={formData.specialInstructions}
            onChange={handleChange}
            rows="2"
            placeholder="e.g. leave at front desk, gift message, ring doorbell..."
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              fontSize: '14px',
              fontFamily: 'inherit'
            }}
          />
        </div>

        {/* Payment method selection */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
            Payment Method*
          </label>

          <div style={{ display: 'flex', gap: '12px' }}>

            {/* Card option */}
            <label style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: paymentMethod === 'card' ? '2px solid #e91e8c' : '1px solid #ccc',
              borderRadius: '8px',
              padding: '12px',
              cursor: 'pointer'
            }}>
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
              />
              Online Payment
            </label>

            {/* Cash option */}
            <label style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: paymentMethod === 'cash' ? '2px solid #e91e8c' : '1px solid #ccc',
              borderRadius: '8px',
              padding: '12px',
              cursor: 'pointer'
            }}>
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={() => setPaymentMethod('cash')}
              />
              Cash on Delivery
            </label>

          </div>
        </div>

        {/* Show error message if something failed */}
        {error && (
          <p style={{ color: 'red', fontSize: '14px', marginBottom: '15px' }}>{error}</p>
        )}

        {/* Submit button text changes based on payment method */}
        <button
          type="submit"
          disabled={submitting}
          style={{
            width: '100%',
            backgroundColor: submitting ? '#ccc' : '#e91e8c',
            color: 'white',
            border: 'none',
            padding: '14px',
            borderRadius: '8px',
            cursor: submitting ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {submitting
            ? 'Processing...'
            : paymentMethod === 'card'
              ? 'Proceed to Payment'
              : 'Place Order (Cash on Delivery)'}
        </button>

      </form>

    </div>
  );
}

export default CheckoutPage;