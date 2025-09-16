import { useNavigate } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleAvatarClick = () => {
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      alert('Debes iniciar sesión para acceder a tu perfil.');
      navigate('/login');
    }
  };

  return (
    <nav className="navigation">
      <div className="nav-content">
        <h1 className="nav-title">BIOPOMPAS</h1>
        <button className="nav-avatar" onClick={handleAvatarClick}>
          <div className="avatar-circle">
            <span className="avatar-text">👤</span>
          </div>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
