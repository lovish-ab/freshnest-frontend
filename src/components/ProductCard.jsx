import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = () => {
    if (!user || user.role !== "Customer") {
      alert("Please sign in as a customer to add items to cart");
      return;
    }
    addToCart(product);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="h-48 bg-gray-200 overflow-hidden">
        {product.imagePath ? (
          <img
            src={product.imagePath}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-blue-600">
            ₹{product.currentPrice}
          </span>
          {product.mrp > product.currentPrice && (
            <span className="text-sm text-gray-400 line-through">
              ₹{product.mrp}
            </span>
          )}
        </div>
        {user && user.role === "Customer" && (
          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
