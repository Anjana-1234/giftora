// useState lets us remember filter/sort choices and store fetched data
// useEffect lets us run code when the page first loads
import { useState, useEffect } from 'react';

// Import Link to navigate to the Gifts page
import { Link } from 'react-router-dom';

// Import our pre-configured axios instance
import api from '../api/axiosConfig';

// Import the image map (filename -> actual image)
import flowerImages from '../data/flowersData';

// Import reusable card component
import FlowerCard from '../components/FlowerCard';

function ShopPage() {

  // Holds the list of flowers fetched from the backend
  const [flowers, setFlowers] = useState([]);

  // Tracks whether data is still loading
  const [loading, setLoading] = useState(true);

  // Tracks if something went wrong while fetching
  const [error, setError] = useState(null);

  // sortOrder remembers: "default", "lowToHigh", or "highToLow"
  const [sortOrder, setSortOrder] = useState('default');

  // colorFilter remembers: "All", "White", "Pink", "Red", "Yellow"
  const [colorFilter, setColorFilter] = useState('All');

  // useEffect runs once when the page first loads (empty dependency array [])
  useEffect(() => {
    // Function to fetch flowers from our backend API
    async function fetchFlowers() {
      try {
        // Call GET /api/products/flowers
        const response = await api.get('/products/flowers');

        // response.data is the array of flowers from MongoDB
        // We map over it to attach the correct image using our image map
        const flowersWithImages = response.data.map((flower) => ({
          ...flower,
          id: flower._id,
          image: flowerImages[flower.image],
          description: flower.description, // pass description for the modal
        }));

        setFlowers(flowersWithImages);
        setLoading(false);
      } catch (err) {
        // If the fetch fails (server down, network error, etc.)
        setError('Could not load flowers. Please make sure the server is running.');
        setLoading(false);
      }
    }

    fetchFlowers();
  }, []); // empty array means this only runs once when the page loads

  // Step A: filter flowers by selected color
  let filteredFlowers = flowers.filter((flower) => {
    if (colorFilter === 'All') return true;
    return flower.color === colorFilter;
  });

  // Step B: sort the filtered flowers by price
  if (sortOrder === 'lowToHigh') {
    filteredFlowers = [...filteredFlowers].sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'highToLow') {
    filteredFlowers = [...filteredFlowers].sort((a, b) => b.price - a.price);
  }

  // Show a loading message while data is being fetched
  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <p style={{ fontSize: '18px', color: '#e91e8c' }}>Loading flowers... 🌸</p>
      </div>
    );
  }

  // Show an error message if the fetch failed
  if (error) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <p style={{ fontSize: '16px', color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px' }}>

      <h1 style={{ color: '#a13f75', textAlign: 'center' }}>Our Flower Collection</h1>

      {/* Filter and Sort controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '30px',
        margin: '20px 0',
        flexWrap: 'wrap'
      }}>

        <div>
          <label style={{ marginRight: '8px', fontWeight: 'bold', color: '#e91e8c' }}>
            Sort by Price:
          </label>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="default">Default</option>
            <option value="lowToHigh">Low to High</option>
            <option value="highToLow">High to Low</option>
          </select>
        </div>

        <div>
          <label style={{ marginRight: '8px', fontWeight: 'bold', color: '#e91e8c' }}>
            Filter by Color:
          </label>
          <select
            value={colorFilter}
            onChange={(e) => setColorFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Red">Red</option>
            <option value="Pink">Pink</option>
            <option value="White">White</option>
            <option value="Yellow">Yellow</option>
            <option value="Blue">Blue</option>
            <option value="Purple">Purple</option>
            <option value="Mixed">Mixed</option>
          </select>
        </div>
      </div>

      {/* Add gift items button */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <Link to="/gifts">
          <button style={{
            backgroundColor: 'white',
            color: '#e91e8c',
            border: '2px solid #e91e8c',
            padding: '12px 30px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
             Add Gift Items
          </button>
        </Link>
      </div>

      {/* Grid of flower cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {filteredFlowers.map((flower) => (
          <FlowerCard key={flower.id} flower={flower} />
        ))}
      </div>

    </div>
  );
}

export default ShopPage;