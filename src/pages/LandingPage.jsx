import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import apiClient from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === 'Seller') {
      navigate('/seller/dashboard', { replace: true });
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && user.role === 'Seller') {
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await apiClient.get('/api/products');
        setProducts(response.data.slice(0, 8));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to FreshNest</h1>
          <p className="text-xl mb-8">Discover amazing products from trusted sellers</p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/seller/signup"
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Become a Seller
            </Link>
            <Link
              to="/products"
              className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Recently Added Products
        </h2>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-500">Loading products...</div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-500">No products available yet</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default LandingPage;