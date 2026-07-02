// useState and useEffect for fetching and storing data
import { useState, useEffect } from 'react';

// Import Link to navigate back to Shop page
import { Link } from 'react-router-dom';

// Import our pre-configured axios instance
import api from '../api/axiosConfig';

// Import the image map (filename -> actual image)
import giftImages from '../data/giftsData';

// Import reusable card component
import GiftCard from '../components/GiftCard';

function GiftsPage() {

  // Holds the list of gifts fetched from the backend
  const [gifts, setGifts] = useState([]);

  // Tracks whether data is still loading
  const [loading, setLoading] = useState(true);

  // Tracks if something went wrong while fetching
  const [error, setError] = useState(null);

  // Runs once when the page first loads
  useEffect(() => {
    async function fetchGifts() {
      try {
        // Call GET /api/products/gifts
        const response = await api.get('/products/gifts');

        // Attach the correct image to each gift using our image map
        const giftsWithImages = response.data.map((gift) => ({
          ...gift,
          id: gift._id,
          image: giftImages[gift.image],
          description: gift.description, // pass description for the modal
        }));

        setGifts(giftsWithImages);
        setLoading(false);
      } catch (err) {
        setError('Could not load gifts. Please make sure the server is running.');
        setLoading(false);
      }
    }

    fetchGifts();
  }, []);

  // Show loading message
  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <p style={{ fontSize: '18px', color: '#e91e8c' }}>Loading gifts... 🎁</p>
      </div>
    );
  }

  // Show error message
  if (error) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <p style={{ fontSize: '16px', color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px' }}>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto 20px auto',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <h1 style={{ color: '#a13f75', margin: 0 }}>Gift Collection</h1>

        <Link to="/shop">
          <button style={{
            backgroundColor: 'white',
            color: '#e91e8c',
            border: '2px solid #e91e8c',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            ← Back to Shop
          </button>
        </Link>
      </div>

      <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
        Add a little extra to your bouquet - pick one or more gifts below.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {gifts.map((gift) => (
          <GiftCard key={gift.id} gift={gift} />
        ))}
      </div>

    </div>
  );
}

export default GiftsPage;