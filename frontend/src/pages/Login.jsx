import React, { useState } from 'react';
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
        } catch (error) {
            setError('Error al iniciar sesión');
        }
    };

    return (
        <div classNameName="login-container">
            <h2 classNameName="login-title">Welcome</h2>
            <form classNameName="login-form" onSubmit={handleSubmit}>
                <div classNameName="form-group">
                    <label htmlFor="email">Email address</label>
                    <input
                        type="email"
                        id="email"
                        classNameName="form-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div classNameName="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        classNameName="form-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p classNameName="error-message">{error}</p>}
                <button type="submit" classNameName="login-button">Iniciar sesión</button>
            </form>
            <div classNameName="login-links">
                <button classNameName="link-button" onClick={() => navigate('/register')}>
                    Crear una cuenta
                </button>
                <button classNameName="link-button" onClick={() => navigate('/forgot-password')}>
                    ¿Olvidaste tu contraseña?
                </button>
            </div>
        </div>
    );
};

export default Login;
