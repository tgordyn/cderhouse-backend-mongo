import Ticket from "../models/tickets.js";
import mailTransporter from "../utils/mailTransporter.js";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Obtener el detalle del ticket
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId).lean();

    if (!ticket) {
      return res.status(404).json({ message: "Ticket no encontrado." });
    }

    res.render("ticketDetail", { ticket });
  } catch (err) {
    console.error("Error al obtener el ticket:", err);
    res.status(500).send("Error al obtener el ticket");
  }
};

// Enviar el ticket por correo
export const sendTicketByEmail = async (req, res) => {
  const ticketId = req.params.id;
  try {
    const ticket = await Ticket.findById(ticketId).populate("products.product").lean();
    const user = req.user;

    if (!ticket) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    const mailOptions = {
      from: process.env.MAIL,
      to: user.email,
      subject: "Tu ticket de compra",
      text: `Hola ${user.first_name}, gracias por tu compra! Aquí tienes el detalle de tu ticket:
      Número de Ticket: ${ticket._id}
      Productos: ${ticket.products.map(item => `${item.product.title} - Cantidad: ${item.quantity}`).join("\n")}
      Total: $${ticket.amount}`,
    };

    await mailTransporter.sendMail(mailOptions);
    return res.status(200).send(`
      <p>Correo enviado exitosamente</p>
      <a href="/">Volver a la tienda</a>
    `);
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    return res.status(500).send(`
      <p>Error al enviar correo</p>
      <a href="/">Volver a la tienda</a>
    `);
  }
};

// Enviar el ticket por SMS
export const sendTicketBySms = async (req, res) => {
  const ticketId = req.params.id;
  try {
    const ticket = await Ticket.findById(ticketId).populate("products.product").lean();
    const user = req.user;

    if (!ticket) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    await client.messages.create({
      body: `Hola ${user.first_name}, gracias por tu compra! Aquí tienes el detalle de tu ticket:
      Número de Ticket: ${ticket._id}
      Total: $${ticket.amount}`,
      from: process.env.TWILIO_SMS_NUMBER,
      to: "+5491169343123", // mi numero, configurado para prueba en twilio
    });

    return res.status(200).send(`
      <p>SMS enviado exitosamente</p>
      <a href="/">Volver a la tienda</a>
    `);
  } catch (error) {
    console.error("Error al enviar el SMS:", error);
    return res.status(500).send(`
      <p>Error al enviar el mensaje</p>
      <a href="/">Volver a la tienda</a>
    `);
  }
};
