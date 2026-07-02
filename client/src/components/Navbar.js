import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

function Navbar() {

  const { getCartCount } = useCart();
  const { user, logout } = useAuth();
  const isAdmin = user && (user.isAdmin === true);

  // Controls whether mobile menu is open or closed
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{
      backgroundColor: '#e91e8c',
      padding: '12px 20px',
      position: 'sticky',
      top: 0,
      zIndex: 999,
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
    }}>

      {/* Top bar - logo + hamburger */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>

        {/* Left - Logo and name */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none'
        }}
          onClick={() => setMenuOpen(false)}
        >
          <img
            src={logo}
            alt="Giftora Logo"
            style={{
              height: '42px',
              width: '42px',
              objectFit: 'contain',
              borderRadius: '50%',
              backgroundColor: 'white',
              padding: '2px'
            }}
          />
          <span style={{
            color: 'white',
            fontSize: '22px',
            fontWeight: 'bold',
            letterSpacing: '1px'
          }}>
            Giftora
          </span>
        </Link>

        {/* Desktop links - hidden on mobile */}
        <div style={{
          display: 'flex',
          gap: '25px',
          alignItems: 'center'
        }}
          className="desktop-nav"
        >
          <Link to="/shop" style={linkStyle}>Shop</Link>
          <Link to="/gifts" style={linkStyle}>Gifts</Link>
          <Link to="/cart" style={linkStyle}>
            Cart 🛒 {getCartCount() > 0 && `(${getCartCount()})`}
          </Link>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: 'white', fontSize: '14px' }}>Hi, {user.name.split(' ')[0]}</span>
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
              <button onClick={logout} style={logoutBtnStyle}>Logout</button>
            </div>
          ) : (
            <Link to="/login" style={linkStyle}>Login</Link>
          )}
        </div>

        {/* Hamburger button - only visible on mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '26px',
            cursor: 'pointer',
            display: 'none', // shown via CSS below
            padding: '0 4px'
          }}
          className="hamburger-btn"
        >
          {menuOpen ? '✕' : '☰'}
        </button>

      </div>

      {/* Mobile menu - only shows when menuOpen is true */}
      {menuOpen && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          marginTop: '12px',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255,255,255,0.3)'
        }}>
          <Link to="/shop" style={mobileLinkStyle} onClick={() => setMenuOpen(false)}>🌺 Shop</Link>
          <Link to="/gifts" style={mobileLinkStyle} onClick={() => setMenuOpen(false)}>🎁 Gifts</Link>
          <Link to="/cart" style={mobileLinkStyle} onClick={() => setMenuOpen(false)}>
            🛒 Cart {getCartCount() > 0 && `(${getCartCount()})`}
          </Link>

          {user ? (
            <>
              <span style={{ color: 'rgba(255,255,255,0.8)', padding: '10px 0', fontSize: '14px' }}>
                Hi, {user.name}
              </span>
              {isAdmin && (
                <Link to="/admin" style={mobileLinkStyle} onClick={() => setMenuOpen(false)}>
                  ⚙️ Admin Dashboard
                </Link>
              )}
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                style={{
                  ...logoutBtnStyle,
                  width: '100%',
                  marginTop: '4px',
                  padding: '10px'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" style={mobileLinkStyle} onClick={() => setMenuOpen(false)}>
              👤 Login
            </Link>
          )}
        </div>
      )}

      {/* Inline CSS for responsive breakpoint */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .hamburger-btn {
            display: block !important;
          }
        }
      `}</style>

    </nav>
  );
}

// Shared style objects
const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  fontSize: '15px',
  fontWeight: '500'
};

const mobileLinkStyle = {
  color: 'white',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: '500',
  padding: '10px 0',
  borderBottom: '1px solid rgba(255,255,255,0.15)',
  display: 'block'
};

const logoutBtnStyle = {
  background: 'transparent',
  border: '1px solid white',
  color: 'white',
  padding: '5px 12px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '13px'
};

export default Navbar;