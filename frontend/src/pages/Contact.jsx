import { useState, useEffect } from "react";
import "./Contact.css";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Por favor, completa todos los campos.");
      return;
    }
    setError("");
    setSent(true);
    // Aquí puedes hacer el POST al backend si lo deseas
  };


  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const cartArr = JSON.parse(storedCart);
      setCartCount(cartArr.reduce((sum, item) => sum + item.count, 0));
    } else {
      setCartCount(0);
    }
    const syncCart = () => {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const cartArr = JSON.parse(storedCart);
        setCartCount(cartArr.reduce((sum, item) => sum + item.count, 0));
      } else {
        setCartCount(0);
      }
    };
    window.addEventListener('storage', syncCart);
    return () => window.removeEventListener('storage', syncCart);
  }, []);

  const [cartCount, setCartCount] = useState(0);
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const cartArr = JSON.parse(storedCart);
      setCartCount(cartArr.reduce((sum, item) => sum + item.count, 0));
    } else {
      setCartCount(0);
    }
    const syncCart = () => {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const cartArr = JSON.parse(storedCart);
        setCartCount(cartArr.reduce((sum, item) => sum + item.count, 0));
      } else {
        setCartCount(0);
      }
    };
    window.addEventListener('storage', syncCart);
    return () => window.removeEventListener('storage', syncCart);
  }, []);

  if (sent) {
    return (
      <div className="contact-success">
        <h2>¡Gracias por tu mensaje!</h2>
        <p>Te contactaremos pronto.</p>
      </div>
    );
  }

  return (
    <div className="contact-page">
      <div className="contact-header">
        <a href="/home" className="contact-back" aria-label="Volver">
          {/* Si el SVG no se muestra, usa un emoji o FontAwesome temporalmente */}
          <img src="/src/assets/Icons/ArrowLeftIcon.png" alt="Volver" className="contact-arrow-icon" onError={e => {e.target.style.display='none'; e.target.parentNode.innerHTML = '←';}} />
        </a>
        <h1 className="contact-title">Contact</h1>
        <div className="contact-cart-icon" onClick={() => window.location.href = '/cart'}>
          <img src="/Cart.svg" alt="Carrito" />
          {cartCount > 0 && (
            <span className="contact-cart-badge">{cartCount}</span>
          )}
        </div>
      </div>
      <form className="contact-form" onSubmit={handleSubmit}>
        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} />
        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} />
        <label>Message</label>
        <textarea name="message" value={form.message} onChange={handleChange} rows={5} />
        {error && <div className="contact-error">{error}</div>}
        <button type="submit">Enviar</button>
      </form>
      <nav className="bottom-navbar">
        <a href="/home" className="nav-icon" aria-label="Home">
          <img src="/HomeIcon.png" alt="Home" />
        </a>
        <a href="/search" className="nav-icon" aria-label="Search">
          <img src="/SearchIcon.png" alt="Search" />
        </a>
        <a href="/login" className="nav-icon" aria-label="Avatar">
          <img src="/AvatarIcon.png"  alt="Avatar" />
        </a>
      </nav>
    </div>
  );
};

export default Contact;
