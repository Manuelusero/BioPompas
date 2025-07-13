import { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user);
      } catch (err) {
        setError('No autorizado o token inválido' + (err?.response?.data?.error ? ': ' + err.response.data.error : ''));
      }
    };
    fetchProfile();
  }, []);

  if (error) return <div style={{color: 'red'}}>{error}</div>;
  if (!user) return <div>Loading...</div>;

  return (
    <div style={{padding: 24}}>
      <h2>Profile</h2>
      <p><b>Name:</b> {user.name}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Role:</b> {user.role}</p>
    </div>
  );
};

export default Profile;
