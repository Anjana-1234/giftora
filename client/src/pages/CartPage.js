// useEffect lets us refresh the cart when this page opens
import { useEffect } from 'react';

// Import Link to navigate to shop if cart is empty, and to checkout page
import { Link } from 'react-router-dom';

// Import useCart hook to access cart data and functions
import { useCart } from '../context/CartContext';

// Box listing what changed when the cart was checked against the shop
// (a price changed, an item sold out or was removed, a quantity was reduced)
function CartNotices({ notices, onDismiss }) {
  if (notices.length === 0) return null;

  return (
    <div style={{
      backgroundColor: '#fff4e5',
      border: '1px solid #f5c58a',
      borderRadius: '8px',
      padding: '12px 15px',
      margin: '15px 0',
      fontSize: '14px',
      color: '#7a4a00',
      textAlign: 'left'
    }}>
      <strong>Your cart was updated:</strong>
      <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
        {notices.map((text) => (
          <li key={text}>{text}</li>
        ))}
      </ul>
      <button
        onClick={onDismiss}
        style={{
          background: 'none',
          border: 'none',
          color: '#e91e8c',
          fontWeight: 'bold',
          cursor: 'pointer',
          padding: 0,
          fontSize: '14px'
        }}
      >
        Got it
      </button>
    </div>
  );
}

function CartPage() {

  // Get cart items and functions from our shared cart context
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    cartNotices,
    dismissNotices,
    refreshCart,
  } = useCart();

  // Every time the cart page opens, check the cart against the shop's
  // current prices and stock
  useEffect(() => {
    refreshCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If cart is empty, show a friendly message with a link to shop
  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '60px 30px', textAlign: 'center' }}>
        <h1 style={{ color: '#e91e8c' }}>Your Cart </h1>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <CartNotices notices={cartNotices} onDismiss={dismissNotices} />
        </div>
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

      <h1 style={{ color: '#a13f75', textAlign: 'center' }}>Your Cart </h1>

      <CartNotices notices={cartNotices} onDismiss={dismissNotices} />

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
              {item.stock !== undefined && item.quantity >= item.stock && (
                <p style={{ margin: '4px 0 0', color: '#c2410c', fontSize: '12px' }}>
                  That is all we have in stock ({item.stock} available)
                </p>
              )}
            </div>

            {/* Quantity controls - minus button, count, plus button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Decrease quantity button */}
              <button
                onClick={() => updateQuantity(item.id, -1)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  border: '1px solid #e91e8c',
                  backgroundColor: 'white',
                  color: '#e91e8c',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                -
              </button>

              {/* Current quantity number */}
              <span style={{ fontSize: '15px', minWidth: '20px', textAlign: 'center' }}>
                {item.quantity}
              </span>

              {/* Increase quantity button - disabled once the cart holds all the stock we have */}
              <button
                onClick={() => updateQuantity(item.id, 1)}
                disabled={item.stock !== undefined && item.quantity >= item.stock}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: item.stock !== undefined && item.quantity >= item.stock ? '#ccc' : '#e91e8c',
                  backgroundColor: 'white',
                  color: item.stock !== undefined && item.quantity >= item.stock ? '#ccc' : '#e91e8c',
                  cursor: item.stock !== undefined && item.quantity >= item.stock ? 'not-allowed' : 'pointer',
                  fontSize: '16px'
                }}
              >
                +
              </button>
            </div>

            {/* Price for this line (price × quantity) */}
            <div style={{ fontWeight: 'bold', minWidth: '70px', textAlign: 'right' }}>
              Rs. {(item.price * item.quantity).toLocaleString()}
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
        <h2 style={{ color: '#e91e8c', margin: 0 }}>Rs. {getCartTotal().toLocaleString()}</h2>
      </div>

      {/* Checkout button - navigates to the checkout form page */}
      <div style={{ textAlign: 'center', marginTop: '25px' }}>
        <Link to="/checkout">
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
        </Link>
      </div>

    </div>
  );
}

export default CartPage;
