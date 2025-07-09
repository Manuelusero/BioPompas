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
                    navigate('/login');
                }, 3000);

            } catch (error) {
                alert('Error verificando la cuenta. Intenta de nuevo.');

            }
        };
        verifyAccount();
    }, [token, navigate]);

    return (
        <div>
            <h2>Verificando tu cuenta...</h2>
            <p>{message}</p>
        </div>
    );
};

export default VerifyEmail;
