// Import Link to navigate to shop if cart is empty
import { Link } from 'react-router-dom';

// Import useCart hook to access cart data and functions
import { useCart } from '../context/CartContext';

function CartPage() {

  // Get cart items and functions from our shared cart context
  const { cartItems, removeFromCart, getCartTotal } = useCart();

  // If cart is empty, show a friendly message with a link to shop
  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '60px 30px', textAlign: 'center' }}>
        <h1 style={{ color: '#e91e8c' }}>Your Cart </h1>
        <p style={{ fontSize: '16px', color: '#666', margin: '20px 0' }}>
          Your cart is empty.
        </p>
        <Link to="/shop">
          <button style={{
            backgroundColor: '#e91e8c',
            color: 'white',
            border: 'none',
            padding: '12px 30px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}>
            Browse Bouquets
          </button>
        </Link>
      </div>
    );
  }

  // If cart has items, show the full list
  return (
    <div style={{ padding: '30px', maxWidth: '700px', margin: '0 auto' }}>

      <h1 style={{ color: '#e91e8c', textAlign: 'center' }}>Your Cart 🛒</h1>

      {/* List of cart items */}
      <div style={{ marginTop: '20px' }}>
        {/* Loop through every item currently in the cart */}
        {cartItems.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              padding: '15px',
              borderBottom: '1px solid #f0c0d8'
            }}
          >
            {/* Item image */}
            <img
              src={item.image}
              alt={item.name}
              style={{
                width: '70px',
                height: '70px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />

            {/* Item name and type (flower or gift) */}
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 4px 0', color: '#333' }}>{item.name}</h3>
              <p style={{ margin: 0, color: '#999', fontSize: '13px' }}>
                {item.type === 'flower' ? 'Bouquet' : 'Gift item'}
              </p>
            </div>

            {/* Quantity */}
            <div style={{ fontSize: '15px', color: '#666' }}>
              Qty: {item.quantity}
            </div>

            {/* Price for this line (price × quantity) */}
            <div style={{ fontWeight: 'bold', minWidth: '70px', textAlign: 'right' }}>
              £{(item.price * item.quantity).toFixed(2)}
            </div>

            {/* Remove button */}
            <button
              onClick={() => removeFromCart(item.id)}
              style={{
                backgroundColor: 'transparent',
                color: '#e91e8c',
                border: '1px solid #e91e8c',
                borderRadius: '6px',
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Grand total */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '25px',
        paddingTop: '15px',
        borderTop: '2px solid #e91e8c'
      }}>
        <h2 style={{ color: '#333', margin: 0 }}>Total:</h2>
        <h2 style={{ color: '#e91e8c', margin: 0 }}>£{getCartTotal().toFixed(2)}</h2>
      </div>

      {/* Checkout button - will connect to delivery/payment later */}
      <div style={{ textAlign: 'center', marginTop: '25px' }}>
        <button style={{
          backgroundColor: '#e91e8c',
          color: 'white',
          border: 'none',
          padding: '14px 40px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold'
        }}>
          Proceed to Checkout
        </button>
      </div>

    </div>
  );
}

export default CartPage;