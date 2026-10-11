// Import tools needed to create and share context across components
import { createContext, useContext, useState } from 'react';

// Create the context - this is like a shared storage box
const CartContext = createContext();

// CartProvider wraps our whole app so every page can access the cart
export function CartProvider({ children }) {

  // cartItems holds the array of everything in the cart
  // each item looks like: { id, name, price, image, quantity, type, stock }
  // "stock" is how many were available when the item was added - it stops the
  // customer adding more than we have. The server still double-checks at checkout.
  const [cartItems, setCartItems] = useState([]);

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
