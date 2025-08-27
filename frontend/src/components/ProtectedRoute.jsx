import { Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../hooks/useAuth';
import AuthPopup from './AuthPopup';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const [showPopup, setShowPopup] = useState(true);
    const [shouldGoBack, setShouldGoBack] = useState(false);
    const navigate = useNavigate();

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                backgroundColor: '#F6F5F0'
            }}>
                <div>Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        if (shouldGoBack) {
            // Regresar al carrito
            navigate('/bag', { replace: true });
            return null;
        }

        if (showPopup) {
            return (
                <AuthPopup
                    isOpen={true}
                    onClose={() => {
                        setShowPopup(false);
                        setShouldGoBack(true);
                    }}
                    onLogin={() => {
                        window.location.href = '/login';
                    }}
                    message="To proceed with payment, you need to sign in to your account."
                />
            );
        } else {
            return <Navigate to="/login" replace />;
        }
    }

    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRoute;