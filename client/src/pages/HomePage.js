// Import the background image
import backgroundImg from '../assets/background.png';

// Import logo for the hero section
import logo from '../assets/logo.png';

// Import Link for navigation buttons
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div>

      {/* Hero section - full screen with background image */}
      <div style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>

        {/* Dark overlay so text is readable over the background image */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.30)',
        }} />

        {/* Hero content - centered over the overlay */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          padding: '20px',
          maxWidth: '700px',
        }}>

          {/* Logo */}
          <img
            src={logo}
            alt="Giftora"
            style={{
              width: '100px',
              height: '100px',
              objectFit: 'contain',
              borderRadius: '50%',
              backgroundColor: 'white',
              padding: '8px',
              marginBottom: '20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
          />

          {/* Main heading */}
          <h1 style={{
            color: 'white',
            fontSize: 'clamp(28px, 5vw, 52px)', // scales with screen size
            fontWeight: 'bold',
            margin: '0 0 10px 0',
            textShadow: '2px 2px 8px rgba(0,0,0,0.5)',
            letterSpacing: '2px'
          }}>
            Giftora
          </h1>

          {/* Tagline */}
          <p style={{
            color: 'white',
            fontSize: 'clamp(13px, 2.5vw, 18px)',
            margin: '0 0 8px 0',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            textShadow: '1px 1px 4px rgba(0,0,0,0.5)'
          }}>
            Flowers • Gifts • Moments
          </p>

          {/* Description */}
          <p style={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: 'clamp(13px, 2vw, 16px)',
            margin: '15px 0 35px 0',
            lineHeight: '1.7',
            textShadow: '1px 1px 4px rgba(0,0,0,0.5)'
          }}>
            Discover our beautiful collection of fresh flower bouquets and
            thoughtful gifts. Perfect for every occasion - delivered with love.
          </p>

          {/* Action buttons */}
          <div style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link to="/shop">
              <button style={{
                backgroundColor: '#e91e8c',
                color: 'white',
                border: 'none',
                padding: '14px 35px',
                borderRadius: '30px',
                fontSize: 'clamp(13px, 2vw, 16px)',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(233,30,140,0.4)',
                transition: 'transform 0.2s'
              }}>
                 Shop Flowers
              </button>
            </Link>

            <Link to="/gifts">
              <button style={{
                backgroundColor: 'white',
                color: '#e91e8c',
                border: '2px solid white',
                padding: '14px 35px',
                borderRadius: '30px',
                fontSize: 'clamp(13px, 2vw, 16px)',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              }}>
                 Browse Gifts
              </button>
            </Link>
          </div>

        </div>
      </div>

      {/* Features section below the hero */}
      <div style={{
        backgroundColor: '#fff0f5',
        padding: 'clamp(30px, 5vw, 60px) 20px',
        textAlign: 'center'
      }}>
        <h2 style={{
          color: '#e91e8c',
          fontSize: 'clamp(20px, 3vw, 30px)',
          marginBottom: '40px'
        }}>
          Why Choose Giftora?
        </h2>

        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '25px 20px',
            flex: '1',
            minWidth: '200px',
            maxWidth: '280px',
            boxShadow: '0 2px 10px rgba(233,30,140,0.1)'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🌸</div>
            <h3 style={{ color: '#e91e8c', margin: '0 0 8px 0' }}>Fresh Flowers</h3>
            <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
              Hand-picked fresh bouquets in a wide range of colours and flower types, arranged with care.
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '25px 20px',
            flex: '1',
            minWidth: '200px',
            maxWidth: '280px',
            boxShadow: '0 2px 10px rgba(233,30,140,0.1)'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎁</div>
            <h3 style={{ color: '#e91e8c', margin: '0 0 8px 0' }}>Thoughtful Gifts</h3>
            <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
              Teddy bears, chocolates, perfumes, and more — the perfect add-ons for any occasion.
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '25px 20px',
            flex: '1',
            minWidth: '200px',
            maxWidth: '280px',
            boxShadow: '0 2px 10px rgba(233,30,140,0.1)'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🚚</div>
            <h3 style={{ color: '#e91e8c', margin: '0 0 8px 0' }}>Flexible Delivery</h3>
            <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
              Choose your preferred delivery date and time slot. Pay online or cash on delivery.
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '25px 20px',
            flex: '1',
            minWidth: '200px',
            maxWidth: '280px',
            boxShadow: '0 2px 10px rgba(233,30,140,0.1)'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>💳</div>
            <h3 style={{ color: '#e91e8c', margin: '0 0 8px 0' }}>Secure Payments</h3>
            <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
              Pay safely online with your card via Stripe, or choose cash on delivery at your door.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}

export default HomePage;