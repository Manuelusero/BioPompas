import { body, validationResult } from 'express-validator';

export const validateRegistration = [
  body('email').isEmail().withMessage('Correo electrónico inválido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('firstName').not().isEmpty().withMessage('El nombre es obligatorio'),
  body('lastName').not().isEmpty().withMessage('El apellido es obligatorio'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateLogin = [
  body('email').isEmail().withMessage('Correo electrónico inválido'),
  body('password').not().isEmpty().withMessage('La contraseña es obligatoria'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("❌ Error de validación:", errors.array());  // 🛑 Verifica si está fallando la validación
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateForgotPassword = [
  body('email').isEmail().withMessage('Correo electrónico inválido'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateResetPassword = [
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('La nueva contraseña debe tener al menos 6 caracteres'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
