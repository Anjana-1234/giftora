// Import Link from react-router-dom for navigation between pages
import { Link } from 'react-router-dom'; 

// Import useCart hook to access live cart count
import { useCart } from '../context/CartContext';

// Import useAuth hook to access login state
import { useAuth } from '../context/AuthContext';

// Import the Giftora logo
import logo from '../assets/logo.png';

function Navbar() {

  // Get cart count from context to show on the Cart badge
  const { getCartCount } = useCart();

  // Get the logged-in user (or null) and the logout function
  const { user, logout } = useAuth();

  // Check if current user is admin - safely handles missing isAdmin field
  const isAdmin = user && (user.isAdmin === true);

  return (
    <nav style={{
      backgroundColor: '#e91e8c',
      padding: '12px 30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>

      {/* Left side - Logo image and shop name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img
          src={logo}
          alt="Giftora Logo"
          style={{
            height: '45px',
            width: '45px',
            objectFit: 'contain',
            borderRadius: '50%',
            backgroundColor: 'white',
            padding: '2px'
          }}
        />
        <Link to="/" style={{
          color: 'white',
          textDecoration: 'none',
          fontSize: '22px',
          fontWeight: 'bold',
          letterSpacing: '1px'
        }}>
          Giftora
        </Link>
      </div>

      {/* Right side - Navigation links */}
      <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>

        <Link to="/shop" style={{
          color: 'white',
          textDecoration: 'none',
          fontSize: '15px',
          fontWeight: '500'
        }}>
          Shop
        </Link>

        <Link to="/gifts" style={{
          color: 'white',
          textDecoration: 'none',
          fontSize: '15px',
          fontWeight: '500'
        }}>
          Gifts
        </Link>

        <Link to="/cart" style={{
          color: 'white',
          textDecoration: 'none',
          fontSize: '15px',
          fontWeight: '500'
        }}>
          Cart 🛒 {getCartCount() > 0 && `(${getCartCount()})`}
        </Link>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: 'white', fontSize: '14px' }}>Hi, {user.name}</span>
            {isAdmin && (
              <Link to="/admin" style={{
                color: 'white',
                textDecoration: 'none',
                fontSize: '13px',
                border: '1px solid white',
                padding: '4px 10px',
                borderRadius: '6px',
                backgroundColor: 'rgba(255,255,255,0.15)'
              }}>
                ⚙️ Admin
              </Link>
            )}
            <button
              onClick={logout}
              style={{
                background: 'transparent',
                border: '1px solid white',
                color: 'white',
                padding: '5px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: '500'
          }}>
            Login
          </Link>
        )}

      </div>
    </nav>
  );
}

export default Navbar;