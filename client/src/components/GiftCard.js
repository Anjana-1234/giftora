// Import useCart hook to access addToCart function
import { useCart } from '../context/CartContext';

// GiftCard displays one gift item with image, name, price, and Add to cart button
// It receives "gift" data as a prop from the parent (GiftsPage)
function GiftCard({ gift }) {

  // Get the addToCart function from our shared cart context
  const { addToCart } = useCart();

  // This runs when user clicks "Add to cart"
  function handleAddToCart() {
    addToCart({
      id: gift.id,
      name: gift.name,
      price: gift.price,
      image: gift.image,
      type: 'gift', // helps us tell gifts apart from flowers in the cart
    });
  }

  return (
    <div style={{
      border: '1px solid #f0c0d8',
      borderRadius: '12px',
      padding: '15px',
      textAlign: 'center',
      backgroundColor: 'white'
    }}>

      {/* Gift image */}
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

      {/* Gift name */}
      <h3 style={{ color: '#e91e8c', margin: '5px 0', fontSize: '16px' }}>
        {gift.name}
      </h3>

      {/* Gift price */}
      <p style={{ fontSize: '17px', fontWeight: 'bold', margin: '5px 0' }}>
        £{gift.price}
      </p>

      {/* Add to cart button */}
      <button
        onClick={handleAddToCart}
        style={{
          backgroundColor: '#e91e8c',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '8px',
          cursor: 'pointer',
          width: '100%',
          fontSize: '14px'
        }}
      >
        Add to cart
      </button>
    </div>
  );
}

export default GiftCard;