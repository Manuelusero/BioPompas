import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import GoogleAuthProviderWrapper from '../GoogleAuthProviderWrapper';
import './Login.css';

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

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/auth/google`, {
                credential: credentialResponse.credential,
            });
            localStorage.setItem('token', response.data.token);
            navigate('/home');
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
                    <img src="/src/assets/Icons/PlantIcon.png" alt="Plant" className="login-plant-icon" />
                </h2>
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
                        <div className="login-options-row">
                            <label className="remember-me">
                                <input type="checkbox" className="remember-checkbox" /> Remember me
                            </label>
                            <button type="button" className="forgot-password-link" onClick={() => navigate('/forgot-password')}>
                                Forgot your password?
                            </button>
                        </div>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="login-button">Sign in</button>
                </form>
                <div className="login-divider">
                    <span className="divider-line"></span>
                    <span className="divider-text">or sign up with</span>
                    <span className="divider-line"></span>
                </div>
                <div className="login-social-icons">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        width="auto"
                        useOneTap
                    />
                </div>
                <div className="login-links">
                    <button className="link-button" onClick={() => navigate('/register')}>
                        Create an account
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
        </GoogleAuthProviderWrapper>
    );
};

export default Login;
