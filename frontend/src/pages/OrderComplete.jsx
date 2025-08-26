import './OrderComplete.css';
import { useNavigate } from 'react-router-dom';

const OrderComplete = () => {
  const navigate = useNavigate();
  return (
    <div className="order-complete-container">
      <img src="/PlantIcon.png" alt="Leaves" className="order-complete-leaves" />
      <h1 className="order-complete-title">ORDER SUCCESSFULLY PLACED</h1>
      <p className="order-complete-desc">Thank you for standing up for the planet.</p>
      <button className="order-complete-btn" onClick={() => navigate('/home')}>Back to Home</button>
      <img src="/SunIcon.png" alt="Sun" className="order-complete-sun" />
    </div>
  );
};

export default OrderComplete;
