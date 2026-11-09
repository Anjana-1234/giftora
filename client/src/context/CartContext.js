// Import tools needed to create and share context across components
import { createContext, useContext, useState, useEffect, useRef } from 'react';

// Our pre-configured axios instance and the login context
import api from '../api/axiosConfig';
import { useAuth } from './AuthContext';

// Create the context - this is like a shared storage box
const CartContext = createContext();

// The cart is saved in the browser under this key, so it survives a refresh
const STORAGE_KEY = 'giftora_cart';

// Read the saved cart and clean it up. Anything unreadable or invalid is dropped,
// so a damaged value in storage can never crash the app.
function loadSavedCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const seen = new Set();
    const cleaned = [];

    for (const item of parsed.slice(0, 100)) {
      if (!item || typeof item.id !== 'string' || item.id === '' || seen.has(item.id)) continue;
      if (typeof item.name !== 'string') continue;
      if (typeof item.price !== 'number' || !Number.isFinite(item.price) || item.price < 0) continue;

      let quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity < 1) continue;

      // Never keep more in the cart than the stock we knew about
      const stock = typeof item.stock === 'number' && Number.isFinite(item.stock) ? item.stock : undefined;
      if (stock !== undefined) {
        if (stock <= 0) continue;
        quantity = Math.min(quantity, stock);
      }

      seen.add(item.id);
      cleaned.push({
        id: item.id,
        name: item.name,
        price: item.price,
        image: typeof item.image === 'string' ? item.image : '',
        type: item.type === 'gift' ? 'gift' : 'flower',
        quantity,
        ...(stock !== undefined ? { stock } : {}),
      });
    }

    return cleaned;
  } catch (error) {
    return []; // empty, corrupt, or storage not available
  }
}

function formatPrice(value) {
  return `Rs. ${Number(value).toLocaleString()}`;
}

// CartProvider wraps our whole app so every page can access the cart
export function CartProvider({ children }) {

  // cartItems holds the array of everything in the cart
  // each item looks like: { id, name, price, image, quantity, type, stock }
  // "stock" is how many were available when the item was added - it stops the
  // customer adding more than we have. The server still double-checks at checkout.
  // The starting value comes from the browser's saved cart, so a refresh keeps it.
  const [cartItems, setCartItems] = useState(loadSavedCart);

  // Messages about what changed when the cart was refreshed against the shop
  // (price changed, item removed, quantity reduced). Shown on the cart page.
  const [cartNotices, setCartNotices] = useState([]);

  // Always points at the latest cart, so async code never works with an old copy
  const cartItemsRef = useRef(cartItems);
  cartItemsRef.current = cartItems;

  const auth = useAuth();
  const user = auth ? auth.user : null;
  const authLoading = auth ? auth.loading : false;

  // 1) Save the cart in the browser every time it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      // Storage full or blocked (e.g. private mode): the cart still works, it just won't be saved
    }
  }, [cartItems]);

  // 2) If the cart was changed in another browser tab, follow it
  useEffect(() => {
    function onStorage(event) {
      if (event.key === STORAGE_KEY || event.key === null) {
        setCartItems(loadSavedCart());
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // 3) Empty the cart when the person logs out (or another account logs in),
  // so the next person on a shared computer never sees someone else's cart.
  // A guest who never logged in keeps their cart.
  const previousUserId = useRef(null);
  useEffect(() => {
    if (authLoading) return; // still checking for a saved login

    const currentId = user ? user.id : null;
    if (previousUserId.current && previousUserId.current !== currentId) {
      setCartItems([]);
      setCartNotices([]);
    }
    previousUserId.current = currentId;
  }, [user, authLoading]);

  // Check the saved cart against the shop's current data: prices change, products
  // get removed, stock runs out. Fixes the cart and records what changed.
  // If the shop can't be reached, the cart is left exactly as it is.
  async function refreshCart() {
    const ids = cartItemsRef.current.map((item) => item.id);
    if (ids.length === 0) return;

    let products;
    try {
      const response = await api.post('/products/lookup', { ids });
      products = response.data.products;
      if (!Array.isArray(products)) return;
    } catch (error) {
      return;
    }

    const freshById = new Map(products.map((p) => [String(p._id), p]));
    const notices = [];
    const updated = [];

    // Read the cart AFTER the request finished, so nothing added meanwhile is lost
    for (const item of cartItemsRef.current) {
      const fresh = freshById.get(item.id);

      if (!fresh) {
        notices.push(`${item.name} is no longer available and was removed from your cart.`);
        continue;
      }

      if (fresh.availableQuantity <= 0) {
        notices.push(`${fresh.name} is out of stock and was removed from your cart.`);
        continue;
      }

      if (Number(fresh.price) !== item.price) {
        notices.push(`${fresh.name}: the price changed from ${formatPrice(item.price)} to ${formatPrice(fresh.price)}.`);
      }

      let quantity = item.quantity;
      if (quantity > fresh.availableQuantity) {
        notices.push(`${fresh.name}: only ${fresh.availableQuantity} in stock, so the quantity was reduced from ${quantity}.`);
        quantity = fresh.availableQuantity;
      }

      updated.push({
        ...item,
        name: fresh.name,
        price: Number(fresh.price),
        stock: fresh.availableQuantity,
        quantity,
      });
    }

    setCartItems(updated);

    if (notices.length > 0) {
      setCartNotices((previous) => [...previous, ...notices.filter((n) => !previous.includes(n))]);
    }
  }

  // Refresh once when the app loads with a saved cart
  useEffect(() => {
    refreshCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function dismissNotices() {
    setCartNotices([]);
  }

  // How many of this product are already in the cart
  function getQuantityInCart(id) {
    const existing = cartItems.find((i) => i.id === id);
    return existing ? existing.quantity : 0;
  }

  // Function to add an item to the cart
  // Returns true if it was added, false if there is no more stock to add
  function addToCart(item) {
    const existing = cartItems.find((i) => i.id === item.id);
    const inCart = existing ? existing.quantity : 0;
    const stock = item.stock !== undefined ? item.stock : Infinity;

    if (inCart >= stock) {
      return false;
    }

    setCartItems((prevItems) => {

      // Check if this exact item is already in the cart
      const existingItem = prevItems.find((i) => i.id === item.id);

      if (existingItem) {
        // If it exists, increase its quantity by 1 (and refresh its stock number)
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1, stock: item.stock } : i
        );
      } else {
        // If it's new, add it to the cart with quantity 1
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });

    return true;
  }

  // Function to remove an item completely from the cart
  function removeFromCart(id) {
    setCartItems((prevItems) => prevItems.filter((i) => i.id !== id));
  }

  // Function to change the quantity of a specific item (+1 or -1)
  function updateQuantity(id, amount) {
    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.id === id) {
            // Calculate new quantity based on +1 or -1 passed in
            const newQuantity = item.quantity + amount;

            // Don't let the quantity go above the stock we have
            if (amount > 0 && item.stock !== undefined && newQuantity > item.stock) {
              return item;
            }

            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        // Remove any item whose quantity dropped to 0 or below
        .filter((item) => item.quantity > 0);
    });
  }

  // Function to empty the entire cart - called after a successful order
  function clearCart() {
    setCartItems([]);
  }

  // Function to calculate the total price of everything in the cart
  function getCartTotal() {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  // Function to count total number of items (for navbar cart icon badge)
  function getCartCount() {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }

  // Provide these values and functions to any page that needs them
  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartNotices,
        dismissNotices,
        refreshCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        getQuantityInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook so pages can easily use the cart with one line:
// const { cartItems, addToCart } = useCart();
export function useCart() {
  return useContext(CartContext);
}
