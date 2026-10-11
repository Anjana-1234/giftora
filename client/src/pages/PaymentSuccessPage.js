// useState and useEffect to manage saving the order on page load
import { useState, useEffect } from 'react';

// Link to navigate, useNavigate to redirect after saving
import { Link, useNavigate } from 'react-router-dom';

// Import cart context to clear the cart after successful payment
import { useCart } from '../context/CartContext';

// Import our pre-configured axios instance
import api from '../api/axiosConfig';

function PaymentSuccessPage() {

  // Lets us clear the cart now that payment succeeded
  const { clearCart } = useCart();

  // Lets us redirect to the confirmation page once order is saved
  const navigate = useNavigate();

  // Tracks whether we're still saving the order
  const [saving, setSaving] = useState(true);

  // Tracks any error if saving fails
  const [error, setError] = useState(null);

  // Runs once when this page loads (after Stripe redirects here)
  useEffect(() => {
    async function saveOrder() {
      try {
        // Retrieve the checkout details we saved before redirecting to Stripe
        const savedDetails = sessionStorage.getItem('checkoutDetails');

        if (!savedDetails) {
          // If there's nothing saved, we can't create the order safely
          setError('Order details not found.');
          setSaving(false);
          return;
        }

        // Parse the JSON string back into an object
        const orderData = JSON.parse(savedDetails);

        // Mark payment as completed since Stripe confirmed success before redirecting here
        orderData.paymentStatus = 'paid';

        // Save the order to MongoDB now that payment has succeeded
        const response = await api.post('/orders', orderData);

        // Clean up - remove the temporary checkout details
        sessionStorage.removeItem('checkoutDetails');

        // Empty the cart since the order is now complete
        clearCart();

        // Redirect to the order confirmation page
        navigate(`/order-confirmation/${response.data._id}`);

      } catch (err) {
        if (err.response && err.response.status === 409) {
          // Rare: the last items were bought by someone else while this customer was paying
          setError('Your payment went through, but an item sold out before we could save your order. Please contact us and we will refund you.');
        } else {
          setError('Payment succeeded, but saving your order failed. Please contact support.');
        }
        setSaving(false);
      }
    }

    saveOrder();
  }, [clearCart, navigate]);

  // Show a loading message while the order is being saved
  if (saving) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <p style={{ fontSize: '18px', color: '#e91e8c' }}>
          Payment successful! Saving your order...
        </p>
      </div>
    );
  }

  // Show error if saving failed (rare edge case)
  if (error) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <p style={{ color: 'red', marginBottom: '20px' }}>{error}</p>
        <Link to="/shop">
          <button style={{
            backgroundColor: '#e91e8c',
            color: 'white',
            border: 'none',
            padding: '12px 30px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            Back to Shop
          </button>
        </Link>
      </div>
    );
  }

  return null; // briefly nothing while navigate() redirects
}

export default PaymentSuccessPage;
