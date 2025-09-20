import './Payment.css';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useCart } from '../api/CartContext';

const Payment = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart, forceCartReset } = useCart();
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  // Cargar dirección guardada desde localStorage
  const [address, setAddress] = useState(() => {
    const savedAddress = JSON.parse(localStorage.getItem('savedAddress')) || {};
    return {
      name: savedAddress.name || '',
      street: savedAddress.street || '',
      zip: savedAddress.zip || '',
      mapImg: ''
    };
  });
  const [editingAddress, setEditingAddress] = useState(false);
  const [newStreet, setNewStreet] = useState(address.street);
  const [newZip, setNewZip] = useState(address.zip);
  const [editingPayment, setEditingPayment] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [editingCardIndex, setEditingCardIndex] = useState(null);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [paymentMethods, setPaymentMethods] = useState([
    { type: 'visa', label: '**** **** **** 1234', icon: '/LogoVisa.png', selected: true },
    { type: 'mastercard', label: '**** **** **** 9856', icon: '/LogoMastercard.png', selected: false },
    { type: 'paypal', label: 'carmensuarez@gmail.com', icon: '/LogoPaypal.png', selected: false },
  ]);
  const inputRef = useRef(null);
  const [saveAddress, setSaveAddress] = useState(false);
  // Agregar estado de procesando pago
  const [processingPayment, setProcessingPayment] = useState(false);

  // Cargar Google Maps API dinámicamente
  useEffect(() => {
    if (!window.google && GOOGLE_MAPS_API_KEY) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, [GOOGLE_MAPS_API_KEY]);

  useEffect(() => {
    if (editingAddress && inputRef.current) {
      if (window.google && window.google.maps && window.google.maps.places) {
        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
          types: ['address'],
          componentRestrictions: { country: 'es' }
        });
        
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.formatted_address) {
            setNewStreet(place.formatted_address);
            
            let zipCode = '20100';
            if (place.address_components) {
              place.address_components.forEach(component => {
                if (component.types.includes('postal_code')) {
                  zipCode = component.long_name;
                }
              });
            }
            
            let mapImg = address.mapImg;
            if (place.geometry && place.geometry.location) {
              const lat = place.geometry.location.lat();
              const lng = place.geometry.location.lng();
              mapImg = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=123x114&maptype=roadmap&markers=color:red%7Clabel:A%7C${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;
            }
            
            const updated = {
              ...address,
              street: place.formatted_address,
              zip: zipCode,
              mapImg: mapImg
            };
            setAddress(updated);
            localStorage.setItem('address', JSON.stringify(updated));
          }
        });

        return () => {
          if (window.google && window.google.maps && window.google.maps.event) {
            window.google.maps.event.clearInstanceListeners(autocomplete);
          }
        };
      } else {
        console.warn('Google Maps API no está disponible.');
      }
    }
  }, [editingAddress, address, GOOGLE_MAPS_API_KEY]);

  const DELIVERY_COST = 8;
  const [cartTotal, setCartTotal] = useState(0);
  
  useEffect(() => {
    // Usar cartItems del CartContext en lugar de localStorage
    const validItems = cartItems.filter(item => item._id && (item.count > 0 || item.quantity > 0));
    const subtotal = validItems.reduce((sum, item) => sum + (item.price * (item.count || item.quantity || 1)), 0);
    setCartTotal(subtotal + DELIVERY_COST);
  }, [cartItems]);

  const handleEditCard = (index) => {
    const currentCard = paymentMethods[index];
    setEditingCardIndex(index);
    
    // Para PayPal, usar el email completo, para tarjetas usar los últimos 4 dígitos
    if (currentCard.type === 'paypal') {
      setNewCardNumber(currentCard.label);
    } else {
      setNewCardNumber(currentCard.label.slice(-4));
    }
    
    setShowCardModal(true);
  };

  const handleSaveCard = () => {
    const currentCard = paymentMethods[editingCardIndex];
    
    if (currentCard.type === 'paypal') {
      // Para PayPal, validar que sea un email válido
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (newCardNumber && emailRegex.test(newCardNumber)) {
        setPaymentMethods(prev => 
          prev.map((pm, i) => 
            i === editingCardIndex 
              ? { ...pm, label: newCardNumber }
              : pm
          )
        );
        setShowCardModal(false);
        setEditingPayment(false);
        setNewCardNumber('');
        setEditingCardIndex(null);
      } else {
        alert('Por favor ingresa un email válido');
      }
    } else {
      // Para tarjetas, validar 4 dígitos
      if (newCardNumber && newCardNumber.length === 4 && /^\d+$/.test(newCardNumber)) {
        setPaymentMethods(prev => 
          prev.map((pm, i) => 
            i === editingCardIndex 
              ? { ...pm, label: `**** **** **** ${newCardNumber}` }
              : pm
          )
        );
        setShowCardModal(false);
        setEditingPayment(false);
        setNewCardNumber('');
        setEditingCardIndex(null);
      } else {
        alert('Por favor ingresa exactamente 4 dígitos numéricos');
      }
    }
  };

  const handleCancelCardEdit = () => {
    setShowCardModal(false);
    setNewCardNumber('');
    setEditingCardIndex(null);
  };

  // Ejemplo de verificación de login (ajusta según tu lógica real)
  const isLoggedIn = !!localStorage.getItem('token');

  const handlePayment = async () => {
    // Verificar que hay productos en el carrito usando CartContext
    if (!cartItems || cartItems.length === 0) {
      navigate('/profile');
      return;
    }

    // Verificar que los productos tienen cantidad
    const validItems = cartItems.filter(item => item._id && (item.count > 0 || item.quantity > 0));
    if (validItems.length === 0) {
      navigate('/profile');
      return;
    }

    // Verificar login antes de pagar
    if (!isLoggedIn) {
      alert('Debes iniciar sesión para poder completar el pedido.');
      navigate('/login', { state: { from: 'payment' } }); // Especificar que viene de payment
      return;
    }

    if (!address.street || !address.zip) {
      alert('Por favor, completa todos los campos de la dirección.');
      return;
    }

    // Iniciar estado de procesamiento
    setProcessingPayment(true);

    try {
      // Limpiar carrito usando CartContext de forma completa
      await clearCart();
      
      // Forzar reset completo para asegurar limpieza total
      forceCartReset();
      
      console.log('✅ Carrito limpiado completamente después del pago');
      
      // Simular tiempo de procesamiento de pago (opcional)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navegar a order complete
      navigate('/order-complete');
    } catch (error) {
      console.error('Error clearing cart:', error);
      // Fallback: usar forceCartReset para limpiar todo
      forceCartReset();
      
      // Simular tiempo de procesamiento incluso si hay error
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      navigate('/order-complete');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handlePaymentMethodSelect = (selectedType) => {
    setPaymentMethods(prev => 
      prev.map(pm => ({
        ...pm,
        selected: pm.type === selectedType
      }))
    );
  };

  const handleEditPayment = () => {
    setEditingPayment(!editingPayment);
  };

  return (
    <div className="payment-container">
      {/* Overlay de carga durante el procesamiento */}
      {processingPayment && (
        <div className="payment-processing-overlay">
          <div className="payment-processing-content">
            <div className="payment-spinner"></div>
            <h3>Processing payment...</h3>
            <p>Please wait while we process your order</p>
          </div>
        </div>
      )}
      
      <button className="payment-back-btn" onClick={() => navigate('/bag')} disabled={processingPayment}>
        <img src="/ArrowLeftIcon.png" alt="Back" />
      </button>
      <h1 className="payment-title">Payment</h1>
      <div className="payment-address-header">
        <h2 className="payment-subtitle">Delivery Address</h2>
      </div>
      <section className="payment-section">
        <div className="payment-address-container">
          <div className="payment-maps-embed">
            <iframe
              title="Google Maps"
              className="payment-maps-iframe"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={address.lat && address.lng 
                ? `https://www.google.com/maps?q=${address.lat},${address.lng}&output=embed&z=16`
                : `https://www.google.com/maps?q=${encodeURIComponent(address.street || 'Carrer du Brutau, Barcelona')}&output=embed`}
            ></iframe>
          </div>
          <div>
            <div className="payment-address-row">
              <span className="payment-address-name">{address.name}</span>
              <button className="payment-edit" onClick={() => setEditingAddress(true)}>Edit</button>
            </div>
            {editingAddress ? (
              <form onSubmit={e => {
                e.preventDefault();
                const updated = { ...address, street: newStreet, zip: newZip };
                setAddress(updated);
                if (saveAddress) {
                  localStorage.setItem('address', JSON.stringify(updated));
                } else {
                  localStorage.removeItem('address');
                }
                setEditingAddress(false);
              }} className="payment-edit-form">
                <input
                  ref={inputRef}
                  type="text"
                  value={newStreet}
                  onChange={e => setNewStreet(e.target.value)}
                  placeholder="Enter address"
                  className="payment-address-input"
                />
                <input
                  type="text"
                  value={newZip}
                  onChange={e => setNewZip(e.target.value)}
                  placeholder="Código postal"
                  className="payment-address-input"
                  style={{marginTop: '8px'}}
                />
                <div style={{margin: '8px 0'}}>
                  <input
                    type="checkbox"
                    checked={saveAddress}
                    onChange={e => setSaveAddress(e.target.checked)}
                    id="saveAddressCheckbox"
                  />
                  <label htmlFor="saveAddressCheckbox" style={{marginLeft: '6px'}}>Recordar mi dirección para la próxima vez</label>
                </div>
                <button type="submit" className="payment-form-save-btn">Save</button>
                <button type="button" className="payment-form-cancel-btn" onClick={() => setEditingAddress(false)}>Cancel</button>
              </form>
            ) : (
              <>
                <div className="payment-address-details">{address.street}</div>
                <div className="payment-address-details">{address.zip}</div>
              </>
            )}
          </div>
        </div>
      </section>
      <div className="payment-method-header">
        <h2 className="payment-subtitle-dos">Payment Method</h2>
        <button className="payment-edit" onClick={handleEditPayment}>Edit</button>
      </div>
      <section className="payment-section">
        <div className="payment-methods">
          {paymentMethods.map((pm, index) => (
            <div 
              key={`${pm.type}-${index}`} 
              className={`payment-method${pm.selected ? ' selected' : ''}`}
              onClick={() => editingPayment ? handleEditCard(index) : handlePaymentMethodSelect(pm.type)}
            >
              <img src={pm.icon} alt={pm.type} className="payment-method-icon" />
              <span className="payment-method-label">{pm.label}</span>
              {pm.selected && !editingPayment && <span className="payment-method-check">&#10003;</span>}
              {editingPayment && <span className="payment-edit-indicator">Click to edit</span>}
            </div>
          ))}
        </div>
      </section>
      <div className="payment-total-row">
        <span className="payment-total-label">Total</span>
        <span className="payment-total-value">€ {cartTotal.toFixed(2)}</span>
      </div>
      <button 
        className="payment-btn" 
        onClick={handlePayment}
        disabled={processingPayment}
      >
        {processingPayment ? 'Processing...' : 'Payment'}
      </button>
      
      {/* Modal para editar tarjeta */}
      {showCardModal && (
        <div className="card-modal-overlay">
          <div className="card-modal">
            <h3>
              {paymentMethods[editingCardIndex]?.type === 'paypal' 
                ? 'Editar Email de PayPal' 
                : 'Editar últimos 4 dígitos'
              }
            </h3>
            <input
              type={paymentMethods[editingCardIndex]?.type === 'paypal' ? 'email' : 'text'}
              value={newCardNumber}
              onChange={(e) => setNewCardNumber(e.target.value)}
              placeholder={paymentMethods[editingCardIndex]?.type === 'paypal' 
                ? 'ejemplo@email.com' 
                : 'Últimos 4 dígitos'
              }
              maxLength={paymentMethods[editingCardIndex]?.type === 'paypal' ? '50' : '4'}
              className="card-modal-input"
            />
            <div className="card-modal-buttons">
              <button onClick={handleSaveCard} className="card-modal-save">Guardar</button>
              <button onClick={handleCancelCardEdit} className="card-modal-cancel">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;

