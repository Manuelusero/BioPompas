import { useState } from "react";
import "./Home.css";

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

  if (sent) {
    return <div style={{ padding: 32, textAlign: "center" }}><h2>¡Gracias por tu mensaje!</h2><p>Te contactaremos pronto.</p></div>;
  }

  return (
    <div className="contact-page" style={{ maxWidth: 420, margin: "40px auto", background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px #0001", padding: 32 }}>
      <h1 style={{ fontFamily: 'Explore Magic', color: '#3a5a40', marginBottom: 24 }}>Contacto</h1>
      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", marginBottom: 8 }}>Nombre</label>
        <input name="name" value={form.name} onChange={handleChange} style={{ width: "100%", marginBottom: 16, padding: 8, borderRadius: 8, border: "1px solid #ccc" }} />
        <label style={{ display: "block", marginBottom: 8 }}>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} style={{ width: "100%", marginBottom: 16, padding: 8, borderRadius: 8, border: "1px solid #ccc" }} />
        <label style={{ display: "block", marginBottom: 8 }}>Mensaje</label>
        <textarea name="message" value={form.message} onChange={handleChange} rows={5} style={{ width: "100%", marginBottom: 16, padding: 8, borderRadius: 8, border: "1px solid #ccc" }} />
        {error && <div style={{ color: "#b00020", marginBottom: 12 }}>{error}</div>}
        <button type="submit" style={{ background: "#3a5a40", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontFamily: 'Raleway', fontWeight: 600, fontSize: 16, cursor: "pointer" }}>Enviar</button>
      </form>
      <nav className="bottom-navbar">
        <a href="/home" className="nav-icon" aria-label="Home">
          <img src="/src/assets/Icons/HomeIcon.png" alt="Home" />
        </a>
        <a href="/search" className="nav-icon" aria-label="Search">
          <img src="/src/assets/Icons/SearchIcon.png" alt="Search" />
        </a>
        <a href="/login" className="nav-icon" aria-label="Avatar">
          <img src="/src/assets/Icons/AvatarIcon.png" alt="Avatar" />
        </a>
      </nav>
    </div>
  );
};

export default Contact;
