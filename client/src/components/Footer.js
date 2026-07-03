import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

function Footer() {
  return (
    <footer style={{
      backgroundColor: '#1a0a0f',
      color: 'white',
      padding: '50px 40px 20px',
      marginTop: 'auto'
    }}>

      {/* Main footer content */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '40px',
        justifyContent: 'space-between',
        maxWidth: '1200px',
        margin: '0 auto 40px auto'
      }}>

        {/* Column 1 - Logo and tagline */}
        <div style={{ flex: '1', minWidth: '200px', maxWidth: '280px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <img
              src={logo}
              alt="Giftora"
              style={{
                width: '50px',
                height: '50px',
                objectFit: 'contain',
                borderRadius: '50%',
                backgroundColor: 'white',
                padding: '3px'
              }}
            />
            <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#e91e8c' }}>
              Giftora
            </span>
          </div>
          <p style={{ color: '#aaa', fontSize: '14px', lineHeight: '1.7', margin: '0 0 15px 0' }}>
            Bringing joy through beautiful flowers and thoughtful gifts. 
            Perfect for every occasion, delivered with love.
          </p>
          <p style={{ color: '#e91e8c', fontSize: '13px', letterSpacing: '2px' }}>
            FLOWERS • GIFTS • MOMENTS
          </p>
        </div>

        {/* Column 2 - Quick links */}
        <div style={{ flex: '1', minWidth: '150px' }}>
          <h3 style={{
            color: 'white',
            fontSize: '16px',
            marginBottom: '18px',
            paddingBottom: '8px',
            borderBottom: '2px solid #e91e8c',
            display: 'inline-block'
          }}>
            Quick Links
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { to: '/', label: 'Home' },
              { to: '/shop', label: 'Flower Shop' },
              { to: '/gifts', label: 'Gift Collection' },
              { to: '/cart', label: 'My Cart' },
              { to: '/login', label: 'Login' },
              { to: '/signup', label: 'Sign Up' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  color: '#aaa',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.color = '#e91e8c'}
                onMouseLeave={(e) => e.target.style.color = '#aaa'}
              >
                → {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Column 3 - Contact info */}
        <div style={{ flex: '1', minWidth: '200px' }}>
          <h3 style={{
            color: 'white',
            fontSize: '16px',
            marginBottom: '18px',
            paddingBottom: '8px',
            borderBottom: '2px solid #e91e8c',
            display: 'inline-block'
          }}>
            Contact Us
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <span style={{ fontSize: '18px' }}>📍</span>
              <span style={{ color: '#aaa', fontSize: '14px', lineHeight: '1.5' }}>
                Colombo, Sri Lanka
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '18px' }}>📞</span>
              <span style={{ color: '#aaa', fontSize: '14px' }}>
                +94 71 143 9792
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '18px' }}>✉️</span>
              <span style={{ color: '#aaa', fontSize: '14px' }}>
                hello@giftora.lk
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '18px' }}>🕐</span>
              <span style={{ color: '#aaa', fontSize: '14px' }}>
                Mon - Sun: 8am - 9pm
              </span>
            </div>
          </div>
        </div>

        {/* Column 4 - Social media */}
        <div style={{ flex: '1', minWidth: '150px' }}>
          <h3 style={{
            color: 'white',
            fontSize: '16px',
            marginBottom: '18px',
            paddingBottom: '8px',
            borderBottom: '2px solid #e91e8c',
            display: 'inline-block'
          }}>
            Follow Us
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { icon: '📘', label: 'Facebook', url: 'https://facebook.com' },
              { icon: '📸', label: 'Instagram', url: 'https://instagram.com' },
              { icon: '🐦', label: 'Twitter / X', url: 'https://twitter.com' },
              { icon: '▶️', label: 'YouTube', url: 'https://youtube.com' },
            ].map((social) => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#aaa',
                  textDecoration: 'none',
                  fontSize: '14px',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#e91e8c'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#aaa'}
              >
                <span style={{ fontSize: '18px' }}>{social.icon}</span>
                {social.label}
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* Divider */}
      <div style={{
        borderTop: '1px solid #333',
        paddingTop: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>
          © 2026 Giftora. All rights reserved.
        </p>
        <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>
          Made with 🌸 in Sri Lanka
        </p>
      </div>

    </footer>
  );
}

export default Footer;