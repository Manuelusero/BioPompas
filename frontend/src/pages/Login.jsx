import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/auth/login`, {
                email,
                password,
            });

            localStorage.setItem('token', response.data.token);
            navigate('/home');
        } catch {
            setError('Error al iniciar sesión');
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Welcome</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input
                        type="email"
                        id="email"
                        className="form-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="form-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="login-button">Iniciar sesión</button>
            </form>
            <div className="login-links">
                <button className="link-button" onClick={() => navigate('/register')}>
                    Crear una cuenta
                </button>
                <button className="link-button" onClick={() => navigate('/forgot-password')}>
                    ¿Olvidaste tu contraseña?
                </button>
            </div>
            <nav className="bottom-navbar">
                <a href="/home" className="nav-icon" aria-label="Home">
                    <img src="/src/assets/Icons/Home.png" alt="Home" />
                </a>
                <a href="/search" className="nav-icon" aria-label="Search">
                    <img src="/src/assets/Icons/SearchIcon.png" alt="Search" />
                </a>
                <a href="/login" className="nav-icon" aria-label="Avatar">
                    <img src="/src/assets/Icons/AvatarSeccion.png" alt="Avatar" />
                </a>
            </nav>
        </div>
    );
};

export default Login;
