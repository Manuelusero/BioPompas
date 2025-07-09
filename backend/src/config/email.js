import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Verifica que las variables de entorno existen
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error("Faltan las credenciales de email en el archivo .env");
}

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (email, token) => {
  try {
    const url = new URL(`/verify-email/${token}`, process.env.CLIENT_URL.endsWith('/') ? process.env.CLIENT_URL : `${process.env.CLIENT_URL}/`).href;

    console.log("URL generada para verificación:", url);


    const mailOptions = {
      from: `"Soporte" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verifica tu cuenta",
      html: `
        <h1>Verifica tu cuenta</h1>
        <p>Haz click en el siguiente enlace para verificar tu cuenta:</p>
        <a href="${url}">${url}</a>
        <p>Una vez verificada, serás redirigido automáticamente a la página de inicio de sesión.</p>
        <p>Si no solicitaste este registro, ignora este mensaje.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado:", info.response);
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw new Error("No se pudo enviar el correo de verificación");
  }
};
