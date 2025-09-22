import { useState, useEffect, createContext, useContext } from 'react';
import PropTypes from 'prop-types'; // Agregar import de PropTypes

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        // Si no hay contexto, lanzar error en lugar de usar hooks condicionalmente
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        // Inicializar con el estado actual del localStorage
        return !!localStorage.getItem('token');
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const newIsLoggedIn = !!token;

            setIsLoggedIn(newIsLoggedIn);
            setLoading(false);
        };

        // Verificar inmediatamente
        checkAuth();

        const handleStorageChange = (e) => {
            if (e.key === 'token') {
                checkAuth();
            }
        };

        const handleAuthChange = () => {
            checkAuth();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('authChange', handleAuthChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('authChange', handleAuthChange);
        };
    }, []); // Dependencias vacías para evitar loops

    const login = (token) => {
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
        setLoading(false);
        window.dispatchEvent(new Event('authChange'));
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setLoading(false);
        window.dispatchEvent(new Event('authChange'));
    };

    const value = {
        isLoggedIn,
        loading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Agregar PropTypes para AuthProvider
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};