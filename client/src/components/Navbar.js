// Import Link from react-router-dom for navigation between pages
import { Link } from 'react-router-dom';

// Import useCart hook to access live cart count
import { useCart } from '../context/CartContext';

// Navbar component - shows at top of every page
function Navbar() {

  // Get cart count from context to show on the Cart badge
  const { getCartCount } = useCart();

  return (
    // Main navbar container with pink background
    <nav style={{
      backgroundColor: '#e91e8c',
      padding: '15px 30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>

      {/* Left side - Logo and shop name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '24px' }}>🌸</span>
        <Link to="/" style={{
          color: 'white',
          textDecoration: 'none',
          fontSize: '22px',
          fontWeight: 'bold'
        }}>
          Valentine's Flowers
        </Link>
      </div>

      {/* Right side - Navigation links */}
      <div style={{ display: 'flex', gap: '30px' }}>

        {/* Shop link */}
        <Link to="/shop" style={{
          color: 'white',
          textDecoration: 'none',
          fontSize: '16px',
          fontWeight: '500'
        }}>
          Shop
        </Link>

        {/* Cart link - shows live item count when cart has items */}
        <Link to="/cart" style={{
          color: 'white',
          textDecoration: 'none',
          fontSize: '16px',
          fontWeight: '500'
        }}>
          Cart 🛒 {getCartCount() > 0 && `(${getCartCount()})`}
        </Link>

        {/* Login link */}
        <Link to="/login" style={{
          color: 'white',
          textDecoration: 'none',
          fontSize: '16px',
          fontWeight: '500'
        }}>
          Login
        </Link>

      </div>
    </nav>
  );
}

// Export so other files can use this component
export default Navbar;