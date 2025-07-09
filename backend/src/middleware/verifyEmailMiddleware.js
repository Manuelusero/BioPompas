export const verifyEmailStatus = (req, res, next) => {
    if (!req.user.isVerified) {
      return res.status(400).json({ error: 'Por favor verifica tu correo antes de acceder a esta ruta.' });
    }
    next();
  };
  