import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('saved');

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
      } catch (err) {
        console.error('Error obteniendo perfil:', err);
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
      {/* Header con título y configuración */}
      <div className="profile-header">
        <h1 className="profile-title">PROFILE</h1>
        <button className="profile-settings-btn">
          <img src="/settings-icon.png" alt="Settings" className="settings-icon" />
        </button>
      </div>

      {/* Pestañas */}
      <div className="profile-tabs">
        <button 
          className={`profile-tab ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          SAVED
        </button>
        <button 
          className={`profile-tab ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => setActiveTab('account')}
        >
          ACCOUNT
        </button>
      </div>

      {/* Contenido de las pestañas */}
      <div className="profile-content">
        {activeTab === 'saved' && (
          <div className="saved-section">
            <div className="empty-state">
              <div className="empty-state-icon">
                <img src="/leaf-hand-icon.png" alt="Nothing here" className="leaf-icon" />
              </div>
              <h3 className="empty-state-title">Nothing here yet!</h3>
              <p className="empty-state-text">
                Looks like there are not any favourite products in this section of your Profile.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'account' && (
          <div className="account-section">
            <div className="profile-info">
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
        )}
      </div>
    </div>
  );
};

export default Profile;

