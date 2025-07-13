import PropTypes from 'prop-types';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GoogleAuthProviderWrapper = ({ children }) => {
  // Reemplaza por tu Client ID de Google Cloud Console
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'TU_CLIENT_ID_AQUI';
  return <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>;
};

GoogleAuthProviderWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GoogleAuthProviderWrapper;
