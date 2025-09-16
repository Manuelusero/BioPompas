import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user);
      } catch {
        setError('No autorizado o token inválido');
        setTimeout(() => navigate('/login'), 2000);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
    localStorage.removeItem('cartId');
    navigate('/login');
  };

  if (error) return (
    <div className="profile-container">
      <div className="profile-error">{error}</div>
    </div>
  );
  
  if (!user) return (
    <div className="profile-container">
      <div className="profile-loading">Cargando...</div>
    </div>
  );

  return (
    <div className="profile-container">
      <button onClick={() => navigate('/home')} className="profile-back-btn">
        ← Volver
      </button>
      
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">👤</div>
          <h2>Mi Perfil</h2>
        </div>
        
        <div className="profile-details">
          <div className="profile-field">
            <strong>Nombre:</strong>
            <span>{user.name}</span>
          </div>
          
          <div className="profile-field">
            <strong>Email:</strong>
            <span>{user.email}</span>
          </div>
          
          <div className="profile-field">
            <strong>Rol:</strong>
            <span>{user.role}</span>
          </div>
        </div>
        
        <button onClick={handleLogout} className="profile-logout-btn">
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Profile;
        
  