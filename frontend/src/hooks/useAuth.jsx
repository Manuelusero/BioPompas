import { useState, useEffect, createContext, useContext } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
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
    }, []);

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

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
