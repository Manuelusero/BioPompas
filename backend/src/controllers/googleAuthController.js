import User from "../models/User.js";
import jwt from "jsonwebtoken";
import axios from "axios";

export const googleLogin = async (req, res) => {
    const { credential } = req.body;
    if (!credential) {
        return res.status(400).json({ error: "No credential provided" });
    }

    try {
        // Verifica el token con Google
        const googleResponse = await axios.get(
            `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`
        );
        const { email, name } = googleResponse.data;
        if (!email) {
            return res.status(400).json({ error: "Google token invalid" });
        }

        // Busca o crea el usuario
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({
                name: name || email.split("@")[0],
                email,
                password: "google_oauth", // No se usa, pero es requerido por el schema
                isVerified: true,
            });
            await user.save();
        }

        // Genera un JWT local
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({ token });
    } catch (error) {
        res.status(401).json({ error: "Google authentication failed" });
    }
};
