import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import GoogleAuthProviderWrapper from '../GoogleAuthProviderWrapper';
import './SignUp.css';

const SignUp = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await axios.post(`${import.meta.env.VITE_APP_API_URL}/auth/register`, {
                firstName,
                lastName,
                email,
                password,
            });

            // Si el registro es exitoso, mostrar mensaje y redirigir
            alert('Account created successfully! Please check your email to verify your account.');
            navigate('/login');
        } catch (err) {
            console.error('Registration error:', err);
            
            // Manejo específico de errores
            if (err.response) {
                // Error del servidor
                const errorMessage = err.response.data.message || err.response.data.error || 'Error creating account';
                setError(errorMessage);
            } else if (err.request) {
                // Error de conexión
                setError('Cannot connect to server. Please check your connection.');
            } else {
                // Otro tipo de error
                setError('An unexpected error occurred');
            }
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/auth/google`, {
                credential: credentialResponse.credential,
            });
            localStorage.setItem('token', response.data.token);
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
            <div className="signup-container">
                <h2 className="signup-title">
                    Create Your<br />Account
                    <img src="/PlantIcon.png" alt="Plant" className="signup-plant-icon" />
                </h2>
                <form className="signup-form" onSubmit={handleSubmit} autoComplete="off">
                    <div className="signup-form-group">
                        <label htmlFor="firstName" className="signup-label">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            className="signup-input"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            autoComplete="off"
                            required
                        />
                    </div>
                    <div className="signup-form-group">
                        <label htmlFor="lastName" className="signup-label">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            className="signup-input"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            autoComplete="off"
                            required
                        />
                    </div>
                    <div className="signup-form-group">
                        <label htmlFor="email" className="signup-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="signup-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="off"
                            required
                        />
                    </div>
                    <div className="signup-form-group">
                        <label htmlFor="password" className="signup-label">Password</label>
                        <div className="signup-password-input-container">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                className="signup-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                                required
                            />
                            <button
                                type="button"
                                className="signup-password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>
                    <div className="signup-form-group">
                        <label htmlFor="confirmPassword" className="signup-label">Repeat Password</label>
                        <div className="signup-password-input-container">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                className="signup-input"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                autoComplete="new-password"
                                required
                            />
                            <button
                                type="button"
                                className="signup-password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>
                    {error && <p className="signup-error-message">{error}</p>}
                    <button type="submit" className="signup-submit-button">Sign Up</button>
                </form>
                <div className="signup-divider">
                    <span className="signup-divider-line"></span>
                    <span className="signup-divider-text">or sign up with</span>
                    <span className="signup-divider-line"></span>
                </div>
                <div className="signup-social-icons">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        width="auto"
                        useOneTap
                    />
                </div>
                <div className="signup-login-section">
                    <button className="signup-login-button" onClick={() => navigate('/login')}>
                        Already have an account? Sign in here!
                    </button>
                </div>
                <nav className="bottom-navbar-signup">
                    <a href="/home" className="nav-icon" aria-label="Home">
                        <img src="/src/assets/Icons/Home.png" alt="Home" />
                    </a>
                    <a href="/search" className="nav-icon" aria-label="Search">
                        <img src="/SearchIcon.png" alt="Search" />
                    </a>
                    <a href="/login" className="nav-icon" aria-label="Avatar">
                        <img src="/src/assets/Icons/AvatarSeccion.png" alt="Avatar" />
                    </a>
                </nav>
            </div>
        </GoogleAuthProviderWrapper>
    );
};

export default SignUp;