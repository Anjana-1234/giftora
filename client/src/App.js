// Import BrowserRouter for page navigation
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import our Navbar component
import Navbar from './components/Navbar';

// Import all pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';

// Main App - sets up all pages and navigation
function App() {
  return (
    // BrowserRouter enables navigation between pages
    <BrowserRouter>

      {/* Navbar shows on every page */}
      <Navbar />

      {/* Routes - decides which page to show based on URL */}
      <Routes>
        {/* Home page at localhost:3000/ */}
        <Route path="/" element={<HomePage />} />

        {/* Shop page at localhost:3000/shop */}
        <Route path="/shop" element={<ShopPage />} />

        {/* Cart page at localhost:3000/cart */}
        <Route path="/cart" element={<CartPage />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;