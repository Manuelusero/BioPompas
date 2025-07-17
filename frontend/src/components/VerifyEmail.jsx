import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState('Verificando tu cuenta...');

    useEffect(() => {
        const verifyAccount = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/auth/verify-email/${token}`);
                setMessage(response.data.message);
                setTimeout(() => {
                    navigate('/bag');
                }, 2500);

            } catch (error) {
                alert(`Error verificando la cuenta: ${error?.response?.data?.message || error.message || 'Intenta de nuevo.'}`);

            }
        };
        verifyAccount();
    }, [token, navigate]);

    return (
        <div className="verify-email-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', background: '#f6f7ef' }}>
            <button className="verify-close-btn" style={{ position: 'absolute', left: 24, top: 24, background: 'none', border: 'none', fontSize: '2rem', color: '#5c7347', cursor: 'pointer' }} onClick={() => navigate('/home')}>&times;</button>
            <img src="/LogoSmall.svg" alt="BioPompas" style={{ width: 120, marginBottom: 32 }} />
            <img src="/src/assets/Icons/MailIcon.png" alt="Mail" style={{ width: 64, marginBottom: 24 }} />
            <h2 style={{ color: '#3a5a40', fontFamily: 'Explore Magic, Raleway, sans-serif', fontWeight: 700, marginBottom: 12 }}>Check your email!</h2>
            <p style={{ color: '#3a5a40', fontSize: '1.1rem', textAlign: 'center', marginBottom: 8 }}>{message}</p>
        </div>
    );
};

export default VerifyEmail;
