import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware para proteger rutas (más completo, con lookup de usuario)
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'No autorizado, no hay token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    console.error('Error verificando token:', error);
    res.status(401).json({ message: 'No autorizado, token inválido' });
  }
};

// Middleware para autenticar el token (más ligero, solo verifica token)
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No autorizado, no hay token' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }

    try {
      // Buscar el usuario y adjuntarlo al request
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'Usuario no encontrado' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  });
};

// Middleware para verificar si el usuario es administrador
export const authorizeAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado, no eres administrador' });
  }
  next();
};