import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();

  // Load cart from database when user logs in
  useEffect(() => {
    const loadCartFromDB = async () => {
      if (user && user.role === 'Customer') {
        try {
          const response = await axios.get('/api/customer/cart');
          setCartItems(response.data.items || []);
        } catch (error) {
          console.error('Error loading cart:', error);
        }
      } else {
        setCartItems([]);
      }
    };

    loadCartFromDB();
  }, [user]);

  // Sync cart to database whenever it changes (with debounce to avoid too many requests)
  useEffect(() => {
    if (!user || user.role !== 'Customer') return;

    const timeoutId = setTimeout(async () => {
      try {
        await axios.put('/api/customer/cart', { items: cartItems });
      } catch (error) {
        console.error('Error syncing cart:', error);
      }
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timeoutId);
  }, [cartItems, user]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.productId === product.id);
      
      if (existingItem) {
        return prevItems.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [
        ...prevItems,
        {
          productId: product.id,
          name: product.name,
          currentPrice: product.currentPrice,
          imagePath: product.imagePath,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = async () => {
    setCartItems([]);
    if (user && user.role === 'Customer') {
      try {
        await axios.delete('/api/customer/cart');
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.currentPrice * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};



