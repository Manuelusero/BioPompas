import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticateToken = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. No se proporcionó token.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
        return res.status(401).json({ error: 'Usuario no encontradp.'});
    }
   
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};
// Verifica si el usuario tiene rol de administrador
export const authorizeAdmin = (req, res, next) => {
    if (req.user?.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de administrador.' });
    }
  };