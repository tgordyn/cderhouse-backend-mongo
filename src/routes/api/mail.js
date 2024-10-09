import express from 'express';
import mailTransporter from '../../utils/mailTransporter.js';
import dotenv from "dotenv";

dotenv.config();


const router = express.Router();

// Ruta para enviar el ticket por correo
router.get('/ticket/:id', async (req, res) => {
  const ticketId = req.params.id;
  console.log('ruta mail');
  try {
    const ticket = await Ticket.findById(ticketId).populate('products.product').lean();
    const user = req.user; // Obtener el usuario logueado

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket no encontrado' }); // Devuelve JSON en caso de error
    }

    const mailOptions = {
      from: process.env.MAIL,
      to: user.email, // Correo del usuario autenticado
      subject: 'Tu ticket de compra',
      text: `Hola ${user.first_name}, gracias por tu compra! Aquí tienes el detalle de tu ticket:
      Número de Ticket: ${ticket._id}
      Productos: ${ticket.products.map(item => `${item.product.title} - Cantidad: ${item.quantity}`).join('\n')}
      Total: $${ticket.totalPrice}`,
    };

    await mailTransporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Correo enviado exitosamente' }); // Responde con JSON

  } catch (error) {
    console.error('Error al enviar el correo:', error);
    return res.status(500).json({ error: 'Error al enviar el correo' }); // Responde con JSON en caso de error
  }
});


export default router;
