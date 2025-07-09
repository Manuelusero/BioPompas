import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { sendVerificationEmail } from "../config/email.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  console.log('Datos recibidos:', req.body);

  if (!email || !password) {
    console.error('Faltan campos obligatorios:', { email, password });
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken,
    });

    await newUser.save();
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({ message: "Usuario registrado. Revisa tu email para verificar tu cuenta." });
  } catch (error) {
    console.error('Error al registrar usuario:', error.message);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};


export const verifyEmail = async (req, res) => {
    const { token } = req.params;
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({ email: decoded.email });
  
      if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
  
      user.isVerified = true;
      user.verificationToken = null;
      await user.save();

      res.json({ message: "Cuenta verificada correctamente. Ahora puedes iniciar sesión." });

     
    } catch (error) {
      res.status(500).json({ error: "Token inválido o expirado." });
    }
  };

  export const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
        console.log("Intentando iniciar sesión con:", email); // <-- DEBUG
  
        const user = await User.findOne({ email });
        if (!user) {
            console.log("Usuario no encontrado");
            return res.status(400).json({ error: "Usuario no encontrado" });
        }
  
        if (!user.isVerified) {
            console.log("Usuario no verificado");
            return res.status(400).json({ error: "Por favor verifica tu correo antes de iniciar sesión" });
        }
  
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Contraseña incorrecta");
            return res.status(400).json({ error: "Contraseña incorrecta" });
        }
  
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        console.log("Inicio de sesión exitoso, token generado");
        res.json({ token });

    } catch (error) {
        console.error("Error en el login:", error); // <-- DEBUG IMPORTANTE
        res.status(500).json({ error: "Error al iniciar sesión" });
    }
};


  export const forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    try {
      // Buscar al usuario por email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      // Crear un token para el restablecimiento de contraseña
      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      // Guardar el token en la base de datos para su validación más tarde
      user.resetPasswordToken = token;
      await user.save();
  
      // Enviar el email con el enlace para restablecer la contraseña
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
  
      const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
      await transporter.sendMail({
        to: user.email,
        subject: 'Restablece tu contraseña',
        text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetLink}`,
      });
  
      res.status(200).json({ message: 'Se ha enviado un enlace para restablecer tu contraseña' });
    } catch (error) {
      res.status(500).json({ error: 'Error al enviar el email' });
    }
  };

  export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
  
    try {
      // Verificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Buscar al usuario
      const user = await User.findOne({ email: decoded.email });
      if (!user || user.resetPasswordToken !== token) {
        return res.status(400).json({ error: 'Token inválido o expirado' });
      }
  
      // Hashear la nueva contraseña
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Actualizar la contraseña y borrar el token
      user.password = hashedPassword;
      user.resetPasswordToken = null;
      await user.save();
  
      res.status(200).json({ message: 'Contraseña restablecida con éxito' });
    } catch (error) {
      res.status(500).json({ error: 'Error al restablecer la contraseña' });
    }
  };
  

