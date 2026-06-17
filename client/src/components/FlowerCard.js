// Import useCart hook to access addToCart function
import { useCart } from '../context/CartContext';

// FlowerCard displays one bouquet with image, name, price, and Add to cart button
// It receives "flower" data as a prop from the parent (ShopPage)
function FlowerCard({ flower }) {

  // Get the addToCart function from our shared cart context
  const { addToCart } = useCart();

  // This runs when user clicks "Add to cart"
  function handleAddToCart() {
    addToCart({
      id: flower.id,
      name: flower.name,
      price: flower.price,
      image: flower.image,
      type: 'flower', // helps us tell flowers apart from gifts later
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

      {/* Bouquet image */}
      <img
        src={flower.image}
        alt={flower.name}
        style={{
          width: '100%',
          height: '180px',
          objectFit: 'cover',
          borderRadius: '8px',
          marginBottom: '10px'
        }}
      />

      {/* Bouquet name */}
      <h3 style={{ color: '#e91e8c', margin: '5px 0' }}>{flower.name}</h3>

      {/* Bouquet price */}
      <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '5px 0' }}>
        £{flower.price}
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

export default FlowerCard;