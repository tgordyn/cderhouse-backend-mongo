import nodemailer from 'nodemailer';
import dotenv from "dotenv";

dotenv.config();
const MAIL = process.env.MAIL;
const MAIL_PASS = process.env.MAIL_PASS;

// Configura el transporte con tus credenciales de Google
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MAIL,
    pass: MAIL_PASS,
  },
});

export default transporter;
