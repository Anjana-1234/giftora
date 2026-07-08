import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

function Navbar() {

  const { getCartCount } = useCart();
  const { user, logout } = useAuth();
  const isAdmin = user && (user.isAdmin === true);
  const location = useLocation(); // to highlight active link

  // Controls mobile hamburger menu
  const [menuOpen, setMenuOpen] = useState(false);

  // Returns true if the current URL matches the given path
  function isActive(path) {
    return location.pathname === path;
  }

  // Style for desktop nav links
  function navLinkStyle(path) {
    
    return {
      color: isActive(path) ? '#e91e8c' : 'white',
      textDecoration: 'none',
      fontSize: '15px',
      fontWeight: isActive(path) ? 'bold' : 'normal',
      padding: '6px 4px',
      borderBottom: isActive(path) ? '3px solid white' : '3px solid transparent',
      transition: 'all 0.2s'
    };
  }

  return (
    <>
      {/* Main navbar */}
      <nav style={{
        backgroundColor: '#ffffff',
        padding: '15px 20px',
        position: 'sticky',
        top: 0,
        zIndex: 999,
        boxShadow: '0 2px 15px rgba(207, 21, 124, 0.3)'
      }}>

        {/* Inner wrapper - rounded pill shape like sample */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
          backgroundColor: '#832c5c',
          borderRadius: '50px',
          padding: '15px 20px'
        }}>

          {/* Left — Logo + name */}
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none'
            }}
          >
            <img
              src={logo}
              alt="Giftora"
              style={{
                height: '44px',
                width: '44px',
                objectFit: 'contain',
                borderRadius: '50%',
                backgroundColor: 'white',
                padding: '3px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
            />
            <span style={{
              color: 'white',
              fontSize: '25px',
              fontWeight: 'bold',
              letterSpacing: '1px'
            }}>
              Giftora
            </span>
          </Link>

          {/* Center — Desktop nav links */}
          <div
            className="desktop-nav"
            style={{
              display: 'flex',
              gap: '30px',
              alignItems: 'center'
            }}
          >
            {[
              { to: '/', label: 'Home' },
              { to: '/shop', label: 'Flowers' },
              { to: '/gifts', label: 'Gifts' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: 'px',
                  fontWeight: isActive(link.to) ? 'bold' : '500',
                  padding: '6px 4px',
                  borderBottom: isActive(link.to)
                    ? '3px solid white'
                    : '3px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right — Cart icon + Login/User */}
          <div
            className="desktop-nav"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}
          >
            {/* Cart icon button */}
            <Link to="/cart" style={{ textDecoration: 'none', position: 'relative' }}>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderRadius: '50%',
                width: '42px',
                height: '42px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.3)'
              }}>
                🛒
              </div>
              {/* Cart count badge */}
              {getCartCount() > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  backgroundColor: 'white',
                  color: '#e91e8c',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* User section */}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: 'white', fontSize: '14px' }}>
                  Hi, {user.name.split(' ')[0]}
                </span>
                {isAdmin && (
                  <Link to="/admin" style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '13px',
                    border: '1px solid white',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(255,255,255,0.15)'
                  }}>
                    ⚙️ Admin
                  </Link>
                )}
                <button
                  onClick={logout}
                  style={{
                    backgroundColor: 'white',
                    color: '#e91e8c',
                    border: 'none',
                    padding: '8px 20px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <button style={{
                  backgroundColor: 'white',
                  color: '#e91e8c',
                  border: 'none',
                  padding: '8px 24px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}>
                  Login
                </button>
              </Link>
            )}
          </div>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="hamburger-btn"
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.5)',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: '8px',
              display: 'none'
            }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>

        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div style={{
            maxWidth: '1200px',
            margin: '10px auto 0',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '15px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px'
          }}>
            {[
              { to: '/', label: '🏠 Home' },
              { to: '/shop', label: '🌺 Flowers' },
              { to: '/gifts', label: '🎁 Gifts' },
              { to: '/cart', label: `🛒 Cart${getCartCount() > 0 ? ` (${getCartCount()})` : ''}` },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '15px',
                  padding: '10px 5px',
                  borderBottom: '1px solid rgba(255,255,255,0.15)',
                  fontWeight: isActive(link.to) ? 'bold' : 'normal'
                }}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <>
                <span style={{ color: 'rgba(255,255,255,0.8)', padding: '10px 5px', fontSize: '14px' }}>
                  👤 Hi, {user.name}
                </span>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    style={{
                      color: 'white',
                      textDecoration: 'none',
                      fontSize: '15px',
                      padding: '10px 5px',
                      borderBottom: '1px solid rgba(255,255,255,0.15)'
                    }}
                  >
                    ⚙️ Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  style={{
                    marginTop: '8px',
                    backgroundColor: 'white',
                    color: '#e91e8c',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    width: '100%'
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                style={{ textDecoration: 'none', marginTop: '8px' }}
              >
                <button style={{
                  width: '100%',
                  backgroundColor: 'white',
                  color: '#e91e8c',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  Login
                </button>
              </Link>
            )}
          </div>
        )}

        {/* Responsive CSS */}
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
    </>
  );
}

export default Navbar;