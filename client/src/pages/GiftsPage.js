// Import Link to navigate back to Shop page
import { Link } from 'react-router-dom';

// Import gift data and reusable card component
import giftsData from '../data/giftsData';
import GiftCard from '../components/GiftCard';

function GiftsPage() {
  return (
    <div style={{ padding: '30px' }}>

      {/* Header row with title and back-to-shop button */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto 20px auto',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <h1 style={{ color: '#e91e8c', margin: 0 }}>Gift Items </h1>

        {/* Link back to shop page */}
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
        Add a little extra to your bouquet — pick one or more gifts below.
      </p>

      {/* Grid of gift cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Loop through giftsData and render a GiftCard for each */}
        {giftsData.map((gift) => (
          <GiftCard key={gift.id} gift={gift} />
        ))}
      </div>

    </div>
  );
}

export default GiftsPage;