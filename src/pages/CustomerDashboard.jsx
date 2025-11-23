import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CustomerDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/products', { replace: true });
  }, [navigate]);

  return null;
};

export default CustomerDashboard;