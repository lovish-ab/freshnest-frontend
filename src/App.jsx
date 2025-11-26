import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import SellerSignUp from './pages/SellerSignUp';
import SellerDashboard from './pages/SellerDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import Products from './pages/Products';

function App() {
  return (
    <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/products" element={<Products />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/seller/signup" element={<SellerSignUp />} />
            <Route
              path="/seller/dashboard"
              element={
                <ProtectedRoute requiredRole="Seller">
                  <SellerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/dashboard"
              element={
                <ProtectedRoute requiredRole="Customer">
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
    </AuthProvider>
  );
}

export default App;