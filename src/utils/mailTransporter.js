import nodemailer from 'nodemailer';
import dotenv from "dotenv";

dotenv.config();
const MAIL = process.env.MAIL;
const MAIL_PASS = process.env.MAIL_PASS;

// Configura el transporte con tus credenciales de Google
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MAIL, // Tu dirección de Gmail
    pass: MAIL_PASS, // La contraseña de aplicaciones que obtuviste
  },
});

export default transporter;
