// useState lets us remember the user's filter/sort choices
import { useState } from 'react';

// Import Link to navigate to the Gifts page
import { Link } from 'react-router-dom';

// Import our flower data and reusable card component
import flowersData from '../data/flowersData';
import FlowerCard from '../components/FlowerCard';

function ShopPage() {

  // sortOrder remembers: "default", "lowToHigh", or "highToLow"
  const [sortOrder, setSortOrder] = useState('default');

  // colorFilter remembers: "All", "White", "Pink", "Red", "Yellow"
  const [colorFilter, setColorFilter] = useState('All');

  // Step A: filter flowers by selected color
  let filteredFlowers = flowersData.filter((flower) => {
    if (colorFilter === 'All') return true; // show everything
    return flower.color === colorFilter;    // show only matching color
  });

  // Step B: sort the filtered flowers by price
  if (sortOrder === 'lowToHigh') {
    // sort ascending - cheapest first
    filteredFlowers = [...filteredFlowers].sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'highToLow') {
    // sort descending - most expensive first
    filteredFlowers = [...filteredFlowers].sort((a, b) => b.price - a.price);
  }
  // if sortOrder is "default", we don't sort at all

  return (
    <div style={{ padding: '30px' }}>

      <h1 style={{ color: '#e91e8c', textAlign: 'center' }}>Order Now! </h1>

      {/* Filter and Sort controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '30px',
        margin: '20px 0',
        flexWrap: 'wrap'
      }}>

        {/* Sort by price dropdown */}
        <div>
          <label style={{ marginRight: '8px', fontWeight: 'bold', color: '#e91e8c' }}>
            Sort by Price:
          </label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="lowToHigh">Low to High</option>
            <option value="highToLow">High to Low</option>
          </select>
        </div>

        {/* Filter by color dropdown */}
        <div>
          <label style={{ marginRight: '8px', fontWeight: 'bold', color: '#e91e8c' }}>
            Filter by Color:
          </label>
          <select
            value={colorFilter}
            onChange={(e) => setColorFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="White">White</option>
            <option value="Pink">Pink</option>
            <option value="Red">Red</option>
            <option value="Yellow">Yellow</option>
          </select>
        </div>
      </div>

      {/* Add gift items button - navigates to /gifts page */}
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
        {/* Loop through filteredFlowers and render a FlowerCard for each */}
        {filteredFlowers.map((flower) => (
          <FlowerCard key={flower.id} flower={flower} />
        ))}
      </div>

    </div>
  );
}

export default ShopPage;