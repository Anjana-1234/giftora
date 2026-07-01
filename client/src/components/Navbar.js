// Import Link from react-router-dom for navigation between pages
import { Link } from 'react-router-dom';

// Import useCart hook to access live cart count
import { useCart } from '../context/CartContext';

// Import useAuth hook to access login state
import { useAuth } from '../context/AuthContext';

// Navbar component - shows at top of every page
function Navbar() {

  // Get cart count from context to show on the Cart badge
  const { getCartCount } = useCart();

  // Get the logged-in user (or null) and the logout function
  const { user, logout } = useAuth();

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
      <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>

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

        {/* Shows "Hi, [name]" + Logout if logged in, otherwise shows Login link */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ color: 'white', fontSize: '15px' }}>Hi, {user.name}</span>
            {/* Only show Admin link if the user is an admin */}
            {user.isAdmin && (
              <Link to="/admin" style={{
                color: 'white',
                textDecoration: 'none',
                fontSize: '14px',
                border: '1px solid white',
                padding: '4px 10px',
                borderRadius: '6px'
              }}>
                Admin
              </Link>
            )}
            <button
              onClick={logout}
              style={{
                background: 'transparent',
                border: '1px solid white',
                color: 'white',
                padding: '6px 14px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '500'
          }}>
            Login
          </Link>
        )}

      </div>
    </nav>
  );
}

// Export so other files can use this component
export default Navbar;