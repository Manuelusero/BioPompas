import './Payment.css';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

const Payment = () => {
  const navigate = useNavigate();
  // Obtener dirección del usuario de localStorage o usar mock
  const userAddress = JSON.parse(localStorage.getItem('address') || 'null');
  const [address, setAddress] = useState(userAddress || {
    name: 'Home',
    street: 'Carrer du Brutau, Barcelona',
    zip: '20100',
    mapImg: '/src/assets/Icons/MapMock.png',
  });
  const [editingAddress, setEditingAddress] = useState(false);
  const [newStreet, setNewStreet] = useState(address.street);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editingAddress && window.google && window.google.maps) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'es' }
      });
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) {
          setNewStreet(place.formatted_address);
        }
      });
    }
  }, [editingAddress]);
  const paymentMethods = [
    { type: 'visa', label: '**** **** **** 1234', icon: '/src/assets/Icons/Visa.png', selected: true },
    { type: 'mastercard', label: '**** **** **** 9856', icon: '/src/assets/Icons/Mastercard.png', selected: false },
    { type: 'paypal', label: 'carmensuarez@gmail.com', icon: '/src/assets/Icons/Paypal.png', selected: false },
  ];
  const total = 48.00;

  const handlePayment = () => {
    // Importar Axios al inicio del archivo
    // import axios from 'axios';
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para realizar el pago.');
      return;
    }
    const selectedType = paymentMethods.find(pm => pm.selected)?.type || 'visa';
    // Mapear el tipo seleccionado al valor que espera el backend
    let paymentMethod = 'Stripe';
    if (selectedType === 'paypal') paymentMethod = 'PayPal';
    // Adaptar la dirección al formato que espera el backend
    const shippingAddress = {
      address: address.street || '',
      city: 'Barcelona', // Valor por defecto, puedes cambiarlo
      postalCode: address.zip || '',
      country: 'España', // Valor por defecto, puedes cambiarlo
    };
    const payload = {
      shippingAddress,
      paymentMethod
    };
    // Usar Axios directamente
    import('axios').then(({default: axios}) => {
      axios.post(`${import.meta.env.VITE_APP_API_URL}/checkout`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(() => {
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('cartUpdated'));
        navigate('/order-complete');
      })
      .catch(err => {
        let msg = 'Error al procesar el pago. Intenta de nuevo.';
        if (err.response && err.response.data && err.response.data.message) {
          msg += '\n' + err.response.data.message;
        } else if (err.message) {
          msg += '\n' + err.message;
        }
        alert(msg);
        console.error(err);
      });
    });
  };

  return (
    <div className="payment-container">
      <button className="payment-back-btn" onClick={() => navigate('/bag')}>&lt;</button>
      <h1 className="payment-title">PAYMENT</h1>
      <section className="payment-section">
        <h2 className="payment-subtitle">DELIVERY ADDRESS</h2>
        <div className="payment-address">
          <img src={address.mapImg} alt="Map" className="payment-map" />
          <div>
            <div className="payment-address-row">
              <span className="payment-address-name">{address.name}</span>
              <button className="payment-edit" onClick={() => setEditingAddress(true)}>Edit</button>
            </div>
            {editingAddress ? (
              <form onSubmit={e => {
                e.preventDefault();
                const updated = { ...address, street: newStreet };
                setAddress(updated);
                localStorage.setItem('address', JSON.stringify(updated));
                setEditingAddress(false);
              }} style={{marginTop:8}}>
                <input
                  ref={inputRef}
                  type="text"
                  value={newStreet}
                  onChange={e => setNewStreet(e.target.value)}
                  placeholder="Enter address"
                  className="payment-address-input"
                  style={{padding:'8px', borderRadius:'8px', border:'1px solid #ccc', width:'100%', fontSize:'1rem'}}
                />
                <button type="submit" style={{marginTop:8, background:'#5c7347', color:'#fff', border:'none', borderRadius:'8px', padding:'8px 16px', cursor:'pointer'}}>Save</button>
                <button type="button" style={{marginLeft:8, background:'none', color:'#5c7347', border:'none', cursor:'pointer'}} onClick={() => setEditingAddress(false)}>Cancel</button>
              </form>
            ) : (
              <>
                <div className="payment-address-details">{address.street}</div>
                <div className="payment-address-details">{address.zip}</div>
              </>
            )}
          </div>
        </div>
        <div className="payment-maps-embed" style={{marginTop:16, borderRadius:12, overflow:'hidden'}}>
          <iframe
            title="Google Maps"
            className="payment-maps-iframe"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${encodeURIComponent(address.street || 'Carrer du Brutau, Barcelona')}&output=embed`}
          ></iframe>
        </div>
      </section>
      <section className="payment-section">
        <h2 className="payment-subtitle">PAYMENT METHOD</h2>
        <button className="payment-edit">Edit</button>
        <div className="payment-methods">
          {paymentMethods.map((pm) => (
            <div key={pm.type} className={`payment-method${pm.selected ? ' selected' : ''}`}>
              <img src={pm.icon} alt={pm.type} className="payment-method-icon" />
              <span className="payment-method-label">{pm.label}</span>
              {pm.selected && <span className="payment-method-check">&#10003;</span>}
            </div>
          ))}
        </div>
      </section>
      <div className="payment-total-row">
        <span className="payment-total-label">TOTAL</span>
        <span className="payment-total-value">€ {total.toFixed(2)}</span>
      </div>
      <button className="payment-btn" onClick={handlePayment}>Payment</button>
    </div>
  );
};

export default Payment;
