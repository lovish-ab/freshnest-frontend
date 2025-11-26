import { useEffect, useState } from 'react';
import Header from '../components/Header';
import apiClient from '../axiosConfig';
const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiClient.get('/api/customer/orders');
        console.log('Orders response:', response.data);
        setOrders(response.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        console.error('Error details:', error.response?.data);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-500">Loading orders...</div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <div className="text-xl text-gray-500 mb-4">No orders yet</div>
            <a
              href="/customer/dashboard"
              className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Order #{order.id}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Date: {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-blue-600">
                      ₹{order.totalPrice.toFixed(2)}
                    </p>
                    
                  </div>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Shipping Address:</strong> {order.shippingAddress}
                  </p>
                  <div className="mt-2">
                    <strong className="text-sm text-gray-700">Items:</strong>
                    <div className="mt-2 space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 bg-gray-50 p-3 rounded">
                          <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                            {item.productImage ? (
                              <img
                                src={item.productImage}
                                alt={item.productName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                No Image
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">{item.productName}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <p className="font-semibold text-gray-800">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;



