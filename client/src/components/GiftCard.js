// useState to control whether the description modal is open
import { useState } from 'react';
import { useCart } from '../context/CartContext';

function GiftCard({ gift }) {

  const { addToCart } = useCart();

  // Controls whether the description popup is visible
  const [showModal, setShowModal] = useState(false);

  function handleAddToCart() {
    addToCart({
      id: gift.id,
      name: gift.name,
      price: gift.price,
      image: gift.image,
      type: 'gift',
    });
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
              marginBottom: '10px'
            }}
          />
          {/* Small info badge on the image */}
          <span style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            backgroundColor: '#e91e8c',
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
        </div>

        <h3 style={{ color: '#e91e8c', margin: '5px 0', fontSize: '14px' }}>
          {gift.name}
        </h3>

        <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '5px 0' }}>
          Rs. {gift.price.toLocaleString()}
        </p>

        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
          {/* Details button */}
          <button
            onClick={() => setShowModal(true)}
            style={{
              flex: 1,
              backgroundColor: 'white',
              color: '#e91e8c',
              border: '1px solid #e91e8c',
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
            style={{
              flex: 2,
              backgroundColor: '#e91e8c',
              color: 'white',
              border: 'none',
              padding: '8px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            Add to cart
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

            <h2 style={{ color: '#e91e8c', margin: '0 0 8px 0', fontSize: '18px' }}>
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
              style={{
                width: '100%',
                backgroundColor: '#e91e8c',
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: 'bold'
              }}
            >
              Add to cart
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default GiftCard;