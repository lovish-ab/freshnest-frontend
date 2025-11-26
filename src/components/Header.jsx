import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            FreshNest
          </Link>

          <nav className="flex items-center gap-4">
            {user ? (
              <>
                {user.role === 'Seller' ? (
                  <Link
                    to="/seller/dashboard"
                    className="px-4 py-2 text-gray-700 hover:text-blue-600 transition"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/customer/dashboard"
                      className="px-4 py-2 text-gray-700 hover:text-blue-600 transition"
                    >
                      Products
                    </Link>
                    <Link
                      to="/cart"
                      className="relative px-4 py-2 text-gray-700 hover:text-blue-600 transition"
                    >
                      Cart
                      {cartItemCount > 0 && (
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {cartItemCount}
                        </span>
                      )}
                    </Link>
                    <Link
                      to="/orders"
                      className="px-4 py-2 text-gray-700 hover:text-blue-600 transition"
                    >
                      My Orders
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/seller/signup"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                  Become a Seller
                </Link>
                <Link
                  to="/signin"
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;



