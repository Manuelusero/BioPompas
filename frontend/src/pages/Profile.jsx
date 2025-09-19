import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('saved');
  
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

  const handleAvatarClick = () => {
    const isLoggedIn = !!localStorage.getItem('token');
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      alert('Debes iniciar sesión para acceder a tu perfil.');
      navigate('/login', { state: { from: 'profile' } });
    }
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
    setEditingCardIndex(index);
    
    if (currentCard.type === 'paypal') {
      setNewCardNumber(currentCard.label);
    } else {
      setNewCardNumber(currentCard.label.slice(-4));
    }
    
    setShowCardModal(true);
  };

  // Guardar cambios de tarjeta
  const handleSaveCard = () => {
    const currentCard = savedPaymentMethods[editingCardIndex];
    
    if (currentCard.type === 'paypal') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (newCardNumber && emailRegex.test(newCardNumber)) {
        const updatedMethods = savedPaymentMethods.map((pm, i) => 
          i === editingCardIndex 
            ? { ...pm, label: newCardNumber }
            : pm
        );
        setSavedPaymentMethods(updatedMethods);
        localStorage.setItem('savedPaymentMethods', JSON.stringify(updatedMethods));
        setShowCardModal(false);
        setEditingPayment(false);
        setNewCardNumber('');
        setEditingCardIndex(null);
      } else {
        alert('Por favor ingresa un email válido');
      }
    } else {
      if (newCardNumber && newCardNumber.length === 4 && /^\d+$/.test(newCardNumber)) {
        const updatedMethods = savedPaymentMethods.map((pm, i) => 
          i === editingCardIndex 
            ? { ...pm, label: `**** **** **** ${newCardNumber}` }
            : pm
        );
        setSavedPaymentMethods(updatedMethods);
        localStorage.setItem('savedPaymentMethods', JSON.stringify(updatedMethods));
        setShowCardModal(false);
        setEditingPayment(false);
        setNewCardNumber('');
        setEditingCardIndex(null);
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
      {/* Header con flecha de regreso y título centrado */}
      <div className="profile-header">
        <button className="profile-back-btn" onClick={() => navigate('/home')}>
          <img src="/ArrowLeftIcon.png" alt="Back" />
        </button>
        <h1 className="profile-title">PROFILE</h1>
        <button className="profile-settings-btn">
          <img src="/Configuration.png" alt="Settings" className="settings-icon" />
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
                <img src="/Handplant.png" alt="Nothing here" className="leaf-icon" />
              </div>
              <h3 className="empty-state-title">Nothing here yet!</h3>
              <p className="empty-state-text">
                Looks like there are not any favourite products in this section of your Profile.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'account' && (
          <>
            <div className="account-section">
              {/* Información personal */}
              <div className="profile-info">
                <h3 className="account-section-title">Personal Information</h3>
                <div className="profile-field">
                  <strong>Name:</strong>
                  <span>{user.name}</span>
                </div>
                
                <div className="profile-field">
                  <strong>Email:</strong>
                  <span>{user.email}</span>
                </div>
              </div>

              {/* Dirección de entrega */}
              <div className="profile-info">
                <div className="account-section-header">
                  <h3 className="account-section-title">Delivery Address</h3>
                  <button 
                    className="edit-btn" 
                    onClick={() => setEditingAddress(true)}
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
                      <button onClick={handleSaveAddress} className="save-btn">Save</button>
                      <button onClick={handleCancelAddress} className="cancel-btn">Cancel</button>
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
                    className="edit-btn" 
                    onClick={() => setEditingPayment(!editingPayment)}
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
                      {pm.selected && !editingPayment && <span className="check-mark">✓</span>}
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
            </div>
            
            {/* Botón de cerrar sesión fuera del contenedor blanco */}
            <button onClick={handleLogout} className="profile-logout-btn">
              Cerrar Sesión
            </button>
          </>
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
        <button onClick={handleAvatarClick} className="nav-icon avatar-button" aria-label="Avatar">
          <img src="/AvatarSeccion.png" alt="Avatar" />
        </button>
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
                : 'Last 4 digits'
              }
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

