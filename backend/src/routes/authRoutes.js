import { Router } from 'express';
import { register, login, verifyEmail, forgotPassword, resetPassword } from '../controllers/authController.js';
import { 
  validateRegistration, 
  validateLogin, 
  validateForgotPassword, 
  validateResetPassword 
} from '../middleware/validateInput.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { verifyEmailStatus } from '../middleware/verifyEmailMiddleware.js';

const router = Router();

// Ruta de registro (con validación de entrada)
router.post('/register', validateRegistration, register);

// Ruta de login (con validación de entrada)
router.post('/login', validateLogin, login);

// Ruta para verificar el email
router.get('/verify-email/:token', verifyEmail);

// Ruta para "forgot password" (con validación de entrada)
router.post('/forgot-password', validateForgotPassword, forgotPassword);

// Ruta para restablecer la contraseña (con validación de entrada)
router.post('/reset-password/:token', validateResetPassword, resetPassword);

// Rutas protegidas por token de autenticación (Ejemplo)
router.get('/protected', authenticateToken, verifyEmailStatus, (req, res) => {
  res.status(200).json({ message: 'Ruta protegida, acceso autorizado.' });
});

export default router;
