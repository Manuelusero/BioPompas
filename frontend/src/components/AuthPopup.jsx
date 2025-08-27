import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './AuthPopup.css';

const AuthPopup = ({ isOpen, onClose, onLogin, message }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const handleLogin = () => {
        setIsVisible(false);
        setTimeout(() => {
            onLogin();
        }, 300);
    };

    if (!isOpen && !isVisible) return null;

    return (
        <div className={`auth-popup-overlay ${isVisible ? 'visible' : ''}`}>
            <div className={`auth-popup ${isVisible ? 'visible' : ''}`}>
                <div className="auth-popup-content">
                    <h3 className="auth-popup-title">Login Required</h3>
                    <p className="auth-popup-message">
                        {message || "To proceed with payment, you need to sign in to your account."}
                    </p>
                    <div className="auth-popup-buttons">
                        <button 
                            className="auth-popup-button auth-popup-login"
                            onClick={handleLogin}
                        >
                            Sign In
                        </button>
                        <button 
                            className="auth-popup-button auth-popup-cancel"
                            onClick={handleClose}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

AuthPopup.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onLogin: PropTypes.func.isRequired,
    message: PropTypes.string
};

export default AuthPopup;