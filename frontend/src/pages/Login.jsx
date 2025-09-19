import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import GoogleAuthProviderWrapper from '../GoogleAuthProviderWrapper';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../api/CartContext';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const { syncCartWithBackend, cartItems } = useCart();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/auth/login`, {
                email,
                password,
            });

            login(response.data.token); // Usar el hook de auth
            
            // Sincronizar carrito después del login exitoso
            try {
                await syncCartWithBackend();
                console.log('✅ Carrito sincronizado después del login');
            } catch (cartError) {
                console.error('❌ Error sincronizando carrito:', cartError);
                // No fallar el login si hay error en carrito
            }
            
            // Determinar redirección según el contexto
            const from = location.state?.from;
            
            if (from === 'profile') {
                // Si vino desde el profile, regresar al profile
                navigate('/profile');
            } else if (from === 'payment' || cartItems.length > 0) {
                // Si vino desde payment o hay productos en el carrito, ir al carrito
                navigate('/bag');
            } else {
                // Caso por defecto: ir al profile si no hay productos
                navigate('/profile');
            }
        } catch {
            setError('Error al iniciar sesión');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/auth/google`, {
                credential: credentialResponse.credential,
            });
            login(response.data.token); // Usar el hook de auth
            
            // Sincronizar carrito después del login con Google
            try {
                await syncCartWithBackend();
                console.log('✅ Carrito sincronizado después del login con Google');
            } catch (cartError) {
                console.error('❌ Error sincronizando carrito:', cartError);
            }
            
            navigate('/bag');
        } catch (err) {
            setError('Google authentication failed' + (err?.response?.data?.error ? ': ' + err.response.data.error : ''));
        }
    };

    const handleGoogleError = () => {
        setError('Google authentication failed');
    };

    return (
        <GoogleAuthProviderWrapper>
            <div className="login-container">
                <h2 className="login-title">
                    LOG IN TO<br />YOUR ACCOUNT
                    <img src="/PlantIcon.png" alt="Plant" className="login-plant-icon" />
                </h2>
                <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
                    <div className="login-form-group">
                        <label htmlFor="email" className="login-email-label">Email address</label>
                        <input
                            type="email"
                            id="email"
                            className="login-email-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="off"
                            required
                        />
                    </div>
                    <div className="login-form-group">
                        <label htmlFor="password" className="login-password-label">Password</label>
                        <div className="login-password-input-container">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                className="login-password-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                                required
                            />
                            <button
                                type="button"
                                className="login-password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        <div className="login-options-row">
                            <label className="login-remember-me">
                                <input type="checkbox" className="login-remember-checkbox" /> Remember me
                            </label>
                            <button type="button" className="login-forgot-password-link" onClick={() => navigate('/forgot-password')}>
                                Forgot your password?
                            </button>
                        </div>
                    </div>
                    {error && <p className="login-error-message">{error}</p>}
                    <button type="submit" className="login-submit-button">Sign in</button>
                </form>
                <div className="login-divider">
                    <span className="login-divider-line"></span>
                    <span className="login-divider-text">or sign up with</span>
                    <span className="login-divider-line"></span>
                </div>
                <div className="login-social-icons">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        width="auto"
                        useOneTap
                    />
                </div>
                <div className="login-guest-section">
                    <button className="login-continue-guest-button" onClick={() => navigate('/signup')}>
                        Don&apos;t have an account? Press here!
                    </button>
                </div>
                <nav className="bottom-navbar-login">
                    <a href="/home" className="nav-icon" aria-label="Home">
                        <img src="/Home.png" alt="Home" />
                    </a>
                    <a href="/search" className="nav-icon" aria-label="Search">
                        <img src="/SearchIcon.png" alt="Search" />
                    </a>
                    <a href="/login" className="nav-icon" aria-label="Avatar">
                        <img src="/AvatarSeccion.png" alt="Avatar" />
                    </a>
                </nav>
            </div>
        </GoogleAuthProviderWrapper>
    );
};

export default Login;
