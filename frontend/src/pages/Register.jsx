import { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        try {
            await axios.post(`${import.meta.env.VITE_APP_API_URL}/auth/register`, {
                name,
                email,
                password,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('API URL:', import.meta.env.VITE_APP_API_URL);
            setSuccessMessage("Registro exitoso. Revisa tu correo para verificar tu cuenta.");

            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');

        } catch (err) {
            console.error('Error completo:', err);
            setError(err.response?.data?.message || 'Error desconocido al registrar el usuario');
        }
    }

    return (
        <div>
            <h2>Registrarse</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Confirmar Contraseña</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>} {/* Muestra el mensaje de éxito */}
                <button type="submit">Registrarse</button>
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

export default Register;
