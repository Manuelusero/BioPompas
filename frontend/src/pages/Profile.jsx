import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('saved');
  
  // Verificación directa de localStorage que siempre funciona
  const isLoggedIn = !!localStorage.getItem('token');
  
  // Estados para dirección
  const [savedAddress, setSavedAddress] = useState(
    JSON.parse(localStorage.getItem('savedAddress')) || {
      street: '',
      zip: '',
      name: ''
    }
  );
  const [editingAddress, setEditingAddress] = useState(false);
  const [tempAddress, setTempAddress] = useState({ ...savedAddress });

  // Estados para métodos de pago
  const [savedPaymentMethods, setSavedPaymentMethods] = useState(
    JSON.parse(localStorage.getItem('savedPaymentMethods')) || [
      { type: 'visa', label: '**** **** **** 1234', icon: '/LogoVisa.png', selected: true },
      { type: 'mastercard', label: '**** **** **** 9856', icon: '/LogoMastercard.png', selected: false },
      { type: 'paypal', label: 'user@email.com', icon: '/LogoPaypal.png', selected: false },
    ]
  );
  const [editingPayment, setEditingPayment] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [editingCardIndex, setEditingCardIndex] = useState(null);
  const [newCardNumber, setNewCardNumber] = useState('');

  useEffect(() => {
    // Scroll hacia arriba cuando se monta el componente
    window.scrollTo(0, 0);
    
    const fetchProfile = async () => {
      // Verificar token directamente cada vez que se carga el componente
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/login', { state: { from: 'profile' } });
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', // Agregar Content-Type para Firefox
          },
          timeout: 15000, // Aumentar timeout para Firefox
        });
        
        if (response.data && response.data.user) {
          setUser(response.data.user);
          setError(''); // Limpiar errores si la carga es exitosa
        } else {
          throw new Error('Invalid response structure');
        }
      } catch (err) {
        console.error('Error obteniendo perfil:', err);
        
        // Si el token es inválido (401), limpiar y redirigir
        if (err.response?.status === 401) {
          console.log('Token inválido, limpiando y redirigiendo...');
          localStorage.removeItem('token');
          window.dispatchEvent(new Event('authChange'));
          navigate('/login', { state: { from: 'profile' } });
        } else if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
          // Error de timeout
          setError('Conexión lenta. Intenta recargar la página.');
        } else if (err.response?.status >= 500) {
          // Error del servidor
          setError('Error del servidor. Intenta más tarde.');
        } else if (!navigator.onLine) {
          // Sin conexión
          setError('Sin conexión a internet. Verifica tu conexión.');
        } else {
          // Otros errores
          setError('Error cargando perfil. Intenta recargar la página.');
        }
      }
    };

    // Verificar si estamos en Firefox y agregar pequeño delay adicional
    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    const delay = isFirefox ? 200 : 100;

    const timer = setTimeout(() => {
      fetchProfile();
    }, delay);

    // Escuchar cambios en el token para reaccionar automáticamente
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        if (!e.newValue) {
          // Token eliminado, redirigir a login
          navigate('/login', { state: { from: 'profile' } });
        } else {
          // Token agregado/cambiado, recargar perfil
          fetchProfile();
        }
      }
    };

    const handleAuthChange = () => {
      const currentToken = localStorage.getItem('token');
      if (!currentToken) {
        navigate('/login', { state: { from: 'profile' } });
      } else {
        fetchProfile();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, [navigate]);

  const handleLogout = () => {
    // Limpiar token
    localStorage.removeItem('token');
    
    // Limpiar carrito si es necesario
    localStorage.removeItem('cart');
    localStorage.removeItem('cartId');
    
    // Disparar evento de cambio
    window.dispatchEvent(new Event('authChange'));
    
    // Navegar a home
    navigate('/home');
  };

  // Guardar dirección
  const handleSaveAddress = () => {
    setSavedAddress(tempAddress);
    localStorage.setItem('savedAddress', JSON.stringify(tempAddress));
    setEditingAddress(false);
  };

  // Cancelar edición de dirección
  const handleCancelAddress = () => {
    setTempAddress({ ...savedAddress });
    setEditingAddress(false);
  };

  // Manejar edición de tarjeta
  const handleEditCard = (index) => {
    const currentCard = savedPaymentMethods[index];
    setShowCardModal(true);
    setEditingCardIndex(index);
    
    if (currentCard.type === 'paypal') {
      setNewCardNumber(currentCard.label);
    } else {
      setNewCardNumber(currentCard.label.slice(-4));
    }
  };

  // Guardar cambios de tarjeta
  const handleSaveCard = () => {
    const currentCard = savedPaymentMethods[editingCardIndex];
    const updatedMethods = [...savedPaymentMethods];
    
    if (currentCard.type === 'paypal') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (newCardNumber && emailRegex.test(newCardNumber)) {
        updatedMethods[editingCardIndex] = { ...currentCard, label: newCardNumber };
        setSavedPaymentMethods(updatedMethods);
        localStorage.setItem('savedPaymentMethods', JSON.stringify(updatedMethods));
        setShowCardModal(false);
        setEditingPayment(false);
        setNewCardNumber('');
      } else {
        alert('Por favor ingresa un email válido');
      }
    } else {
      if (newCardNumber && newCardNumber.length === 4 && /^\d+$/.test(newCardNumber)) {
        updatedMethods[editingCardIndex] = { ...currentCard, label: `**** **** **** ${newCardNumber}` };
        setSavedPaymentMethods(updatedMethods);
        localStorage.setItem('savedPaymentMethods', JSON.stringify(updatedMethods));
        setShowCardModal(false);
        setEditingPayment(false);
        setNewCardNumber('');
      } else {
        alert('Por favor ingresa exactamente 4 dígitos numéricos');
      }
    }
  };

  // Cancelar edición de tarjeta
  const handleCancelCardEdit = () => {
    setShowCardModal(false);
    setNewCardNumber('');
    setEditingCardIndex(null);
  };

  // Seleccionar método de pago por defecto
  const handleSelectPaymentMethod = (selectedType) => {
    const updatedMethods = savedPaymentMethods.map(pm => ({
      ...pm,
      selected: pm.type === selectedType
    }));
    setSavedPaymentMethods(updatedMethods);
    localStorage.setItem('savedPaymentMethods', JSON.stringify(updatedMethods));
  };

  // Verificar login al renderizar - doble check
  if (!isLoggedIn) {
    return (
      <div className="profile-container">
        <div className="profile-loading">Redirecting to login...</div>
      </div>
    );
  }

  if (error) return (
    <div className="profile-container">
      <div className="profile-error">{error}</div>
    </div>  
  );
  
  return (
    <div className="profile-container">
      {/* Header con flecha de regreso y título centrado */}
      <div className="profile-header">
        <button className="profile-back-btn" onClick={() => navigate('/home')}>
          <img src="/ArrowLeftIcon.png" alt="Back" />
        </button>
        <h1 className="profile-title">Profile</h1>
        <button className="profile-settings-btn">
          <img src="/Configuration.png" alt="Settings" className="settings-icon" />
        </button>
      </div>

      {/* Tabs para guardar y cuenta */}
      <div className="profile-tabs">
        <button 
          className={`profile-tab ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          Saved
        </button>
        <button 
          className={`profile-tab ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => setActiveTab('account')}
        >
          Account
        </button>
      </div>

      {/* Contenido de las pestañas */}
      <div className="profile-content">
        {activeTab === 'saved' && (
          <div className="saved-section">
            <div className="empty-state">
              <img src="/Handplant.png" alt="Nothing here" className="leaf-icon" />
              <h3 className="empty-state-title">Nothing here yet!</h3>
              <p className="empty-state-text">
                Looks like there are not any favourite products in this section of your Profile.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'account' && (
          <div className="account-section">
            {/* Información personal */}
            <div className="profile-info">
              <h3 className="account-section-title">Personal Information</h3>
              <div className="profile-field">
                <strong>Name:</strong>
                <span>{user?.name || 'Loading...'}</span>                
              </div>
              <div className="profile-field">
                <strong>Email:</strong>
                <span>{user?.email || 'Loading...'}</span>
              </div>
            </div>

            {/* Dirección de entrega */}
            <div className="profile-info">
              <div className="account-section-header">
                <h3 className="account-section-title">Delivery Address</h3>
                <button 
                  onClick={() => setEditingAddress(true)}
                  className="edit-btn" 
                >
                  Edit
                </button>
              </div>
              {editingAddress ? (
                <div className="edit-form">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={tempAddress.name}
                    onChange={(e) => setTempAddress({...tempAddress, name: e.target.value})}
                    className="form-input"
                  />
                  <input
                    type="text"
                    placeholder="Street Address"
                    value={tempAddress.street}
                    onChange={(e) => setTempAddress({...tempAddress, street: e.target.value})}
                    className="form-input"
                  />
                  <input
                    type="text"
                    placeholder="Postal Code"
                    value={tempAddress.zip}
                    onChange={(e) => setTempAddress({...tempAddress, zip: e.target.value})}
                    className="form-input"
                  />
                  <div className="form-buttons">
                    <button onClick={handleCancelAddress} className="cancel-btn">Cancel</button>
                    <button onClick={handleSaveAddress} className="save-btn">Save</button>
                  </div>
                </div>
              ) : (
                <div className="address-display">
                  {savedAddress.name || savedAddress.street ? (
                    <>
                      <div className="address-line">{savedAddress.name}</div>
                      <div className="address-line">{savedAddress.street}</div>
                      <div className="address-line">{savedAddress.zip}</div>
                    </>
                  ) : (
                    <div className="no-data">No address saved</div>
                  )}
                </div>
              )}
            </div>

            {/* Métodos de pago */}
            <div className="profile-info">
              <div className="account-section-header">
                <h3 className="account-section-title">Payment Methods</h3>
                <button 
                  onClick={() => setEditingPayment(!editingPayment)}
                  className="edit-btn" 
                >
                  {editingPayment ? 'Done' : 'Edit'}
                </button>
              </div>
              <div className="payment-methods-list">
                {savedPaymentMethods.map((pm, index) => (
                  <div 
                    key={`${pm.type}-${index}`} 
                    className={`payment-method-item ${pm.selected ? 'selected' : ''}`}
                    onClick={() => !editingPayment && handleSelectPaymentMethod(pm.type)}
                  >
                    <img src={pm.icon} alt={pm.type} className="payment-icon" />
                    <span className="payment-label">{pm.label}</span>
                    {editingPayment && (
                      <button 
                        className="edit-payment-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditCard(index);
                        }}
                      >
                        Edit
                      </button>
                    )}
                  </div>
                ))}
              </div>  
            </div>
            
            {/* Botón de cerrar sesión fuera del contenedor blanco */}
            <button className="profile-logout-btn" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>

      {/* NavBar inferior */}
      <nav className="bottom-navbar">
        <Link to="/home" className="nav-icon" aria-label="Home">
          <img src="/Home.png" alt="Home" />
        </Link>
        <Link to="/search" className="nav-icon" aria-label="Search">
          <img src="/SearchIcon.png" alt="Search" />
        </Link>
        <Link to="/profile" className="nav-icon avatar-button" aria-label="Avatar">
          <img src="/AvatarSeccion.png" alt="Avatar" />
        </Link>
      </nav>

      {/* Modal para editar tarjeta */}
      {showCardModal && (
        <div className="card-modal-overlay">
          <div className="card-modal">
            <h3>
              {savedPaymentMethods[editingCardIndex]?.type === 'paypal' 
                ? 'Edit PayPal Email' 
                : 'Edit Last 4 Digits'
              }
            </h3>
            <input
              type={savedPaymentMethods[editingCardIndex]?.type === 'paypal' ? 'email' : 'text'}
              value={newCardNumber}
              onChange={(e) => setNewCardNumber(e.target.value)}
              placeholder={savedPaymentMethods[editingCardIndex]?.type === 'paypal' 
                ? 'example@email.com' 
                : 'Last 4 digits'}
              maxLength={savedPaymentMethods[editingCardIndex]?.type === 'paypal' ? '50' : '4'}
              className="card-modal-input"
            />
            <div className="card-modal-buttons">
              <button onClick={handleSaveCard} className="card-modal-save">Save</button>
              <button onClick={handleCancelCardEdit} className="card-modal-cancel">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;