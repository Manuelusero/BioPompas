import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
  // Usar verificación directa de localStorage temporalmente
  const isLoggedIn = !!localStorage.getItem('token');
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;