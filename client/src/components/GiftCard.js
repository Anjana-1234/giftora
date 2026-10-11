// useState to control whether the description modal is open
import { useState } from 'react';
import { useCart } from '../context/CartContext';

function GiftCard({ gift }) {

  const { addToCart } = useCart();

  // Controls whether the description popup is visible
  const [showModal, setShowModal] = useState(false);

  // Short message shown when the customer tries to add more than we have
  const [notice, setNotice] = useState('');

  // Stock info coming from the database
  const stock = gift.availableQuantity !== undefined ? gift.availableQuantity : 100;
  const soldOut = stock <= 0;
  const lowStock = !soldOut && stock <= 5;

  function handleAddToCart() {
    if (soldOut) return;

    const added = addToCart({
      id: gift.id,
      name: gift.name,
      price: gift.price,
      image: gift.image,
      type: 'gift',
      stock: stock,
    });

    // No more stock to add - tell the customer for a moment
    if (!added) {
      setNotice(`Only ${stock} available`);
      setTimeout(() => setNotice(''), 2500);
    }
  }

  return (
    <>
      {/* Gift card */}
      <div style={{
        border: '1px solid #f0c0d8',
        borderRadius: '12px',
        padding: '15px',
        textAlign: 'center',
        backgroundColor: 'white',
        position: 'relative'
      }}>

        {/* Clicking the image shows the description modal */}
        <div
          onClick={() => setShowModal(true)}
          style={{ cursor: 'pointer', position: 'relative' }}
          title="Click to see details"
        >
          <img
            src={gift.image}
            alt={gift.name}
            style={{
              width: '100%',
              height: '160px',
              objectFit: 'cover',
              borderRadius: '8px',
              marginBottom: '10px',
              opacity: soldOut ? 0.45 : 1
            }}
          />
          {/* Small info badge on the image */}
          <span style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            backgroundColor: '#8d2c61',
            color: 'white',
            borderRadius: '50%',
            width: '22px',
            height: '22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            i
          </span>
          {soldOut && (
            <span style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#555',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              Out of stock
            </span>
          )}
        </div>

        <h3 style={{ color: '#961e60', margin: '5px 0', fontSize: '14px' }}>
          {gift.name}
        </h3>

        <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '5px 0' }}>
          Rs. {gift.price.toLocaleString()}
        </p>

        {lowStock && (
          <p style={{ margin: '0 0 2px', fontSize: '12px', color: '#c2410c' }}>
            Only {stock} left
          </p>
        )}
        {notice && (
          <p style={{ margin: '0 0 2px', fontSize: '12px', color: '#b23a3a' }}>{notice}</p>
        )}

        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
          {/* Details button */}
          <button
            onClick={() => setShowModal(true)}
            style={{
              flex: 1,
              backgroundColor: 'white',
              color: '#752e55',
              border: '1px solid #8f446d',
              padding: '8px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            Details
          </button>

          {/* Add to cart button */}
          <button
            onClick={handleAddToCart}
            disabled={soldOut}
            style={{
              flex: 2,
              backgroundColor: soldOut ? '#bbb' : '#883c66',
              color: 'white',
              border: 'none',
              padding: '8px',
              borderRadius: '8px',
              cursor: soldOut ? 'not-allowed' : 'pointer',
              fontSize: '13px'
            }}
          >
            {soldOut ? 'Out of stock' : 'Add to cart'}
          </button>
        </div>
      </div>

      {/* Description modal popup */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          {/* Modal content - stop click from closing when clicking inside */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '25px',
              maxWidth: '400px',
              width: '100%',
              position: 'relative'
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'transparent',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#999'
              }}
            >
              ✕
            </button>

            <img
              src={gift.image}
              alt={gift.name}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '8px',
                marginBottom: '15px'
              }}
            />

            <h2 style={{ color: '#9b2a68', margin: '0 0 8px 0', fontSize: '18px' }}>
              {gift.name}
            </h2>

            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', margin: '0 0 12px 0' }}>
              Rs. {gift.price.toLocaleString()}
            </p>

            <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.6', margin: '0 0 20px 0' }}>
              {gift.description}
            </p>

            <button
              onClick={() => { handleAddToCart(); setShowModal(false); }}
              disabled={soldOut}
              style={{
                width: '100%',
                backgroundColor: soldOut ? '#bbb' : '#97386c',
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '8px',
                cursor: soldOut ? 'not-allowed' : 'pointer',
                fontSize: '15px',
                fontWeight: 'bold'
              }}
            >
              {soldOut ? 'Out of stock' : 'Add to cart'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default GiftCard;
