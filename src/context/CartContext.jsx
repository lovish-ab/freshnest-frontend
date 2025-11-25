import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../axiosConfig';
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
  const [cartId, setCartId] = useState(null);
  const { user } = useAuth();


  useEffect(() => {
    const loadCartFromDB = async () => {
      if (user && user.role === 'Customer') {
        try {
          const response = await apiClient.get('/api/customer/cart');
          setCartItems(response.data.items || []);
          setCartId(response.data.id);
        } catch (error) {
          console.error('Error loading cart:', error);
          setCartItems([]);
          setCartId(null);
        }
      } else {
        setCartItems([]);
        setCartId(null);
      }
    };

    loadCartFromDB();
  }, [user]);


  useEffect(() => {
    if (!user || user.role !== 'Customer' || !cartId) return;
    
    // Don't sync if cart is empty (backend validation requires non-empty items)
    if (cartItems.length === 0) return;

    const timeoutId = setTimeout(async () => {
      try {
        await apiClient.put(`/api/customer/cart/${cartId}`, { items: cartItems });
      } catch (error) {
        if (error.response?.status === 400) {
          console.error('Error syncing cart:', error.response.data.error);
          // If cart not found, reload cart from server
          if (error.response.data.error === 'Cart not found') {
            const response = await apiClient.get('/api/customer/cart');
            setCartId(response.data.id);
            setCartItems(response.data.items || []);
          }
        } else {
          console.error('Error syncing cart:', error);
        }
      }
    }, 500); 

    return () => clearTimeout(timeoutId);
  }, [cartItems, user, cartId]);

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
    if (user && user.role === 'Customer' && cartId) {
      try {
        await apiClient.delete(`/api/customer/cart/${cartId}`);
        setCartItems([]);
        // Reload cart to get the updated state (empty cart with same ID)
        const response = await apiClient.get('/api/customer/cart');
        setCartId(response.data.id);
      } catch (error) {
        console.error('Error clearing cart:', error);
        if (error.response?.status === 404) {
          // Cart not found, reload to get a new cart
          const response = await apiClient.get('/api/customer/cart');
          setCartId(response.data.id);
          setCartItems(response.data.items || []);
        }
      }
    } else {
      setCartItems([]);
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